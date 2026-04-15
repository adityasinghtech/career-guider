import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  BarChart3,
  Send,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Eye,
  ShieldCheck,
  ShieldOff,
  CalendarDays,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import DailyActivityChart from "./DailyActivityChart";
import DashboardStats from "./admin/DashboardStats";
import ActivityFeed from "./admin/ActivityFeed";
import StudentRow from "./admin/StudentRow";
import MessageRow from "./admin/MessageRow";
import AnalyticsView from "./admin/AnalyticsView";
import FeedbackView from "./admin/FeedbackView";
import SuggestionModal from "./admin/SuggestionModal";

interface StudentData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  class: string;
  created_at: string;
}

interface QuizResultData {
  id: string;
  user_id: string;
  stream: string;
  scores: any;
  created_at: string;
}

type ContactIssueKind = "quiz" | "login" | "result" | "career" | "other";

type MessageIssueFilter = "all" | "quiz" | "login" | "career";

const ISSUE_PREFIX_BY_KIND: Record<ContactIssueKind, string> = {
  quiz: "[QUIZ ISSUE] ",
  login: "[LOGIN ISSUE] ",
  result: "[RESULT ISSUE] ",
  career: "[CAREER GUIDANCE] ",
  other: "[OTHER] ",
};

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  sender_type: string;
  is_read: boolean;
  issue_type?: string | null;
  created_at: string;
  admin_reply?: string | null;
  replied_at?: string | null;
  status?: string;
}

function normalizeIssueTypeFromDb(raw: string | null | undefined): ContactIssueKind | null {
  if (!raw || !raw.trim()) return null;
  const v = raw.trim().toLowerCase().replace(/\s+/g, "_");
  const map: Record<string, ContactIssueKind> = {
    quiz: "quiz",
    login: "login",
    result: "result",
    career: "career",
    other: "other",
    quiz_issue: "quiz",
    login_issue: "login",
    result_issue: "result",
    career_guidance: "career",
  };
  return map[v] ?? null;
}

function resolveIssueKind(msg: ContactMessage): ContactIssueKind | null {
  const fromCol = normalizeIssueTypeFromDb(msg.issue_type ?? undefined);
  if (fromCol) return fromCol;
  const text = msg.message;
  const order: ContactIssueKind[] = ["quiz", "login", "result", "career", "other"];
  for (const k of order) {
    if (text.startsWith(ISSUE_PREFIX_BY_KIND[k])) return k;
  }
  return null;
}

function displayMessageBody(msg: ContactMessage, kind: ContactIssueKind | null): string {
  if (kind && msg.message.startsWith(ISSUE_PREFIX_BY_KIND[kind])) {
    return msg.message.slice(ISSUE_PREFIX_BY_KIND[kind].length);
  }
  for (const prefix of Object.values(ISSUE_PREFIX_BY_KIND)) {
    if (msg.message.startsWith(prefix)) return msg.message.slice(prefix.length);
  }
  return msg.message;
}

interface UserRole {
  user_id: string;
  role: string;
}

const CLASS_ORDER = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "12th Pass"] as const;

// ─── External Components used (Stats, ActivityFeed, StudentRow, MessageRow, Analytics, Feedback, Modal) ───

function isCreatedToday(iso: string): boolean {
  const d = new Date(iso);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

function parseQuizScores(raw: unknown): { science: number; commerce: number; arts: number } | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const science = Number(o.science);
  const commerce = Number(o.commerce);
  const arts = Number(o.arts);
  if (![science, commerce, arts].every((n) => Number.isFinite(n))) return null;
  return { science, commerce, arts };
}

