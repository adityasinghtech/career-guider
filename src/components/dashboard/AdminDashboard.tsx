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
  const [activeTab, setActiveTab] = useState<"students" | "analytics" | "messages">("students");
  const [messageIssueFilter, setMessageIssueFilter] = useState<MessageIssueFilter>("all");
  const [messagesUnreadOnly, setMessagesUnreadOnly] = useState(false);
  const [grantAdminConfirm, setGrantAdminConfirm] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [resProfiles, resResults, resMessages, resRoles] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("quiz_results").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
      ]);
      setStudents(resProfiles.data || []);
      setQuizResults(resResults.data || []);
      setContactMessages((resMessages.data as ContactMessage[]) || []);
      setUserRoles((resRoles.data as UserRole[]) || []);
    };
    fetchData();
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
    setGrantAdminConfirm(null);
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

  const senderTypeLabels: Record<string, string> = {
    student: "👨‍🎓 Student",
    parent: "👨‍👩‍👦 Parent",
    school: "🏫 School",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="space-y-1 min-w-0">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground flex items-center gap-2 flex-wrap">
              <span>🛡️ Admin Panel</span>
            </h1>
            <p className="text-muted-foreground font-body text-sm">
              Students ko manage karein, messages padhein, aur suggestions dein
            </p>
            {user?.email && (
              <p className="text-xs font-body text-muted-foreground pt-1">
                <span className="font-semibold text-foreground/80">Logged in:</span>{" "}
                <span className="break-all">{user.email}</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground/90 font-body pt-1">
              Sirf authorized admins yahan access kar sakte hain
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
            <Link
              to="/admin-setup"
              className="inline-flex items-center justify-center gap-2 gradient-hero text-primary-foreground font-display font-semibold px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity text-center"
            >
              Naya Admin Invite Code Banao
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border-2 border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">{totalStudents}</span>
          </div>
          <p className="text-muted-foreground text-sm font-body">Kul Students</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border-2 border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">{totalQuizzes}</span>
          </div>
          <p className="text-muted-foreground text-sm font-body">Kul Quiz Diye Gaye</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border-2 border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">{Object.keys(streamCounts).length}</span>
          </div>
          <p className="text-muted-foreground text-sm font-body">Active Streams</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border-2 border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">{unreadCount}</span>
          </div>
          <p className="text-muted-foreground text-sm font-body">Naye Messages</p>
        </motion.div>
      </div>

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
      </div>

      {activeTab === "students" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Naam, email, ya city se search karein..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border bg-background font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          {filteredStudents.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-8">Koi student nahi mila</p>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => {
                const studentResults = getStudentResults(student.id);
                const isExpanded = expandedStudent === student.id;
                const studentIsAdmin = isAdmin(student.id);
                return (
                  <div key={student.id} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        {studentIsAdmin && <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                        <div>
                          <p className="font-display font-semibold text-foreground">{student.full_name || "No Name"}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.email} • {student.city || "N/A"} • {student.class || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-display font-semibold text-primary">{studentResults.length} quiz</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-border p-4 bg-muted/20">
                        {grantAdminConfirm?.id === student.id && (
                          <div className="mb-4 p-4 rounded-xl border-2 border-border bg-card shadow-sm space-y-3">
                            <p className="text-sm font-body text-foreground leading-relaxed">
                              Kya aap <span className="font-display font-semibold">{grantAdminConfirm.name}</span> ko admin
                              banana chahte hain? Woh poora admin panel access kar sakenge.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => grantAdminRole(student.id)}
                                className="text-xs font-display font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setGrantAdminConfirm(null)}
                                className="text-xs font-display font-semibold px-4 py-2 rounded-lg border-2 border-border text-foreground hover:bg-muted transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Admin Role Toggle */}
                        <div className="mb-4 flex items-center gap-3 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              if (studentIsAdmin) {
                                removeAdminRole(student.id);
                              } else {
                                setGrantAdminConfirm({
                                  id: student.id,
                                  name: student.full_name?.trim() || "Is student",
                                });
                              }
                            }}
                            className={`flex items-center gap-2 text-xs font-display font-semibold px-4 py-2 rounded-lg transition-colors ${
                              studentIsAdmin
                                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                : "bg-primary/10 text-primary hover:bg-primary/20"
                            }`}
                          >
                            {studentIsAdmin ? (
                              <>
                                <ShieldOff className="w-3.5 h-3.5" /> Admin Role Hatayein
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5" /> Admin Banayein
                              </>
                            )}
                          </button>
                        </div>

                        {/* Results */}
                        {studentResults.length > 0 ? (
                          <div className="space-y-2 mb-4">
                            <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Quiz Results:</p>
                            {studentResults.map((r) => (
                              <div key={r.id} className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                                <div>
                                  <span className="font-display font-semibold text-foreground capitalize text-sm">{r.stream} Stream</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {new Date(r.created_at).toLocaleDateString("en-IN")}
                                  </span>
                                </div>
                                <button
                                  onClick={() => setSendingTo({ studentId: student.id, resultId: r.id })}
                                  className="text-xs text-primary font-display font-semibold flex items-center gap-1 hover:underline"
                                >
                                  <MessageSquare className="w-3 h-3" /> Suggestion Dein
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mb-4">Koi quiz result nahi hai</p>
                        )}

                        <button
                          onClick={() => setSendingTo({ studentId: student.id })}
                          className="text-xs gradient-hero text-primary-foreground font-display font-semibold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" /> General Suggestion Bhejein
                        </button>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "messages" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Contact Messages 📨
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
                  Unread only {messagesUnreadOnly ? "✓" : ""}
                </motion.button>
              </div>

              {filteredContactMessages.length === 0 ? (
                <p className="text-center text-muted-foreground font-body py-8">
                  Is filter ke liye koi message nahi mila
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredContactMessages.map((msg) => {
                    const issueKind = resolveIssueKind(msg);
                    const body = displayMessageBody(msg, issueKind);
                    return (
                      <div
                        key={msg.id}
                        className={`border rounded-xl p-4 transition-colors ${
                          msg.is_read ? "border-border bg-muted/20" : "border-primary/30 bg-primary/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-display font-bold text-foreground">{msg.name}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-display border border-border">
                                {senderTypeLabels[msg.sender_type] || msg.sender_type}
                              </span>
                              {issueKind && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-display font-semibold border ${issueBadgeClass[issueKind]}`}
                                >
                                  {issueBadgeLabel[issueKind]}
                                </span>
                              )}
                              {!msg.is_read && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-display font-semibold">
                                  Naya
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {msg.email && <span>{msg.email}</span>}
                              {msg.email && msg.phone && <span> • </span>}
                              {msg.phone && <span>{msg.phone}</span>}
                            </p>
                            <p className="text-foreground font-body text-sm whitespace-pre-wrap break-words">{body}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(msg.created_at).toLocaleString("en-IN")}
                            </p>
                          </div>
                          {!msg.is_read && (
                            <button
                              onClick={() => markMessageRead(msg.id)}
                              className="flex items-center gap-1 text-xs font-display font-semibold text-primary hover:underline shrink-0"
                            >
                              <Eye className="w-3 h-3" /> Padh Liya
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-4">
          {/* Today's activity */}
          <div className="rounded-2xl border-2 border-primary/25 bg-primary/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <CalendarDays className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm font-body text-foreground">
              <span className="font-display font-semibold">Aaj:</span>{" "}
              <span className="text-muted-foreground">
                {analyticsExtra.newStudentsToday} new students joined • {analyticsExtra.quizzesToday} quizzes given •{" "}
                {analyticsExtra.messagesToday} messages received
              </span>
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-4">📊 Stream-wise Breakdown</h3>
            {Object.keys(streamCounts).length === 0 ? (
              <p className="text-muted-foreground text-sm">Abhi tak koi data nahi hai</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(streamCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([stream, count]) => {
                    const pct = totalQuizzes > 0 ? (count / totalQuizzes) * 100 : 0;
                    return (
                      <div key={stream}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-display font-semibold text-foreground capitalize">{stream}</span>
                          <span className="text-muted-foreground">
                            {count} ({Math.round(pct)}%)
                          </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            className="h-full gradient-hero rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Class-wise */}
          <div className="bg-card border-2 border-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-4">📚 Class-wise Students</h3>
            {analyticsExtra.classTotal === 0 ? (
              <p className="text-muted-foreground text-sm">Abhi tak koi student data nahi hai</p>
            ) : (
              <div className="space-y-3">
                {CLASS_ORDER.map((cls) => {
                  const count = analyticsExtra.classCounts[cls] ?? 0;
                  const pct = analyticsExtra.classTotal > 0 ? (count / analyticsExtra.classTotal) * 100 : 0;
                  return (
                    <div key={cls}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-display font-semibold text-foreground">{cls}</span>
                        <span className="text-muted-foreground">
                          {count} students ({Math.round(pct)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          className="h-full gradient-hero rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
                {analyticsExtra.classUnset > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-display font-semibold text-foreground">Class not set</span>
                      <span className="text-muted-foreground">
                        {analyticsExtra.classUnset} students (
                        {Math.round((analyticsExtra.classUnset / analyticsExtra.classTotal) * 100)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${analyticsExtra.classTotal > 0 ? (analyticsExtra.classUnset / analyticsExtra.classTotal) * 100 : 0}%`,
                        }}
                        className="h-full gradient-hero rounded-full"
                      />
                    </div>
                  </div>
                )}
                {analyticsExtra.classOther > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-display font-semibold text-foreground">Other / unlisted</span>
                      <span className="text-muted-foreground">
                        {analyticsExtra.classOther} students (
                        {Math.round((analyticsExtra.classOther / analyticsExtra.classTotal) * 100)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${analyticsExtra.classTotal > 0 ? (analyticsExtra.classOther / analyticsExtra.classTotal) * 100 : 0}%`,
                        }}
                        className="h-full gradient-hero rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interest distribution */}
          <div className="bg-card border-2 border-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-2">🎯 Interest Distribution</h3>
            <p className="text-xs text-muted-foreground font-body mb-4">
              Har quiz ke liye: scores close ho to &quot;Undecided&quot;, warna stream → Tech / Business / Creative. Sports abhi quiz DB
              se track nahi hota.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(
                [
                  { key: "tech", label: "💻 Tech", v: analyticsExtra.interestCounts.tech },
                  { key: "business", label: "💼 Business", v: analyticsExtra.interestCounts.business },
                  { key: "creative", label: "🎨 Creative", v: analyticsExtra.interestCounts.creative },
                  { key: "sports", label: "🏏 Sports", v: analyticsExtra.interestCounts.sports },
                  { key: "undecided", label: "🤷 Undecided", v: analyticsExtra.interestCounts.undecided },
                ] as const
              ).map((row) => (
                <div
                  key={row.key}
                  className="rounded-xl border border-border bg-muted/30 px-3 py-3 text-center shadow-card"
                >
                  <p className="text-xs font-display font-semibold text-muted-foreground mb-1">{row.label}</p>
                  <p className="font-display font-bold text-xl text-foreground">{row.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 cities */}
          <div className="bg-card border-2 border-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-4">🏙️ Top 5 Cities</h3>
            {analyticsExtra.top5Cities.length === 0 ? (
              <p className="text-muted-foreground text-sm">City data abhi tak nahi hai</p>
            ) : (
              <div className="space-y-4">
                {analyticsExtra.top5Cities.map(([city, count]) => {
                  const barPct = analyticsExtra.topCityMax > 0 ? (count / analyticsExtra.topCityMax) * 100 : 0;
                  return (
                    <div key={city}>
                      <div className="flex justify-between text-sm mb-1 gap-2">
                        <span className="font-display font-semibold text-foreground truncate">{city}</span>
                        <span className="text-muted-foreground shrink-0">
                          {count} student{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barPct}%` }}
                          className="h-full gradient-hero rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggestion Modal */}
      {sendingTo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSendingTo(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-2 border-border rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" /> Suggestion Bhejein
            </h3>
            <textarea
              placeholder="Apna suggestion yahan likhein..."
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-border bg-background font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors text-sm min-h-[120px] resize-none"
              maxLength={1000}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSendingTo(null)}
                className="font-display font-semibold text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendSuggestion}
                disabled={!suggestionText.trim()}
                className="font-display font-semibold text-sm px-4 py-2 rounded-lg gradient-hero text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                Bhejein ✈️
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
