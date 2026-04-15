import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecommendationResult {
  primary: "science" | "commerce" | "arts";
  alternate: "science" | "commerce" | "arts";
  confidence: number;
  scores: { science: number; commerce: number; arts: number };
  reasoning: string;
  nextSteps: string[];
  scholarships: string[];
}

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English",
  "History", "Geography", "Economics", "Hindi", "Sanskrit",
];

const INTERESTS = [
  "Engineering & Technology", "Medical & Healthcare",
  "Commerce & Finance", "Law & Governance", "Arts & Humanities",
  "Business & Entrepreneurship", "Research & Science", "Creative Arts",
  "Agriculture", "Social Sciences", "Sports & Fitness", "Teaching & Education",
];

const STATES = [
  "Bihar", "Uttar Pradesh", "Delhi", "Maharashtra", "Rajasthan",
  "Madhya Pradesh", "Gujarat", "West Bengal", "Karnataka", "Tamil Nadu",
  "Telangana", "Andhra Pradesh", "Punjab", "Haryana", "Jharkhand", "Other",
];

function getRecommendation(
  marks: number,
  subjects: string[],
  interests: string[],
  category: string
): RecommendationResult {
  let sciScore = 0, comScore = 0, artScore = 0;

  if (marks >= 80) sciScore += 30;
  else if (marks >= 65) { sciScore += 15; comScore += 25; }
  else if (marks >= 50) { comScore += 20; artScore += 25; }
  else { artScore += 30; comScore += 15; }

  if (subjects.includes("Mathematics")) { sciScore += 20; comScore += 15; }
  if (subjects.includes("Physics") || subjects.includes("Chemistry")) sciScore += 20;
  if (subjects.includes("Biology")) sciScore += 15;
  if (subjects.includes("Economics")) { comScore += 20; artScore += 10; }
  if (subjects.includes("History") || subjects.includes("Geography")) artScore += 20;
  if (subjects.includes("English")) { comScore += 10; artScore += 15; }
  if (subjects.includes("Hindi") || subjects.includes("Sanskrit")) artScore += 15;

  if (interests.includes("Engineering & Technology") || interests.includes("Research & Science")) sciScore += 25;
  if (interests.includes("Medical & Healthcare")) sciScore += 20;
  if (interests.includes("Commerce & Finance") || interests.includes("Business & Entrepreneurship")) comScore += 25;
  if (interests.includes("Law & Governance") || interests.includes("Arts & Humanities")) artScore += 25;
  if (interests.includes("Creative Arts")) artScore += 20;
  if (interests.includes("Social Sciences") || interests.includes("Teaching & Education")) artScore += 15;
  if (interests.includes("Sports & Fitness")) artScore += 10;

  const total = Math.max(sciScore + comScore + artScore, 1);
  const sciPct = Math.round((sciScore / total) * 100);
  const comPct = Math.round((comScore / total) * 100);
  const artPct = Math.round((artScore / total) * 100);

  let primary: "science" | "commerce" | "arts" = "arts";
  let confidence = artPct;
  if (sciScore >= comScore && sciScore >= artScore) { primary = "science"; confidence = sciPct; }
  else if (comScore >= artScore) { primary = "commerce"; confidence = comPct; }

  const alternate: "science" | "commerce" | "arts" =
    primary === "science" ? (comScore >= artScore ? "commerce" : "arts") :
      primary === "commerce" ? (sciScore >= artScore ? "science" : "arts") :
        (comScore >= sciScore ? "commerce" : "science");

  const scholarships: string[] = ["National Scholarship Portal (NSP)", "Central Sector Scheme"];
  if (category === "sc" || category === "st") scholarships.push("SC/ST Post Matric Scholarship", "Pre-Matric Scholarship");
  if (category === "obc") scholarships.push("OBC Scholarship", "PM Yasasvi Scholarship");
  if (category === "ews") scholarships.push("EWS Scholarship", "PM Yasasvi Scholarship");
  if (marks >= 80) scholarships.push("Merit-based Scholarship", "NMMS Scholarship");

  const strongSubjects = subjects.filter((s) => ["Mathematics", "Physics", "Chemistry", "Biology"].includes(s));
  const reasoningMap = {
    science: `Tumhare ${marks}% marks aur ${strongSubjects.length > 0 ? strongSubjects.join(", ") : "subjects"} strong hain. Science stream se Engineering, Medical, Research, Data Science — bahut scope hai!`,
    commerce: `Tumhara practical mindset aur business/finance interest dekh ke Commerce best fit hai. CA, MBA, Banking, Startup — sab possible hai!`,
    arts: `Tumhari creativity aur humanities interest dekh ke Arts perfect match hai. UPSC/IAS, Law, Design, Journalism, Teaching — powerful careers hain!`,
  };

  const nextSteps = {
    science: ["11th mein PCM ya PCB choose karo", "JEE/NEET syllabus samjho abhi se", "Physics Wallah ya NCERT se basics strong karo", "Scholarship portal pe apply karo"],
    commerce: ["11th mein Accounts + Economics + Business Studies lo", "CA Foundation ki preparation start karo", "Zerodha Varsity se stock market basics seekho", "CUET preparation shuru karo"],
    arts: ["11th mein History/Geo/Political Science/Sociology lo", "Daily newspaper padho — The Hindu ya Dainik Jagran", "UPSC/CLAT/NID/NIFT — goal decide karo", "Khan Sir ya Drishti IAS YouTube dekho"],
  };

  return {
    primary,
    alternate,
    confidence,
    scores: { science: sciPct, commerce: comPct, arts: artPct },
    reasoning: reasoningMap[primary],
    nextSteps: nextSteps[primary],
    scholarships,
  };
}

