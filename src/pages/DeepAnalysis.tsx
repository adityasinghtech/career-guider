import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, TrendingUp, Brain, MapPin, DollarSign, Target, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  psychological_aptitude: { strengths: string[]; learning_style: string; career_personality: string };
  financial_feasibility: { estimated_4year_cost: string; scholarship_potential: string; roi_timeline: string };
  top_careers: Array<{ title: string; salary: string; demand: string; path: string }>;
  target_colleges: Array<{ name: string; location: string; fees: string; exam: string }>;
  structured_roadmap: { now: string[]; year1: string[]; year2: string[]; longterm: string[] };
  backup_paths: Array<{ title: string; description: string }>;
  competition_level: string;
  success_tips: string[];
}

type TabKey = "aptitude" | "finance" | "careers" | "colleges" | "roadmap" | "tips";
type Personality = "analytical" | "creative" | "practical" | "balanced";
type Budget = "low" | "medium" | "high";
type LocationType = "metro" | "tier2" | "tier3" | "rural";

const INTERESTS_LIST = [
  "Engineering & Technology", "Medical & Healthcare", "Commerce & Finance",
  "Law & Governance", "Arts & Humanities", "Business & Entrepreneurship",
  "Research & Science", "Creative Arts", "Agriculture",
  "Social Sciences", "Sports & Fitness", "Teaching & Education",
];

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "aptitude", label: "Aptitude", icon: <Brain className="w-4 h-4" /> },
  { key: "finance", label: "Finance", icon: <DollarSign className="w-4 h-4" /> },
  { key: "careers", label: "Careers", icon: <TrendingUp className="w-4 h-4" /> },
  { key: "colleges", label: "Colleges", icon: <MapPin className="w-4 h-4" /> },
  { key: "roadmap", label: "Roadmap", icon: <Target className="w-4 h-4" /> },
  { key: "tips", label: "Tips", icon: <Shield className="w-4 h-4" /> },
];

const demandColor = (d: string) =>
  d?.toLowerCase().includes("high") ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
  : d?.toLowerCase().includes("low") ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";