interface FeedbackItem {
  id: string;
  message: string;
  user_email: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResultData[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [search, setSearch] = useState("");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [suggestionText, setSuggestionText] = useState("");
  const [sendingTo, setSendingTo] = useState<{ studentId: string; resultId?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "analytics" | "messages" | "feedback">("students");
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [messageIssueFilter, setMessageIssueFilter] = useState<MessageIssueFilter>("all");
  const [messagesUnreadOnly, setMessagesUnreadOnly] = useState(false);
  const [confirmAdmin, setConfirmAdmin] = useState<string | null>(null);
  const [adminSuggestions, setAdminSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Activity Feed
  const [showActivityFeed, setShowActivityFeed] = useState(false);

  const activityFeed = useMemo(() => {
    const items: { type: 'student' | 'quiz' | 'message'; text: string; time: string; id: string }[] = [];
    
    students.slice(0, 5).forEach(s => items.push({
      type: 'student',
      text: `${s.full_name || 'Unknown'} joined (${s.city || 'Unknown city'})`,
      time: s.created_at,
      id: s.id
    }));
    
    quizResults.slice(0, 5).forEach(r => {
      const student = students.find(s => s.id === r.user_id);
      items.push({
        type: 'quiz',
        text: `${student?.full_name || 'Student'} ne ${r.stream} quiz diya`,
        time: r.created_at,
        id: r.id
      });
    });
    
    contactMessages.slice(0, 5).forEach(m => items.push({
      type: 'message',
      text: `${m.name} ka message: "${m.message.slice(0, 40)}..."`,
      time: m.created_at,
      id: m.id
    }));
    
    return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);
  }, [students, quizResults, contactMessages]);

  useEffect(() => {
    const fetchData = async () => {
      const [resProfiles, resResults, resMessages, resRoles, resFeedbacks, resSuggestions] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("quiz_results").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
        supabase.from("feedback").select("*").order("created_at", { ascending: false }),
        supabase.from("admin_suggestions").select("*").order("created_at", { ascending: false }),
      ]);
      setStudents((resProfiles.data as StudentData[]) || []);
      setQuizResults(resResults.data || []);
      setContactMessages((resMessages.data as ContactMessage[]) || []);
      setUserRoles((resRoles.data as UserRole[]) || []);
      setFeedbacks((resFeedbacks.data as FeedbackItem[]) || []);
      setAdminSuggestions(resSuggestions.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    // New students
    const profilesSub = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' },
        (payload) => {
          setStudents(prev => [payload.new as StudentData, ...prev]);
          toast.success(`<span aria-hidden='true'>🎉</span> Naya student join kiya: ${(payload.new as StudentData).full_name || 'Unknown'}`);
        }
      ).subscribe();

    // New quiz results
    const quizSub = supabase
      .channel('quiz-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quiz_results' },
        (payload) => {
          setQuizResults(prev => [payload.new as QuizResultData, ...prev]);
          toast.info(`<span aria-hidden='true'>📝</span> Naya quiz result aaya!`);
        }
      ).subscribe();

    // New contact messages
    const msgSub = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        (payload) => {
          setContactMessages(prev => [payload.new as ContactMessage, ...prev]);
          toast.warning(`<span aria-hidden='true'>💬</span> Naya message aaya! Reply zaroor dena.`);
        }
      ).subscribe();

    // New suggestions
    const suggestionSub = supabase
      .channel('suggestions-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_suggestions' },
        (payload) => {
          setAdminSuggestions(prev => [payload.new, ...prev]);
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(profilesSub);
      supabase.removeChannel(quizSub);
      supabase.removeChannel(msgSub);
      supabase.removeChannel(suggestionSub);
    };
  }, []);

  const markMessageRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
  };

  const isAdmin = (userId: string) => userRoles.some((r) => r.user_id === userId && r.role === "admin");

  const grantAdminRole = async (studentId: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: studentId, role: "admin" } as any);
    if (error) {
      toast.error("Admin role dene mein dikkat aayi");
      return;
    }
    setUserRoles((prev) => [...prev, { user_id: studentId, role: "admin" }]);
    toast.success("Admin role de diya gaya! <span aria-hidden='true'>🛡️</span>");
    setConfirmAdmin(null);
  };

  const removeAdminRole = async (studentId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", studentId).eq("role", "admin");
    if (error) {
      toast.error("Admin role hatane mein dikkat aayi");
    } else {
      setUserRoles((prev) => prev.filter((r) => !(r.user_id === studentId && r.role === "admin")));
      toast.success("Admin role hata diya gaya <span aria-hidden='true'>✅</span>");
    }
  };

  const unreadCount = contactMessages.filter((m) => !m.is_read).length;

  const filteredStudents = students.filter(
    (s) =>
      s.id !== user?.id &&
      (s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.city?.toLowerCase().includes(search.toLowerCase()))
  );

  const studentStatusMap = useMemo(() => {
    const map: Record<string, {
      hasSuggestion: boolean;
      hasMessage: boolean;
      lastActivity: string | null;
      pendingReply: boolean;
      unrepliedCount: number;
      hasLowScore: boolean;
    }> = {};
    
    students.forEach(s => {
      const results = quizResults.filter(r => r.user_id === s.id);
      const msgs = contactMessages.filter(m => m.email === s.email);
      const unrepliedMsgs = msgs.filter(m => m.status !== 'replied' && !m.admin_reply);
      const suggestions = adminSuggestions.filter(su => su.user_id === s.id);
      
      // Low score if any science/commerce/arts score is < 40
      const hasLowScore = results.some(r => {
        const sc = parseQuizScores(r.scores);
        return sc && (sc.science < 40 || sc.commerce < 40 || sc.arts < 40);
      });
      
      map[s.id] = {
        hasSuggestion: suggestions.length > 0, 
        hasMessage: msgs.length > 0,
        lastActivity: results[0]?.created_at || s.created_at,
        pendingReply: unrepliedMsgs.length > 0,
        unrepliedCount: unrepliedMsgs.length,
        hasLowScore: !!hasLowScore
      };
    });
    
    return map;
  }, [students, quizResults, contactMessages, adminSuggestions]);

  const getStudentResults = (studentId: string) =>
    quizResults.filter((r) => r.user_id === studentId);

  const sendSuggestion = async () => {
    if (!sendingTo || !suggestionText.trim() || !user) return;
    const { error } = await supabase.from("admin_suggestions").insert({
      admin_id: user.id,
      student_id: sendingTo.studentId,
      quiz_result_id: sendingTo.resultId || null,
      message: suggestionText.trim(),
    });
    if (error) {
      toast.error("Suggestion bhej nahi paaye");
    } else {
      toast.success("Suggestion bhej diya gaya! <span aria-hidden='true'>✅</span>");
      setSuggestionText("");
      setSendingTo(null);
    }
  };

  const exportStudentsCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Class', 'Joined', 'Quiz Results'];
    const rows = students.map(s => {
      const results = getStudentResults(s.id);
      return [
        s.full_name || '',
        s.email || '',
        s.phone || '',
        s.city || '',
        s.class || '',
        new Date(s.created_at).toLocaleDateString('en-IN'),
        results.map(r => r.stream).join('; ') || 'No quiz'
      ];
    });
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pathfinder-students-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success(`CSV download ho rahi hai! <span aria-hidden='true'>📁</span>`);
  };

  // Analytics
  const totalStudents = students.filter((s) => s.id !== user?.id).length;
  const totalQuizzes = quizResults.length;
  const streamCounts: Record<string, number> = {};
  const stateCounts: Record<string, number> = {};
  quizResults.forEach((r) => {
    streamCounts[r.stream] = (streamCounts[r.stream] || 0) + 1;
  });
  students.forEach((s) => {
    if (s.city && s.id !== user?.id) {
      stateCounts[s.city] = (stateCounts[s.city] || 0) + 1;
    }
  });

  const analyticsExtra = useMemo(() => {
    const studentList = students.filter((s) => s.id !== user?.id);

    const cityAgg: Record<string, number> = {};
    studentList.forEach((s) => {
      if (s.city?.trim()) {
        const city = s.city.trim();
        cityAgg[city] = (cityAgg[city] || 0) + 1;
      }
    });

    const classCounts: Record<string, number> = {};
    CLASS_ORDER.forEach((c) => {
      classCounts[c] = 0;
    });
    let classOther = 0;
    let classUnset = 0;
    studentList.forEach((s) => {
      const c = s.class?.trim() || "";
      if (!c) {
        classUnset++;
        return;
      }
      if (CLASS_ORDER.includes(c as (typeof CLASS_ORDER)[number])) {
        classCounts[c]++;
      } else {
        classOther++;
      }
    });

    const interestCounts = {
      tech: 0,
      business: 0,
      creative: 0,
      sports: 0,
      skills: 0,
      undecided: 0,
    };

    quizResults.forEach((r) => {
      const sc = parseQuizScores(r.scores);
      if (sc) {
        const { science: S, commerce: C, arts: A } = sc;
        const tot = S + C + A;
        if (tot > 0) {
          const mx = Math.max(S, C, A);
          const mn = Math.min(S, C, A);
          if ((mx - mn) / tot <= 0.15) {
            interestCounts.undecided++;
            return;
          }
        }
      }
      const st = (r.stream || "").toLowerCase();
      if (st === "science") interestCounts.tech++;
      else if (st === "commerce") interestCounts.business++;
      else if (st === "arts") interestCounts.creative++;
      else if (st === "sports") interestCounts.sports++;
      else if (st === "skills") interestCounts.skills++;
      else interestCounts.undecided++;
    });

    const newStudentsToday = studentList.filter((s) => isCreatedToday(s.created_at)).length;
    const quizzesToday = quizResults.filter((r) => isCreatedToday(r.created_at)).length;
    const messagesToday = contactMessages.filter((m) => isCreatedToday(m.created_at)).length;

    const top5Cities = Object.entries(cityAgg)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    const topCityMax = top5Cities.length ? top5Cities[0][1] : 1;

    const classTotal = studentList.length;

    return {
      classCounts,
      classOther,
      classUnset,
      interestCounts,
      newStudentsToday,
      quizzesToday,
      messagesToday,
      top5Cities,
      topCityMax,
      classTotal,
    };
  }, [students, quizResults, contactMessages, user?.id]);

  const statsWithTrend = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const studentsYesterday = students.filter(s => s.created_at.startsWith(yesterdayStr)).length;
    const quizzesYesterday = quizResults.filter(r => r.created_at.startsWith(yesterdayStr)).length;
    
    return {
      newStudentsToday: analyticsExtra.newStudentsToday,
      studentsYesterday,
      quizzesToday: analyticsExtra.quizzesToday,
      quizzesYesterday,
    };
  }, [students, quizResults, analyticsExtra]);

  const senderTypeLabels: Record<string, string> = {
    student: `<span aria-hidden='true'>👨‍🎓</span> Student`,
    parent: `<span aria-hidden='true'>👨‍👩‍👦</span> Parent`,
    school: `<span aria-hidden='true'>🏫</span> School`,
    other: "Other",
  };

  const issueBadgeLabel: Record<ContactIssueKind, string> = {
    quiz: "Quiz Issue",
    login: "Login Issue",
    result: "Result Issue",
    career: "Career Guidance",
    other: "Other",
  };

  const issueBadgeClass: Record<ContactIssueKind, string> = {
    quiz: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40",
    login: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/40",
    career: "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/40",
    result: "bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/40",
    other: "bg-muted text-muted-foreground border-border",
  };

  const filteredContactMessages = contactMessages.filter((msg) => {
    if (messagesUnreadOnly && msg.is_read) return false;
    if (messageIssueFilter === "all") return true;
    const kind = resolveIssueKind(msg);
    return kind === messageIssueFilter;
  });

  // Contact messages mein ek grouped view banao
  const messageThreads = useMemo(() => {
    const emailGroups: Record<string, ContactMessage[]> = {};
    contactMessages.forEach(msg => {
      const key = msg.email || msg.name;
      if (!emailGroups[key]) emailGroups[key] = [];
      emailGroups[key].push(msg);
    });
    return emailGroups;
  }, [contactMessages]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="space-y-2 min-w-0">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              <span aria-hidden='true'>🛡️</span> Admin Panel — PathFinder AI
            </h1>
            {user?.email && (
              <p className="text-muted-foreground font-body text-sm break-all">{user.email}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
            <Link
              to="/admin-setup"
              className="inline-flex items-center justify-center gap-1 border-2 border-primary text-primary font-display font-semibold px-4 py-2 rounded-xl hover:bg-primary/5 text-sm transition-colors text-center"
            >
              Naya Invite Code Banao →
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center justify-center gap-2 border-2 border-border text-foreground font-display font-semibold px-5 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs font-display text-muted-foreground">
          Live • Last refreshed: {new Date().toLocaleTimeString('en-IN')}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-2xl border border-border">
        <p className="w-full text-xs font-display font-semibold text-muted-foreground uppercase mb-1">
          <span aria-hidden='true'>⚡</span> Quick Actions
        </p>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 text-xs font-display font-semibold px-3 py-2 rounded-xl border-2 transition-all ${
            unreadCount > 0 
              ? 'gradient-hero text-primary-foreground border-transparent animate-pulse' 
              : 'border-border bg-card hover:border-primary/40'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          {unreadCount > 0 ? `${unreadCount} Unread Messages` : 'Messages'}
        </button>
        
        <button
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-2 text-xs font-display font-semibold px-3 py-2 rounded-xl border-2 border-border bg-card hover:border-primary/40 transition-all"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics
        </button>
        
        <button
          onClick={() => {
            const pending = contactMessages.filter(m => m.status !== 'replied' && !m.admin_reply);
            if (pending.length > 0) {
              setActiveTab('messages');
              setMessagesUnreadOnly(true);
            }
          }}
          className="flex items-center gap-2 text-xs font-display font-semibold px-3 py-2 rounded-xl border-2 border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          Pending Replies ({contactMessages.filter(m => m.status !== 'replied' && !m.admin_reply).length})
        </button>
      </div>

      {/* Stats Overview */}
      <DashboardStats
        totalStudents={totalStudents}
        totalQuizzes={totalQuizzes}
        streamCounts={streamCounts}
        unreadCount={unreadCount}
        statsWithTrend={statsWithTrend}
        analyticsExtra={analyticsExtra}
      />

      {/* Live Activity Feed */}
      <ActivityFeed activityFeed={activityFeed} />

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("students")}
          className={`font-display font-semibold px-5 py-2 rounded-xl text-sm transition-all ${
            activeTab === "students" ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4 inline mr-1" /> Students
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`font-display font-semibold px-5 py-2 rounded-xl text-sm transition-all relative ${
            activeTab === "messages" ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="w-4 h-4 inline mr-1" /> Messages
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`font-display font-semibold px-5 py-2 rounded-xl text-sm transition-all ${
            activeTab === "analytics" ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-1" /> Analytics
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`font-display font-semibold text-sm px-5 py-2.5 rounded-xl transition-all border-2 ${
            activeTab === "feedback"
              ? "gradient-hero text-primary-foreground border-transparent shadow-card"
              : "border-border text-muted-foreground hover:text-foreground bg-muted hover:border-primary/30"
          }`}
        >
          <span aria-hidden="true">⭐</span> Feedback
        </button>
      </div>

      {activeTab === "students" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Naam, email, ya city se search karein..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border bg-background font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
            <button
              onClick={exportStudentsCSV}
              className="flex items-center justify-center gap-2 text-sm font-display font-semibold px-4 py-2.5 rounded-xl border-2 border-border hover:border-primary/40 transition-all bg-card"
            >
              <span aria-hidden="true">📥</span> Export CSV
            </button>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted/60 rounded-xl w-full border border-border" />
              ))}
            </div>
          ) : filteredStudents.length === 0 && !search ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"><span aria-hidden="true">🎓</span></div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                Abhi tak koi student nahi
              </h3>
              <p className="text-muted-foreground font-body text-sm max-w-xs mx-auto">
                Jab students quiz complete karenge, woh yahan dikhenge.
              </p>
              <p className="text-xs text-primary font-display font-semibold mt-3">
                <span aria-hidden="true">💡</span> Share karo: career-guider-six.vercel.app
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-8">Koi student nahi mila</p>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  studentResults={getStudentResults(student.id)}
                  isExpanded={expandedStudent === student.id}
                  onToggleExpand={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                  studentIsAdmin={isAdmin(student.id)}
                  confirmAdmin={confirmAdmin}
                  setConfirmAdmin={setConfirmAdmin}
                  grantAdminRole={grantAdminRole}
                  removeAdminRole={removeAdminRole}
                  studentStatus={studentStatusMap[student.id]}
                  setSendingTo={setSendingTo}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "messages" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Contact Messages <span aria-hidden="true">📨</span>
          </h3>

          {/* Messages tab ke top pe add karo */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 text-center">
              <p className="text-2xl font-display font-bold text-amber-600">
                {contactMessages.filter(m => m.status !== 'replied' && !m.admin_reply).length}
              </p>
              <p className="text-xs text-muted-foreground font-display">Pending Replies</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-3 text-center">
              <p className="text-2xl font-display font-bold text-green-600">
                {contactMessages.filter(m => m.status === 'replied' || m.admin_reply).length}
              </p>
              <p className="text-xs text-muted-foreground font-display">Replied</p>
            </div>
            <div className="bg-primary/10 border border-primary/25 rounded-xl p-3 text-center">
              <p className="text-2xl font-display font-bold text-primary">
                {unreadCount}
              </p>
              <p className="text-xs text-muted-foreground font-display">Unread</p>
            </div>
          </div>

          {contactMessages.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-8">Abhi tak koi message nahi aaya</p>
          ) : (
            <>
              <div className="flex flex-col gap-3 mb-5">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: "all" as const, label: "Sab dikhao" },
                      { id: "quiz" as const, label: "Quiz Issue" },
                      { id: "login" as const, label: "Login Issue" },
                      { id: "career" as const, label: "Career Guidance" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMessageIssueFilter(opt.id)}
                      className={`font-display font-semibold px-3 py-2 rounded-xl text-xs sm:text-sm transition-all border-2 ${
                        messageIssueFilter === opt.id
                          ? "gradient-hero text-primary-foreground border-transparent"
                          : "bg-muted/50 text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMessagesUnreadOnly((v) => !v)}
                  className={`self-start font-display font-semibold px-3 py-2 rounded-xl text-xs sm:text-sm border-2 transition-colors ${
                    messagesUnreadOnly
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  Unread only {messagesUnreadOnly ? '<span aria-hidden="true">✓</span>' : ""}
                </motion.button>
              </div>

              {filteredContactMessages.length === 0 ? (
                <p className="text-center text-muted-foreground font-body py-8">
                  Is filter ke liye koi message nahi mila
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredContactMessages.map((msg) => (
                    <MessageRow
                      key={msg.id}
                      msg={msg}
                      issueKind={resolveIssueKind(msg)}
                      body={displayMessageBody(msg, resolveIssueKind(msg))}
                      senderTypeLabels={senderTypeLabels}
                      issueBadgeClass={issueBadgeClass}
                      issueBadgeLabel={issueBadgeLabel}
                      onMarkRead={markMessageRead}
                      onReplySent={(id, reply) => {
                        setContactMessages((prev) =>
                          prev.map((m) =>
                            m.id === id
                              ? { ...m, admin_reply: reply, status: 'replied', replied_at: new Date().toISOString() }
                              : m
                          )
                        );
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <AnalyticsView
          analyticsExtra={analyticsExtra}
          quizResults={quizResults}
          students={students}
          streamCounts={streamCounts}
          totalQuizzes={totalQuizzes}
          CLASS_ORDER={CLASS_ORDER}
        />
      )}

      {activeTab === "feedback" && (
        <FeedbackView feedbacks={feedbacks} />
      )}

      {/* Suggestion Modal */}
      <SuggestionModal
        sendingTo={sendingTo}
        setSendingTo={setSendingTo}
        suggestionText={suggestionText}
        setSuggestionText={setSuggestionText}
        sendSuggestion={sendSuggestion}
      />
    </div>
  );
};

export default AdminDashboard;
