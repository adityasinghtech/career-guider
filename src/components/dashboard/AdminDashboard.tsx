import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BarChart3,
  Send,
  Search,
  Mail,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import DashboardStats from "./admin/DashboardStats";
import ActivityFeed from "./admin/ActivityFeed";
import StudentRow from "./admin/StudentRow";
import MessageRow from "./admin/MessageRow";
import AnalyticsView from "./admin/AnalyticsView";
import FeedbackView from "./admin/FeedbackView";
import SuggestionModal from "./admin/SuggestionModal";
import { DashboardSkeleton } from "../ui/SkeletonLoader";

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

  useEffect(() => {
    const profilesSub = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' },
        (payload) => {
          setStudents(prev => [payload.new as StudentData, ...prev]);
          toast.success("🎉 Naya student join kiya!");
        }
      ).subscribe();

    const quizSub = supabase
      .channel('quiz-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quiz_results' },
        (payload) => {
          setQuizResults(prev => [payload.new as QuizResultData, ...prev]);
          toast.info("📝 Naya quiz result aaya!");
        }
      ).subscribe();

    const msgSub = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        (payload) => {
          setContactMessages(prev => [payload.new as ContactMessage, ...prev]);
          toast.warning("💬 Naya message aaya!");
        }
      ).subscribe();

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
    toast.success("Admin role de diya gaya! 🛡️");
    setConfirmAdmin(null);
  };

  const removeAdminRole = async (studentId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", studentId).eq("role", "admin");
    if (error) {
      toast.error("Admin role hatane mein dikkat aayi");
    } else {
      setUserRoles((prev) => prev.filter((r) => !(r.user_id === studentId && r.role === "admin")));
      toast.success("Admin role hata diya gaya ✅");
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
      toast.success("Suggestion bhej diya gaya! ✅");
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
    toast.success('CSV download ho rahi hai! 📁');
  };

  const totalStudents = students.filter((s) => s.id !== user?.id).length;
  const totalQuizzes = quizResults.length;
  const streamCounts: Record<string, number> = {};
  quizResults.forEach((r) => {
    streamCounts[r.stream] = (streamCounts[r.stream] || 0) + 1;
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
    CLASS_ORDER.forEach((c) => { classCounts[c] = 0; });
    studentList.forEach((s) => {
      const c = s.class?.trim() || "";
      if (CLASS_ORDER.includes(c as any)) classCounts[c]++;
    });

    const interestCounts = { tech: 0, business: 0, creative: 0, sports: 0, skills: 0, undecided: 0 };
    quizResults.forEach((r) => {
      const st = (r.stream || "").toLowerCase();
      if (st === "science") interestCounts.tech++;
      else if (st === "commerce") interestCounts.business++;
      else if (st === "arts") interestCounts.creative++;
      else if (st === "sports") interestCounts.sports++;
      else if (st === "skills") interestCounts.skills++;
      else interestCounts.undecided++;
    });

      const counts = Object.values(cityAgg);
      return {
        classCounts,
        interestCounts,
        newStudentsToday: studentList.filter((s) => isCreatedToday(s.created_at)).length,
        quizzesToday: quizResults.filter((r) => isCreatedToday(r.created_at)).length,
        messagesToday: contactMessages.filter((m) => isCreatedToday(m.created_at)).length,
        top5Cities: Object.entries(cityAgg).sort(([, a], [, b]) => b - a).slice(0, 5),
        classTotal: studentList.length,
        classUnset: studentList.filter(s => !s.class?.trim()).length,
        classOther: 0, // Simplified for now
        topCityMax: counts.length > 0 ? Math.max(...counts) : 0,
      };
    }, [students, quizResults, contactMessages, user?.id]);

  const statsWithTrend = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return {
      newStudentsToday: analyticsExtra.newStudentsToday,
      studentsYesterday: students.filter(s => s.created_at.startsWith(yesterdayStr)).length,
      quizzesToday: analyticsExtra.quizzesToday,
      quizzesYesterday: quizResults.filter(r => r.created_at.startsWith(yesterdayStr)).length,
    };
  }, [students, quizResults, analyticsExtra]);

  const senderTypeLabels: Record<string, string> = {
    student: "👨‍🎓 Student",
    parent: "👨‍👩‍👦 Parent",
    school: "🏫 School",
    other: "Other",
  };

  const issueBadgeClass: Record<string, string> = {
    quiz: "bg-blue-500/15 text-blue-700 border-blue-500/30",
    login: "bg-orange-500/15 text-orange-700 border-orange-500/30",
    result: "bg-purple-500/15 text-purple-700 border-purple-500/30",
    career: "bg-green-500/15 text-green-700 border-green-500/30",
    other: "bg-gray-500/15 text-gray-700 border-gray-500/30",
  };

  const issueBadgeLabel: Record<string, string> = {
    quiz: "Quiz Issue",
    login: "Login Issue",
    result: "Result Issue",
    career: "Career Guidance",
    other: "Other",
  };

  const filteredContactMessages = contactMessages.filter((msg) => {
    if (messagesUnreadOnly && msg.is_read) return false;
    if (messageIssueFilter === "all") return true;
    const kind = resolveIssueKind(msg);
    return kind === messageIssueFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 pt-24">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="space-y-2 min-w-0">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              🛡️ Admin Panel — PathFinder AI
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

      <div className="flex items-center gap-2 mb-6">
        <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs font-display text-muted-foreground">
          Live • Last refreshed: {new Date().toLocaleTimeString('en-IN')}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-2xl border border-border">
        <p className="w-full text-xs font-display font-semibold text-muted-foreground uppercase mb-1">
          ⚡ Quick Actions
        </p>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 text-xs font-display font-semibold px-3 py-2 rounded-xl border-2 transition-all ${unreadCount > 0
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
      </div>

      <DashboardStats
        totalStudents={totalStudents}
        totalQuizzes={totalQuizzes}
        streamCounts={streamCounts}
        unreadCount={unreadCount}
        statsWithTrend={statsWithTrend}
        analyticsExtra={analyticsExtra}
      />

      <ActivityFeed activityFeed={activityFeed} />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x h-12 items-center">
        <button
          onClick={() => setActiveTab("students")}
          className={`font-display font-semibold px-5 py-2 rounded-xl text-sm transition-all whitespace-nowrap ${activeTab === "students" ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`font-display font-semibold px-5 py-2 rounded-xl text-sm transition-all relative whitespace-nowrap ${activeTab === "messages" ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
        >
          Messages
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`font-display font-semibold px-5 py-2 rounded-xl text-sm transition-all whitespace-nowrap ${activeTab === "analytics" ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`font-display font-semibold text-sm px-5 py-2.5 rounded-xl transition-all border-2 whitespace-nowrap ${activeTab === "feedback"
              ? "gradient-hero text-primary-foreground border-transparent shadow-card"
              : "border-border text-muted-foreground hover:text-foreground bg-muted hover:border-primary/30"
            }`}
        >
          ⭐ Feedback
        </button>
      </div>

      {activeTab === "students" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border bg-background text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <button
              onClick={exportStudentsCSV}
              className="flex items-center justify-center gap-2 text-sm font-display font-semibold px-4 py-2.5 rounded-xl border-2 border-border hover:border-primary/40 transition-all bg-card"
            >
              📥 Export CSV
            </button>
          </div>

          {!loading && filteredStudents.length === 0 ? (
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
          <h3 className="font-display font-bold text-lg text-foreground mb-4">
            Contact Messages 📨
          </h3>
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
                      className={`font-display font-semibold px-3 py-2 rounded-xl text-xs sm:text-sm transition-all border-2 ${messageIssueFilter === opt.id
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
                  className={`self-start font-display font-semibold px-3 py-2 rounded-xl text-xs sm:text-sm border-2 transition-colors ${messagesUnreadOnly
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                >
                  Unread only {messagesUnreadOnly ? "✓" : ""}
                </motion.button>
              </div>

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