export default function DeepAnalysis() {
  const [profile, setProfile] = useState({
    marks10th: "", marks12th: "", stream: "",
    interests: [] as string[], personality: "balanced" as Personality,
    budget: "medium" as Budget, location: "tier2" as LocationType,
  });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("aptitude");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("pathfinder_quiz_profile") || "{}");
      setProfile((prev) => ({
        ...prev,
        stream: p.stream || "",
        marks10th: p.marksPercent ? String(p.marksPercent) : "",
        budget: (p.budget as Budget) || "medium",
        location: (p.locationType as LocationType) || "tier2",
      }));
    } catch {/* ignore */}
  }, []);

  const toggleInterest = (i: string) =>
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(i) ? prev.interests.filter((x) => x !== i) : [...prev.interests, i],
    }));

  async function runAnalysis() {
    setLoading(true); setError("");
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke("deep-analysis-generate", {
        body: {
          marks10th: profile.marks10th,
          marks12th: profile.marks12th,
          stream: profile.stream,
          interests: profile.interests,
          personality: profile.personality,
          budget: profile.budget,
          location: profile.location
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (fnData?.error) throw new Error(fnData.error);
      if (!fnData?.analysis) throw new Error("Analysis failed");

      setAnalysis(fnData.analysis);
      setActiveTab("aptitude");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Analysis nahi ho saka. Thodi der baad try karo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-6xl mb-3">🔬</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">Deep Career Analysis</h1>
          <p className="text-muted-foreground font-body">AI aapka poora career plan banayega — free mein! 🚀</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Marks */}
              <Card>
                <CardHeader><CardTitle className="font-display">📊 Marks (optional)</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-display font-semibold text-muted-foreground mb-1 block">10th Percentage</label>
                      <input
                        type="number" min="0" max="100" placeholder="jaise: 78"
                        value={profile.marks10th}
                        onChange={(e) => setProfile((p) => ({ ...p, marks10th: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-display font-semibold text-muted-foreground mb-1 block">12th Percentage</label>
                      <input
                        type="number" min="0" max="100" placeholder="jaise: 82"
                        value={profile.marks12th}
                        onChange={(e) => setProfile((p) => ({ ...p, marks12th: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stream */}
              <Card>
                <CardHeader><CardTitle className="font-display">🎓 Stream</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {["Science", "Commerce", "Arts"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setProfile((p) => ({ ...p, stream: s.toLowerCase() }))}
                        className={`flex-1 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${
                          profile.stream === s.toLowerCase() ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {s === "Science" ? "🔬" : s === "Commerce" ? "📈" : "🎨"} {s}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader><CardTitle className="font-display">❤️ Interests (multiple select)</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS_LIST.map((i) => (
                      <button
                        key={i}
                        onClick={() => toggleInterest(i)}
                        className={`px-3 py-2 rounded-xl border-2 font-display font-semibold text-sm transition-all ${
                          profile.interests.includes(i) ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Personality + Budget + Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader><CardTitle className="font-display text-sm">🧠 Personality</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["analytical", "creative", "practical", "balanced"] as Personality[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => setProfile((prev) => ({ ...prev, personality: p }))}
                          className={`py-1.5 rounded-lg font-display font-semibold text-xs transition-all capitalize ${
                            profile.personality === p ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {p === "analytical" ? "🔍" : p === "creative" ? "🎨" : p === "practical" ? "🔧" : "⚖️"} {p}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="font-display text-sm">💰 Budget</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1.5">
                      {(["low", "medium", "high"] as Budget[]).map((b) => (
                        <button
                          key={b}
                          onClick={() => setProfile((prev) => ({ ...prev, budget: b }))}
                          className={`py-1.5 rounded-lg font-display font-semibold text-xs transition-all capitalize ${
                            profile.budget === b ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {b === "low" ? "🏛️ Sarkari prefer" : b === "medium" ? "📚 Thoda invest" : "💎 Premium"} 
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="font-display text-sm">📍 Location</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["metro", "tier2", "tier3", "rural"] as LocationType[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => setProfile((prev) => ({ ...prev, location: l }))}
                          className={`py-1.5 rounded-lg font-display font-semibold text-xs transition-all ${
                            profile.location === l ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {l === "metro" ? "🏙️ Metro" : l === "tier2" ? "🌆 Tier 2" : l === "tier3" ? "🏘️ Tier 3" : "🌾 Rural"}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {error && <p className="text-destructive text-sm font-body text-center">{error}</p>}

              <Button
                onClick={runAnalysis}
                disabled={loading}
                className="w-full gradient-hero text-primary-foreground font-display font-bold text-lg py-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> AI analysis kar raha hai... thoda wait karo ⏳</span>
                ) : "Deep Analysis Karo 🚀"}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-display font-semibold text-sm whitespace-nowrap transition-all shrink-0 ${
                      activeTab === tab.key ? "gradient-hero text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                    }`}
                  >
                    {tab.icon}{tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {/* Aptitude Tab */}
                  {activeTab === "aptitude" && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="font-display">💪 Strengths</CardTitle></CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.psychological_aptitude.strengths.map((s, i) => (
                              <Badge key={i} className="bg-primary/10 text-primary font-body">{s}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="font-display">📖 Learning Style</CardTitle></CardHeader>
                        <CardContent><p className="font-body text-foreground">{analysis.psychological_aptitude.learning_style}</p></CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="font-display">🏢 Career Personality</CardTitle></CardHeader>
                        <CardContent><p className="font-body text-foreground">{analysis.psychological_aptitude.career_personality}</p></CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Finance Tab */}
                  {activeTab === "finance" && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="font-display">💸 Estimated 4-Year Cost</CardTitle></CardHeader>
                        <CardContent><p className="font-display font-bold text-2xl text-primary">{analysis.financial_feasibility.estimated_4year_cost}</p></CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="font-display">🎓 Scholarship Potential</CardTitle></CardHeader>
                        <CardContent><p className="font-body text-foreground">{analysis.financial_feasibility.scholarship_potential}</p></CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="font-display">⏱️ ROI Timeline</CardTitle></CardHeader>
                        <CardContent><p className="font-body text-foreground">{analysis.financial_feasibility.roi_timeline}</p></CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Careers Tab */}
                  {activeTab === "careers" && (
                    <div className="space-y-3">
                      {analysis.top_careers.map((c, i) => (
                        <Card key={i} className="border-2 hover:border-primary/30 transition-colors">
                          <CardContent className="pt-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-display font-bold text-foreground">{c.title}</h3>
                              <div className="flex gap-2 shrink-0">
                                <Badge className="bg-primary/10 text-primary font-body text-xs">{c.salary}</Badge>
                                <Badge className={`font-body text-xs ${demandColor(c.demand)}`}>{c.demand}</Badge>
                              </div>
                            </div>
                            <p className="font-body text-sm text-muted-foreground">{c.path}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Colleges Tab */}
                  {activeTab === "colleges" && (
                    <div className="space-y-3">
                      {analysis.target_colleges.map((c, i) => (
                        <Card key={i} className="border-2 hover:border-primary/30 transition-colors">
                          <CardContent className="pt-4">
                            <h3 className="font-display font-bold text-foreground mb-1">{c.name}</h3>
                            <div className="flex flex-wrap gap-2 text-xs font-body">
                              <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" />{c.location}</span>
                              <Badge variant="secondary">{c.fees}</Badge>
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">{c.exam}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Roadmap Tab */}
                  {activeTab === "roadmap" && (
                    <div className="space-y-4">
                      {[
                        { key: "now", label: "🔥 Abhi Karo", color: "emerald" },
                        { key: "year1", label: "📅 Year 1", color: "blue" },
                        { key: "year2", label: "🎯 Year 2", color: "purple" },
                        { key: "longterm", label: "🌟 Long Term (5 years)", color: "orange" },
                      ].map(({ key, label, color }) => (
                        <Card key={key} className={`border-2 border-${color}-300 dark:border-${color}-800 bg-${color}-50 dark:bg-${color}-950/20`}>
                          <CardHeader className="pb-2"><CardTitle className="font-display text-base">{label}</CardTitle></CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {((analysis.structured_roadmap as any)[key] as string[]).map((item, i) => (
                                <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                                  <span className="text-primary font-bold shrink-0">•</span>{item}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Tips Tab */}
                  {activeTab === "tips" && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="font-display">📊 Competition Level</CardTitle></CardHeader>
                        <CardContent><p className="font-body text-foreground">{analysis.competition_level}</p></CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="font-display">✅ Success Tips</CardTitle></CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {analysis.success_tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="font-display">🔄 Backup Paths</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          {analysis.backup_paths.map((bp, i) => (
                            <div key={i} className="bg-muted/60 rounded-xl p-3">
                              <p className="font-display font-semibold text-foreground text-sm">{bp.title}</p>
                              <p className="font-body text-xs text-muted-foreground mt-1">{bp.description}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <Button
                onClick={() => setAnalysis(null)}
                variant="outline"
                className="w-full font-display font-semibold"
              >
                🔄 Naya Analysis Karo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