const streamConfig = {
  science: { label: <>Science 🔬</>, color: "blue", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-400", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", bar: "bg-blue-500", emoji: "🔬" },
  commerce: { label: <>Commerce 📈</>, color: "green", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-400", badge: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", bar: "bg-green-500", emoji: "📈" },
  arts: { label: <>Arts 🎨</>, color: "purple", bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-400", badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300", bar: "bg-purple-500", emoji: "🎨" },
};

export default function StreamRecommender() {
  const [marks, setMarks] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSubject = (s: string) =>
    setSelectedSubjects((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const toggleInterest = (i: string) =>
    setSelectedInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const handleSubmit = () => {
    const m = parseFloat(marks);
    if (!marks || isNaN(m) || m < 0 || m > 100) {
      setError("Kripya valid marks dalein (0–100)");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const r = getRecommendation(m, selectedSubjects, selectedInterests, category);
      setResult(r);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">Stream Finder</h1>
          <p className="text-muted-foreground font-body text-lg">10th ke baad kaunsa stream? — Abhi pata karo!</p>
        </motion.div>

        {!result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="font-display">📊 10th mein percentage kya thi?</CardTitle></CardHeader>
              <CardContent>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="jaise: 78 ya 92"
                  value={marks}
                  onChange={(e) => { setMarks(e.target.value); setError(""); }}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors text-lg"
                />
                {error && <p className="text-destructive text-sm mt-2 font-body">{error}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="font-display">📚 Kaunse subjects strong hain? (multiple select)</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={`px-3 py-2 rounded-xl border-2 font-display font-semibold text-sm transition-all ${selectedSubjects.includes(s)
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="font-display">❤️ Kaunse fields mein interest hai? (multiple select)</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleInterest(i)}
                      className={`px-3 py-2 rounded-xl border-2 font-display font-semibold text-sm transition-all ${selectedInterests.includes(i)
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="font-display text-base">🗺️ State</CardTitle></CardHeader>
                <CardContent>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="">Select karo (optional)</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="font-display text-base">🏷️ Category</CardTitle></CardHeader>
                <CardContent>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="">Select karo (optional)</option>
                    <option value="general">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                    <option value="ews">EWS</option>
                  </select>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || !marks}
              className="w-full gradient-hero text-primary-foreground font-display font-bold text-lg py-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? (
                <>Analyze kar raha hoon... ⏳</>
              ) : (
                "Stream Dhundo →"
              )}
          </Button>
          </motion.div>
      ) : (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Result Hero */}
        <Card className={`border-2 ${streamConfig[result.primary].border} ${streamConfig[result.primary].bg}`}>
          <CardContent className="pt-6 text-center">
            <div className="text-7xl mb-3">{streamConfig[result.primary].emoji}</div>
            <h2 className="font-display font-bold text-3xl text-foreground mb-2">
              {streamConfig[result.primary].label}
            </h2>
            <Badge className={`${streamConfig[result.primary].badge} text-sm px-3 py-1`}>
              {result.confidence}% Match 🎯
            </Badge>
            <p className="mt-4 text-muted-foreground font-body">{result.reasoning}</p>
          </CardContent>
        </Card>

        {/* Score Bars */}
        <Card>
          <CardHeader><CardTitle className="font-display flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Stream Score Comparison</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(["science", "commerce", "arts"] as const).map((stream) => (
              <div key={stream}>
                <div className="flex justify-between mb-1">
                  <span className="font-display font-semibold text-sm text-foreground">{streamConfig[stream].label}</span>
                  <span className="font-display font-bold text-sm text-foreground">{result.scores[stream]}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.scores[stream]}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${streamConfig[stream].bar}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alternate */}
        <Card>
          <CardContent className="pt-4">
            <p className="font-body text-muted-foreground">
              💡 <span className="font-semibold text-foreground">Alternate option:</span> {streamConfig[result.alternate].label} bhi consider kar sakte ho!
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader><CardTitle className="font-display flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Next Steps</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="font-body text-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Scholarships */}
        <Card>
          <CardHeader><CardTitle className="font-display">💰 Eligible Scholarships</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.scholarships.map((s, i) => (
                <Badge key={i} variant="secondary" className="font-body text-sm">{s}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/quiz" className="flex-1">
            <Button className="w-full gradient-hero text-primary-foreground font-display font-bold">
              Quiz bhi do <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => { setResult(null); setMarks(""); setSelectedSubjects([]); setSelectedInterests([]); }}
            className="flex-1 font-display font-semibold"
          >
            🔄 Dobara try karo
          </Button>
        </div>
      </motion.div>
        )}
    </div>
    </div >
  );
}

