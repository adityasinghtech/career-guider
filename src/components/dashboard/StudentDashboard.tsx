import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Clock, ArrowRight, User, CheckCircle, Edit3, Save, X, Award, TrendingUp, GraduationCap } from "lucide-react";
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
}

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
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
        setProfile(resProfile.data as unknown as Profile);
        setEditForm(resProfile.data as unknown as Profile);
      }
    };
    fetchData();
  }, [user]);

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

  const unreadCount = suggestions.filter((s) => !s.is_read).length;

  // Get best stream from results
  const latestStream = results.length > 0 ? results[0].stream : null;

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
