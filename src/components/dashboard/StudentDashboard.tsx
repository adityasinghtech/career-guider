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
  Award,
  TrendingUp,
  GraduationCap,
  Target,
  Flame,
  ListChecks,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

/** Flat array in localStorage: { id: "science:ncert", checked: boolean }[] */
const CHECKLIST_PREFIX = (s: StreamKey) => `${s}:` as const;

function readChecklistArray(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem("pathfinder_checklist");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is ChecklistItem =>
        x &&
        typeof x === "object" &&
        typeof (x as ChecklistItem).id === "string" &&
        typeof (x as ChecklistItem).checked === "boolean",
    );
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

function computeVisitStreak(): number {
  const today = formatLocalDate(new Date());
  const last = localStorage.getItem("pathfinder_last_visit");
  const prevRaw = localStorage.getItem("pathfinder_streak");
  const prevStreak = prevRaw ? parseInt(prevRaw, 10) : 0;
  const safePrev = Number.isFinite(prevStreak) ? prevStreak : 0;

  if (last === today) {
    return safePrev;
  }

  const yesterday = formatLocalDate(addDays(new Date(), -1));
  let next: number;
  if (last === yesterday) {
    next = safePrev + 1;
  } else {
    next = 1;
  }

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

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [resResults, resSugg, resProfile] = await Promise.all([
        supabase.from("quiz_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("admin_suggestions").select("*").eq("student_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", user.id).single(),
      ]);
      setResults(resResults.data || []);
      setSuggestions(resSugg.data || []);
      if (resProfile.data) {
        const p = resProfile.data as unknown as Profile;
        setProfile(p);
        setEditForm(p);
        setCareerGoalDraft(p.career_goal || "");
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pathfinder_quiz_profile");
      setProfileStreamFromStorage(raw ? (JSON.parse(raw).stream as string) : null);
    } catch {
      setProfileStreamFromStorage(null);
    }
  }, [user, results]);

  const latestStream = results.length > 0 ? results[0].stream : null;

  const effectiveStream = useMemo(
    () => normalizeStream(latestStream || profileStreamFromStorage),
    [latestStream, profileStreamFromStorage],
  );

  useEffect(() => {
    if (!user) return;
    setStreakCount(computeVisitStreak());
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
      setProfile((prev) =>
        prev ? { ...prev, career_goal: careerGoalDraft.trim() || null } : prev,
      );
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

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: TrendingUp },
    { id: "results" as const, label: "Quiz Results", icon: BookOpen, count: results.length },
    { id: "suggestions" as const, label: "Suggestions", icon: MessageSquare, count: unreadCount },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Namaste, {profile?.full_name || "Student"} ji 👋
          </h1>
          <p className="text-muted-foreground font-body text-sm">{user?.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/quiz"
            className="flex items-center gap-2 gradient-hero text-primary-foreground font-display font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            <BookOpen className="w-4 h-4" /> Quiz Dijiye
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2 border-2 border-border text-foreground font-display font-semibold px-5 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 font-display font-semibold px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border-2 border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-2xl text-foreground">{results.length}</span>
              </div>
              <p className="text-muted-foreground text-sm font-body">Quiz Diye</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border-2 border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="font-display font-bold text-2xl text-foreground">{unreadCount}</span>
              </div>
              <p className="text-muted-foreground text-sm font-body">Naye Suggestions</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border-2 border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-secondary-foreground" />
                </div>
                <span className="font-display font-bold text-sm text-foreground capitalize">{latestStream || "—"}</span>
              </div>
              <p className="text-muted-foreground text-sm font-body">Recommended Stream</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border-2 border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <span className="font-display font-bold text-sm text-foreground">{profile?.city || "N/A"}</span>
              </div>
              <p className="text-muted-foreground text-sm font-body">{profile?.class || "Class N/A"}</p>
            </motion.div>
          </div>

          {/* My Progress */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-primary" /> My Progress
            </h2>

            {/* 1. Career goal */}
            <div className="bg-card border-2 border-border rounded-2xl p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="font-display font-bold text-lg text-foreground">Career Goal</h3>
                </div>
                {!goalEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setCareerGoalDraft(profile?.career_goal || "");
                      setGoalEditing(true);
                    }}
                    className="flex items-center gap-1 text-sm text-primary font-display font-semibold hover:underline shrink-0"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-body mb-3">Apna career goal set karo</p>
              {goalEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={careerGoalDraft}
                    onChange={(e) => setCareerGoalDraft(e.target.value)}
                    placeholder="Jaise: AI Engineer, Doctor, CA..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-body text-sm focus:border-primary focus:outline-none"
                    maxLength={200}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGoalEditing(false);
                        setCareerGoalDraft(profile?.career_goal || "");
                      }}
                      className="px-4 py-2 rounded-xl border-2 border-border font-display font-semibold text-sm hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveCareerGoal}
                      disabled={savingGoal}
                      className="px-4 py-2 rounded-xl gradient-hero text-primary-foreground font-display font-semibold text-sm hover:opacity-90 disabled:opacity-50"
                    >
                      {savingGoal ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-foreground font-body text-sm min-h-[1.5rem]">
                  {profile?.career_goal?.trim() ? profile.career_goal : "— Abhi tak goal set nahi hai. Edit dabakar likho!"}
                </p>
              )}
            </div>

            {/* 2. Preparation checklist */}
            <div className="bg-card border-2 border-border rounded-2xl p-5 md:p-6">
              <h3 className="font-display font-bold text-lg text-foreground mb-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Preparation Checklist
              </h3>
              <p className="text-xs text-muted-foreground font-body mb-4 capitalize">
                Stream: {effectiveStream} (quiz ke hisaab se)
              </p>
              <ul className="space-y-2">
                {checklistItems.map((item) => {
                  const label =
                    CHECKLIST_TEMPLATES[effectiveStream].find((t) => t.id === item.id)?.label || item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border-2 transition-colors font-body text-sm ${
                          item.checked
                            ? "border-primary/40 bg-primary/5 text-foreground"
                            : "border-border bg-muted/30 hover:border-primary/30"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                            item.checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                          }`}
                          aria-hidden
                        >
                          {item.checked && <CheckCircle className="w-3.5 h-3.5" />}
                        </span>
                        <span className={item.checked ? "line-through opacity-80" : ""}>{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 3. Streak */}
            <div className="rounded-2xl border-2 border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/20 dark:border-amber-800/50 px-5 py-4 flex items-center gap-3">
              <Flame className="w-10 h-10 text-orange-500 shrink-0" />
              <div>
                <p className="font-display font-bold text-foreground text-lg">
                  🔥 {streakCount} day streak! Keep it up!
                </p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  Roz dashboard kholna — streak banaye rakho
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Results */}
            <div className="bg-card border-2 border-border rounded-2xl p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Haal Hi Ke Results
              </h2>
              {results.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground font-body mb-3">Abhi tak koi quiz nahi diya</p>
                  <Link to="/quiz" className="text-primary font-display font-semibold hover:underline">
                    Pehla quiz dijiye →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.slice(0, 3).map((r) => (
                    <Link
                      key={r.id}
                      to={`/results/${r.stream}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 transition-colors group"
                    >
                      <div>
                        <p className="font-display font-semibold text-foreground capitalize text-sm">{r.stream} Stream</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                  {results.length > 3 && (
                    <button onClick={() => setActiveTab("results")} className="text-sm text-primary font-display font-semibold hover:underline">
                      Saare results dekhein ({results.length}) →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Recent Suggestions */}
            <div className="bg-card border-2 border-border rounded-2xl p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" /> Expert Suggestions
              </h2>
              {suggestions.length === 0 ? (
                <p className="text-center text-muted-foreground font-body py-6">Koi suggestion abhi tak nahi aaya</p>
              ) : (
                <div className="space-y-3">
                  {suggestions.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      className={`p-3 rounded-xl border transition-colors ${
                        s.is_read ? "border-border bg-card" : "border-primary/30 bg-primary/5"
                      }`}
                    >
                      <p className="font-body text-foreground text-sm line-clamp-2">{s.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                        {!s.is_read && (
                          <button onClick={() => markRead(s.id)} className="text-xs text-primary font-display font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Padh Liya
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {suggestions.length > 3 && (
                    <button onClick={() => setActiveTab("suggestions")} className="text-sm text-primary font-display font-semibold hover:underline">
                      Saare suggestions dekhein ({suggestions.length}) →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recommended Action */}
          {latestStream && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-hero rounded-2xl p-6 text-primary-foreground">
              <h3 className="font-display font-bold text-lg mb-2">🎯 Aapke Liye Suggestion</h3>
              <p className="text-sm opacity-90 mb-4">
                Aapka recommended stream <strong className="capitalize">{latestStream}</strong> hai. Apna detailed roadmap, colleges aur scholarships dekhein!
              </p>
              <Link
                to={`/results/${latestStream}`}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 font-display font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Detailed Report Dekhein <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </>
      )}

      {/* Results Tab */}
      {activeTab === "results" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Aapki Poori Quiz History
          </h2>
          {results.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-muted-foreground font-body mb-3">Abhi tak koi quiz nahi diya</p>
              <Link to="/quiz" className="gradient-hero text-primary-foreground font-display font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 inline-block">
                Pehla Quiz Dijiye →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((r, i) => (
                <Link
                  key={r.id}
                  to={`/results/${r.stream}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground capitalize">{r.stream} Stream</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions Tab */}
      {activeTab === "suggestions" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" /> Expert Suggestions
          </h2>
          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-muted-foreground font-body">Koi suggestion abhi tak nahi aaya</p>
              <p className="text-xs text-muted-foreground mt-1">Jab experts aapko koi salah denge, woh yahan dikhegi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    s.is_read ? "border-border bg-card" : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <p className="font-body text-foreground text-sm">{s.message}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {!s.is_read && (
                      <button onClick={() => markRead(s.id)} className="text-xs text-primary font-display font-semibold flex items-center gap-1 hover:underline">
                        <CheckCircle className="w-3 h-3" /> Padh Liya
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Aapki Profile
            </h2>
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 text-sm text-primary font-display font-semibold hover:underline">
                <Edit3 className="w-4 h-4" /> Edit Karein
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setEditMode(false); setEditForm(profile || {}); }} className="flex items-center gap-1 text-sm text-muted-foreground font-display font-semibold hover:text-foreground">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={saveProfile} disabled={saving} className="flex items-center gap-1 text-sm text-primary font-display font-semibold hover:underline disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Karein"}
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Naam", key: "full_name" as keyof Profile, placeholder: "Aapka naam" },
              { label: "Phone", key: "phone" as keyof Profile, placeholder: "Phone number" },
              { label: "City / District", key: "city" as keyof Profile, placeholder: "Aapka city" },
              { label: "Class", key: "class" as keyof Profile, placeholder: "Aapki class" },
              { label: "School ka Naam", key: "school_name" as keyof Profile, placeholder: "School ka naam" },
              { label: "Parent ka Naam", key: "parent_name" as keyof Profile, placeholder: "Parent ka naam" },
              { label: "Parent ka Phone", key: "parent_phone" as keyof Profile, placeholder: "Parent ka phone" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs font-display font-semibold text-muted-foreground block mb-1">{field.label}</label>
                {editMode ? (
                  <input
                    value={(editForm[field.key] as string) || ""}
                    onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-xl border-2 border-border bg-background text-foreground text-sm font-body focus:border-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-foreground font-body text-sm py-2">{(profile?.[field.key] as string) || "—"}</p>
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="text-xs font-display font-semibold text-muted-foreground block mb-1">Bio</label>
              {editMode ? (
                <textarea
                  value={(editForm.bio as string) || ""}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Apne baare mein kuch likhein..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border-2 border-border bg-background text-foreground text-sm font-body focus:border-primary focus:outline-none resize-none"
                />
              ) : (
                <p className="text-foreground font-body text-sm py-2">{profile?.bio || "—"}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
