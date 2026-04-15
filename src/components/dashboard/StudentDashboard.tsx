import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  MessageSquare,
  Clock,
  ArrowRight,
  User,
  CheckCircle,
  Edit3,
  Save,
  X,
  TrendingUp,
  Target,
  Flame,
  ListChecks,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ExamCountdown from "@/components/dashboard/ExamCountdown";
import CareerReadinessScore from "@/components/dashboard/CareerReadinessScore";
import { DashboardSkeleton } from "../ui/SkeletonLoader";

interface CareerAnalysis {
  id: string;
  analysis: any;
  created_at: string;
}

interface QuizResult {
  id: string;
  stream: string;
  scores: any;
  created_at: string;
}

interface Suggestion {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Profile {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  class: string;
  school_name: string;
  bio: string;
  parent_name: string;
  parent_phone: string;
  avatar_url: string;
  career_goal?: string | null;
  created_at?: string;
  updated_at?: string;
}

type StreamKey = "science" | "commerce" | "arts";

interface ChecklistItem {
  id: string;
  checked: boolean;
}

const CHECKLIST_TEMPLATES: Record<StreamKey, { id: string; label: string }[]> = {
  science: [
    { id: "ncert", label: "NCERT books complete karo" },
    { id: "mock", label: "JEE/NEET mock test dena shuru karo" },
    { id: "physics", label: "Physics formulas revise karo" },
    { id: "pyq", label: "Previous year papers solve karo" },
  ],
  commerce: [
    { id: "accounts", label: "Accounts basics clear karo" },
    { id: "ca-syllabus", label: "CA Foundation syllabus dekhein" },
    { id: "stock", label: "Stock market basics seekhein" },
    { id: "tally", label: "Tally software seekhein" },
  ],
  arts: [
    { id: "newspaper", label: "Daily newspaper padhna shuru karo" },
    { id: "syllabus", label: "CLAT/UPSC syllabus dekhein" },
    { id: "essay", label: "Essay writing practice karo" },
    { id: "gk", label: "GK strong karo" },
  ],
};

function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function normalizeStream(s: string | null | undefined): StreamKey {
  if (!s) return "science";
  const x = s.toLowerCase();
  if (x === "commerce") return "commerce";
  if (x === "arts") return "arts";
  return "science";
}

const CHECKLIST_PREFIX = (s: StreamKey) => `${s}:` as const;

function readChecklistArray(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem("pathfinder_checklist");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function mergeChecklist(stream: StreamKey): ChecklistItem[] {
  const template = CHECKLIST_TEMPLATES[stream];
  const prefix = CHECKLIST_PREFIX(stream);
  const all = readChecklistArray();
  const byLocalId = Object.fromEntries(
    all
      .filter((i) => i.id.startsWith(prefix))
      .map((i) => [i.id.slice(prefix.length), i.checked]),
  );
  return template.map((t) => ({
    id: t.id,
    checked: byLocalId[t.id] ?? false,
  }));
}

function writeChecklistStream(stream: StreamKey, items: ChecklistItem[]) {
  const prefix = CHECKLIST_PREFIX(stream);
  const all = readChecklistArray().filter((i) => !i.id.startsWith(prefix));
  const next: ChecklistItem[] = items.map((i) => ({
    id: `${prefix}${i.id}`,
    checked: i.checked,
  }));
  localStorage.setItem("pathfinder_checklist", JSON.stringify([...all, ...next]));
}

interface AdminReply {
  id: string;
  name: string;
  message: string;
  admin_reply: string;
  replied_at: string | null;
  created_at: string;
}

const AdminRepliesSection = ({ userEmail }: { userEmail: string | undefined }) => {
  const [replies, setReplies] = useState<AdminReply[]>([]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchReplies = async () => {
      const { data } = await supabase
        .from("contact_messages")
        .select("id, name, message, admin_reply, replied_at, created_at")
        .eq("email", userEmail)
        .not("admin_reply", "is", null)
        .order("replied_at", { ascending: false });
      if (data) {
        setReplies((data as unknown as AdminReply[]) || []);
      }
    };

    fetchReplies();

    const channel = supabase
      .channel("public:contact_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_messages",
          filter: `email=eq.${userEmail}`,
        },
        () => {
          fetchReplies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userEmail]);

  if (replies.length === 0) return null;

  return (
    <div className="bg-card border-2 border-green-500/30 rounded-2xl p-5 mt-4">
      <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        💬 Admin ke Replies
      </h3>
      <div className="space-y-3">
        {replies.map((reply) => (
          <div
            key={reply.id}
            className="bg-green-500/5 border border-green-500/20 rounded-xl p-4"
          >
            <p className="text-xs text-muted-foreground mb-1 font-body">
              Aapka message: "{reply.message?.slice(0, 60)}{reply.message?.length > 60 ? "..." : ""}"
            </p>
            <p className="text-sm font-body text-foreground font-medium">
              🧑‍💼 Admin: {reply.admin_reply}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {reply.replied_at
                ? new Date(reply.replied_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HelpSupportSection = ({ user, profile }: { user: any; profile: Profile | null }) => {
  const [message, setMessage] = useState("");
  const [issueType, setIssueType] = useState("Quiz Issue");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  const fetchRecentMessages = async () => {
    if (!user?.email) return;
    const { data } = await supabase
      .from("contact_messages")
      .select("id, message, admin_reply, status, created_at")
      .eq("email", user.email)
      .eq("sender_type", "student")
      .order("created_at", { ascending: false })
      .limit(3);
    if (data) setRecentMessages(data);
  };

  useEffect(() => {
    fetchRecentMessages();

    if (!user?.email) return;
    const channel = supabase
      .channel("public:contact_messages:help")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_messages",
          filter: `email=eq.${user.email}`,
        },
        () => fetchRecentMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !profile) return;

    setIsSubmitting(true);
    const prefix = `[${issueType.toUpperCase()}] `;

    const { error } = await supabase.from("contact_messages").insert({
      name: profile.full_name || "Student",
      email: user.email,
      phone: profile.phone || "",
      message: prefix + message,
      sender_type: "student",
      issue_type: issueType,
      is_read: false,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Message bhejne mein problem aayi.");
    } else {
      toast.success("Message bhej diya! Admin jald reply karenge 🙏");
      setMessage("");
    }
  };

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-5 md:p-6 mt-6 shadow-card">
      <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        🛠️ Help & Support
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="text-xs font-display font-semibold text-muted-foreground block mb-1">Issue Type</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border-2 border-border bg-background text-foreground text-sm font-body focus:border-primary focus:outline-none"
          >
            <option value="Quiz Issue">Quiz Issue</option>
            <option value="Login Issue">Login Issue</option>
            <option value="Career Guidance">Career Guidance</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-display font-semibold text-muted-foreground block mb-1">Aapki Problem</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Apni problem likhein..."
            className="w-full px-3 py-2 rounded-xl border-2 border-border bg-background text-foreground text-sm font-body focus:border-primary focus:outline-none resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className="gradient-hero text-primary-foreground font-display font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? "Bhej rahe hain..." : "Message Bhejo 📨"}
        </button>
      </form>

      {recentMessages.length > 0 && (
        <div>
          <h4 className="text-sm font-display font-semibold text-foreground mb-3">Aapke Pichle Messages:</h4>
          <div className="space-y-2">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-border bg-muted/20">
                <p className="text-sm font-body text-foreground line-clamp-2 flex-1">
                  {msg.message}
                </p>
                <div className="shrink-0 flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${msg.admin_reply ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                    }`}>
                    {msg.admin_reply ? "Replied" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function computeVisitStreak(): number {
  const today = formatLocalDate(new Date());
  const last = localStorage.getItem("pathfinder_last_visit");
  const prevRaw = localStorage.getItem("pathfinder_streak");
  const prevStreak = prevRaw ? parseInt(prevRaw, 10) : 0;
  const safePrev = Number.isFinite(prevStreak) ? prevStreak : 0;

  if (last === today) return safePrev;

  const yesterday = formatLocalDate(addDays(new Date(), -1));
  let next = (last === yesterday) ? (safePrev + 1) : 1;

  localStorage.setItem("pathfinder_last_visit", today);
  localStorage.setItem("pathfinder_streak", String(next));
  return next;
}

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [goalEditing, setGoalEditing] = useState(false);
  const [careerGoalDraft, setCareerGoalDraft] = useState("");
  const [streakCount, setStreakCount] = useState(0);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [profileStreamFromStorage, setProfileStreamFromStorage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "results" | "suggestions" | "profile">("overview");
  const [careerAnalyses, setCareerAnalyses] = useState<CareerAnalysis[]>([]);
  const [timelineExpanded, setTimelineExpanded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [resResults, resSugg, resProfile, resAnalyses] = await Promise.all([
        supabase.from("quiz_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("admin_suggestions").select("*").eq("student_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("career_analyses" as any).select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setResults(resResults.data || []);
      setSuggestions(resSugg.data || []);
      setCareerAnalyses((resAnalyses.data as any) || []);
      if (resProfile.data) {
        setProfile(resProfile.data as any);
        setEditForm(resProfile.data as any);
        setCareerGoalDraft(resProfile.data.career_goal || "");
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pathfinder_quiz_profile");
      setProfileStreamFromStorage(raw ? JSON.parse(raw).stream : null);
    } catch { setProfileStreamFromStorage(null); }
  }, [user, results]);

  const latestStream = results.length > 0 ? results[0].stream : null;
  const effectiveStream = useMemo(() => normalizeStream(latestStream || profileStreamFromStorage), [latestStream, profileStreamFromStorage]);
  const checklistPercent = useMemo(() => {
    const n = checklistItems.length;
    return n === 0 ? 0 : checklistItems.filter((i) => i.checked).length / n;
  }, [checklistItems]);

  useEffect(() => {
    if (user) setStreakCount(computeVisitStreak());
  }, [user]);

  useEffect(() => {
    setChecklistItems(mergeChecklist(effectiveStream));
  }, [effectiveStream]);

  const markRead = async (id: string) => {
    await supabase.from("admin_suggestions").update({ is_read: true }).eq("id", id);
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, is_read: true } : s)));
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: editForm.full_name || "",
      phone: editForm.phone || "",
      city: editForm.city || "",
      class: editForm.class || "",
      school_name: editForm.school_name || "",
      bio: editForm.bio || "",
      parent_name: editForm.parent_name || "",
      parent_phone: editForm.parent_phone || "",
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    if (error) {
      toast.error("Profile update nahi ho paaya");
    } else {
      toast.success("Profile update ho gaya! ✅");
      setProfile({ ...profile, ...editForm } as Profile);
      setEditMode(false);
    }
    setSaving(false);
  };

  const saveCareerGoal = async () => {
    if (!user) return;
    setSavingGoal(true);
    const { error } = await supabase.from("profiles").update({
      career_goal: careerGoalDraft.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    if (error) {
      toast.error("Career goal save nahi ho paaya");
    } else {
      toast.success("Career goal save ho gaya! ✅");
      setProfile((prev) => prev ? { ...prev, career_goal: careerGoalDraft.trim() || null } : prev);
      setGoalEditing(false);
    }
    setSavingGoal(false);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
      writeChecklistStream(effectiveStream, next);
      return next;
    });
  };

  const unreadCount = suggestions.filter((s) => !s.is_read).length;
  const stageQuizDone = results.length > 0;
  const stageGoalSet = Boolean(profile?.career_goal?.trim());
  const stageChecklistStarted = checklistItems.some((i) => i.checked);
  const stageExpert = suggestions.length > 0;
  const journeyPercent = Math.round(([stageQuizDone, stageGoalSet, stageChecklistStarted, stageExpert].filter(Boolean).length / 4) * 100);

  const nextAction = useMemo(() => {
    if (!stageQuizDone) return { title: "Quiz dijiye — apna stream discover karo 🎯", ctaLabel: "Quiz shuru karein", ctaHref: "/quiz", scrollToId: null, switchTab: null };
    if (!stageGoalSet) return { title: "Career goal set karo — dashboard tab mein 🎯", ctaLabel: "Goal set karein", ctaHref: null, scrollToId: "student-dashboard-career-goal", switchTab: null };
    if (!stageChecklistStarted) return { title: "Preparation checklist start karo ✅", ctaLabel: "Checklist kholo", ctaHref: null, scrollToId: "student-dashboard-checklist", switchTab: null };
    if (!stageExpert) return { title: "Kal bhi aao — streak banaye rakho 🔥", ctaLabel: "Checklist continue karein", ctaHref: null, scrollToId: "student-dashboard-checklist", switchTab: null };
    return { title: "Bahut badhiya! Expert suggestion ka wait karo 💬", ctaLabel: "Suggestions dekhein", ctaHref: null, scrollToId: null, switchTab: "suggestions" };
  }, [stageQuizDone, stageGoalSet, stageChecklistStarted, stageExpert]);

  const storyItems = useMemo(() => {
    const items: any[] = [];
    if (profile?.created_at) items.push({ id: "join", at: profile.created_at, title: "PathFinder join kiya", detail: "Account bana — yahi se aapki journey shuru!" });
    results.forEach((r, idx) => items.push({ id: `quiz-${r.id}`, at: r.created_at, title: `Quiz diya (${idx + 1})`, detail: `${r.stream} stream suggest hua` }));
    if (profile?.career_goal?.trim() && profile.updated_at) items.push({ id: "goal", at: profile.updated_at, title: "Career goal set kiya", detail: profile.career_goal.trim() });
    suggestions.forEach((s, idx) => items.push({ id: `sugg-${s.id}`, at: s.created_at, title: `Expert suggestion (${idx + 1})`, detail: s.message.slice(0, 100) }));
    return items.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  }, [profile, results, suggestions]);

  if (!profile && results.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 pt-24">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Namaste, {profile?.full_name || "Student"} ji 👋
          </h1>
          <p className="text-muted-foreground font-body text-sm">{user?.email}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/quiz" className="flex items-center gap-2 gradient-hero text-primary-foreground font-display font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 text-sm">
            <BookOpen className="w-4 h-4" /> Quiz Dijiye
          </Link>
          <button onClick={signOut} className="border-2 border-border text-foreground font-display font-semibold px-5 py-2.5 rounded-xl hover:bg-muted text-sm transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: "overview", label: "Overview", icon: TrendingUp },
          { id: "results", label: "Quiz Results", icon: BookOpen, count: results.length },
          { id: "suggestions", label: "Suggestions", icon: MessageSquare, count: unreadCount },
          { id: "profile", label: "Profile", icon: User },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 font-display font-semibold px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-white/20">{tab.count}</span>}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <CareerReadinessScore quizCount={results.length} hasGoal={Boolean(profile?.career_goal)} checklistPercent={checklistPercent} streakDays={streakCount} />
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border-2 border-border rounded-2xl p-5 md:p-6 shadow-card">
            <div className="flex justify-between items-end mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">Aapka Journey 🗺️</h2>
              <p className="text-sm font-display font-semibold text-primary">{journeyPercent}% complete</p>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden mb-5">
              <motion.div className="h-full gradient-hero rounded-full" initial={{ width: 0 }} animate={{ width: `${journeyPercent}%` }} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Quiz Diya", done: stageQuizDone },
                { label: "Goal Set Kiya", done: stageGoalSet },
                { label: "Checklist Shuru", done: stageChecklistStarted },
                { label: "Expert Se Baat", done: stageExpert },
              ].map((st) => (
                <div key={st.label} className={`rounded-xl border-2 p-3 text-center ${st.done ? "border-primary/50 bg-primary/5" : "border-border bg-muted/20"}`}>
                  <p className="font-display font-bold text-sm text-foreground mb-1">
                    {st.done ? "✅" : "⭕"} {st.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-5 md:p-6 gradient-hero text-primary-foreground shadow-card">
            <p className="text-xs font-display font-semibold uppercase opacity-90 mb-2">Next Action</p>
            <h3 className="font-display font-bold text-lg mb-4">{nextAction.title}</h3>
            {nextAction.ctaHref ? (
              <Link to={nextAction.ctaHref} className="inline-flex items-center gap-2 bg-primary-foreground/15 hover:bg-primary-foreground/25 font-display font-bold px-5 py-3 rounded-xl text-sm transition-colors border border-primary-foreground/30">
                {nextAction.ctaLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button onClick={() => { if (nextAction.switchTab) setActiveTab(nextAction.switchTab as any); if (nextAction.scrollToId) document.getElementById(nextAction.scrollToId)?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 bg-primary-foreground/15 hover:bg-primary-foreground/25 font-display font-bold px-5 py-3 rounded-xl text-sm transition-colors border border-primary-foreground/30">
                {nextAction.ctaLabel} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </motion.section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border-2 border-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-border">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <span className="font-display font-bold text-2xl">{results.length}</span>
              </div>
              <p className="text-foreground text-sm font-semibold">Quiz History</p>
            </div>
            <div className="bg-card border-2 border-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center border border-border">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <span className="font-display font-bold text-2xl">🔥 {streakCount}</span>
              </div>
              <p className="text-foreground text-sm font-semibold">Day Streak</p>
            </div>
          </div>

          <ExamCountdown stream={effectiveStream} />

          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border-2 border-border rounded-2xl p-5 md:p-6 shadow-card">
            <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Aapki Story
            </h2>
            <ul className="relative space-y-0 pl-2 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {storyItems.slice(-5).map((item) => (
                <li key={item.id} className="relative pl-6 pb-6 last:pb-0">
                  <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary bg-card" />
                  <p className="font-display font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.at).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                </li>
              ))}
            </ul>
          </motion.section>

          <div id="student-dashboard-career-goal" className="bg-card border-2 border-border rounded-2xl p-5 md:p-6 shadow-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display font-bold text-lg">Career Goal</h3>
              <button onClick={() => setGoalEditing(!goalEditing)} className="text-sm text-primary font-display font-semibold hover:underline">Edit</button>
            </div>
            {goalEditing ? (
              <div className="space-y-3">
                <input value={careerGoalDraft} onChange={e => setCareerGoalDraft(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background" />
                <button onClick={saveCareerGoal} className="px-4 py-2 rounded-xl gradient-hero text-white text-sm">Save Goal</button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{profile?.career_goal || "— Goal set nahi hai."}</p>
            )}
          </div>

          <div id="student-dashboard-checklist" className="bg-card border-2 border-border rounded-2xl p-5 md:p-6 shadow-card">
            <h3 className="font-display font-bold text-lg mb-4">Preparation Checklist</h3>
            <ul className="space-y-2">
              {checklistItems.map(item => (
                <li key={item.id}>
                  <button onClick={() => toggleChecklistItem(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${item.checked ? "bg-primary/5 border-primary/40" : "bg-muted/30 border-border"}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.checked ? "bg-primary border-primary text-white" : "border-muted"}`}>
                      {item.checked && <CheckCircle className="w-3" />}
                    </div>
                    <span className={`text-sm ${item.checked ? "line-through opacity-70" : ""}`}>{CHECKLIST_TEMPLATES[effectiveStream].find(t => t.id === item.id)?.label || item.id}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "results" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-foreground mb-4">Aapki Quiz History</h2>
          {results.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-muted-foreground">Abhi tak koi quiz nahi diya</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((r, i) => (
                <Link key={r.id} to={`/results/${r.stream}`} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-white font-bold">{i + 1}</div>
                    <div>
                      <p className="font-display font-semibold capitalize">{r.stream} Stream</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "suggestions" && (
        <div className="space-y-6">
          <div className="bg-card border-2 border-border rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg mb-4">Expert Suggestions</h2>
            {suggestions.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No suggestions yet.</p>
            ) : (
              <div className="space-y-3">
                {suggestions.map(s => (
                  <div key={s.id} className={`p-4 rounded-xl border ${s.is_read ? "border-border" : "border-primary/30 bg-primary/5"}`}>
                    <p className="text-sm">{s.message}</p>
                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                      <span>{new Date(s.created_at).toLocaleDateString()}</span>
                      {!s.is_read && <button onClick={() => markRead(s.id)} className="text-primary font-bold">Mark as Read</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <AdminRepliesSection userEmail={user?.email} />
          <HelpSupportSection user={user} profile={profile} />
        </div>
      )}

      {activeTab === "profile" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-bold text-lg">Aapki Profile</h2>
            <button onClick={() => setEditMode(!editMode)} className="text-sm text-primary font-bold">{editMode ? "Cancel" : "Edit Profile"}</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Naam", key: "full_name" },
              { label: "Phone", key: "phone" },
              { label: "City", key: "city" },
              { label: "Class", key: "class" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold text-muted-foreground block mb-1">{f.label}</label>
                {editMode ? (
                  <input value={(editForm as any)[f.key] || ""} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })} className="w-full px-3 py-2 rounded-xl border-2 border-border bg-background text-sm" />
                ) : (
                  <p className="text-sm py-2">{(profile as any)?.[f.key] || "—"}</p>
                )}
              </div>
            ))}
          </div>
          {editMode && <button onClick={saveProfile} className="mt-6 w-full py-3 gradient-hero text-white rounded-xl font-bold">Save Changes</button>}
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
