import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Briefcase, GraduationCap, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type StreamKey = "science" | "commerce" | "arts";

const paths = [
  {
    id: "higher-edu",
    emoji: "<span aria-hidden='true'>🎓</span>",
    title: "Higher Education",
    subtitle: "College / University admission",
    color: "blue",
    icon: GraduationCap,
    streams: {
      science: {
        exams: ["JEE Main (Jan & Apr)", "JEE Advanced", "NEET UG (May)", "BITSAT", "VITEEE", "CUET"],
        colleges: ["IITs", "NITs", "AIIMS", "BITS Pilani", "State Engineering Colleges", "Private Medical Colleges"],
        timeline: ["Jan-Apr: JEE Main / NEET prep final", "May: Exams dena", "Jun-Jul: Result + counselling", "Aug: Admission"],
        tip: "JEE ya NEET — ek main target rakho. Backup colleges list banao.",
      },
      commerce: {
        exams: ["CUET (May)", "IPMAT (IIM Indore)", "SET (Symbiosis)", "NPAT (NMIMS)", "CA Foundation"],
        colleges: ["SRCC Delhi", "Christ University", "Symbiosis Pune", "NMIMS Mumbai", "BHU Commerce", "IIMs (after graduation)"],
        timeline: ["Feb-Mar: CUET form fill karo", "Apr-May: Exams dena", "Jun-Jul: Counselling", "Aug: Admission"],
        tip: "CUET deke DU ke top colleges mein admission milti hai. IPMAT se directly IIM!",
      },
      arts: {
        exams: ["CUET (May)", "CLAT (May-Jun)", "NID DAT", "NIFT Entrance", "IIMC Entrance", "DU JAT"],
        colleges: ["JNU", "Delhi University", "NLU (Law)", "NID (Design)", "IIMC (Journalism)", "BHU Arts"],
        timeline: ["Feb-Mar: Form fill karo", "Apr-May: Exams dena", "Jun: Results", "Jul-Aug: Admission"],
        tip: "CLAT se NLU mein, CUET se DU/JNU mein — decide karo pehle.",
      },
    },
  },
  {
    id: "direct-job",
    emoji: "<span aria-hidden='true'>💼</span>",
    title: "Direct Job / Skill Course",
    subtitle: "Earn karo jaldi, experience lo",
    color: "green",
    icon: Briefcase,
    options: [
      { title: "ITI / Polytechnic Diploma", duration: "1-3 years", salary: "₹12-25K/month", desc: "Electrician, Mechanic, Plumber, AC Tech — high demand!" },
      { title: "Government Exams", duration: "6-12 months prep", salary: "₹25-60K/month", desc: "SSC CGL, Railway NTPC, Banking PO, State PCS" },
      { title: "Coding Bootcamp", duration: "3-6 months", salary: "₹20-50K/month", desc: "Web Dev, App Dev — companies hire freshers directly" },
      { title: "Digital Marketing Course", duration: "2-3 months", salary: "₹15-35K/month", desc: "Freelancing bhi possible, remote work bhi" },
      { title: "Video Editing / Content Creation", duration: "1-2 months", salary: "₹10-40K/month", desc: "YouTube, Instagram — apna career ya freelancing" },
      { title: "Tally + GST Certification", duration: "2-3 months", salary: "₹12-20K/month", desc: "Har business mein chahiye — quick job guarantee" },
    ],
  },
  {
    id: "gap-year",
    emoji: "<span aria-hidden='true'>📅</span>",
    title: "Gap Year / Coaching",
    subtitle: "Prepare karo, target achieve karo",
    color: "purple",
    icon: Clock,
    options: [
      { title: "JEE/NEET Dropper Batch", desc: "Allen, Aakash, PW — full year coaching. Rank improve karo.", action: "Admission Sep-Oct mein" },
      { title: "UPSC Foundation", desc: "Class start karo, GS + Optional select karo. 2-3 saal ki journey.", action: "Kabhi bhi start kar sakte ho" },
      { title: "Skill Development + Part-time Job", desc: "Online course karo + part-time kaam karo = experience + income.", action: "Kal se shuru kar sakte ho!" },
      { title: "Language Course", desc: "German/French/Japanese — abroad padhai ya job ke liye.", action: "3-6 month intensive course" },
    ],
  },
];

const colorMap = {
  blue: { border: "border-blue-400", card: "bg-blue-50 dark:bg-blue-950/30", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300", active: "ring-2 ring-blue-400" },
  green: { border: "border-green-400", card: "bg-green-50 dark:bg-green-950/30", badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300", active: "ring-2 ring-green-400" },
  purple: { border: "border-purple-400", card: "bg-purple-50 dark:bg-purple-950/30", badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300", active: "ring-2 ring-purple-400" },
};

export default function AfterTwelfth() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<StreamKey>("science");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("pathfinder_quiz_profile") || "{}");
      if (p.stream && ["science", "commerce", "arts"].includes(p.stream)) {
        setSelectedStream(p.stream as StreamKey);
      }
    } catch {/* ignore */}
  }, []);

  const selectedPathData = paths.find((p) => p.id === selectedPath);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="text-6xl mb-4"><span aria-hidden='true'>🚀</span></div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">12th ke Baad Kya?</h1>
          <p className="text-muted-foreground font-body text-lg">Tum decide karo — hum guide karenge <span aria-hidden='true'>🗺️</span></p>
        </motion.div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {paths.map((path) => {
            const colors = colorMap[path.color as keyof typeof colorMap];
            const isActive = selectedPath === path.id;
            return (
              <motion.div
                key={path.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer border-2 transition-all ${colors.border} ${isActive ? colors.active + " shadow-lg" : "hover:shadow-md"}`}
                  onClick={() => setSelectedPath(isActive ? null : path.id)}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="text-5xl mb-3">{path.emoji}</div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-1">{path.title}</h3>
                    <p className="text-muted-foreground font-body text-sm mb-4">{path.subtitle}</p>
                    <Button
                      className={`w-full font-display font-semibold text-sm ${isActive ? "gradient-hero text-primary-foreground" : "variant-outline"}`}
                      variant={isActive ? "default" : "outline"}
                    >
                      {isActive ? "Selected <span aria-hidden='true'>✓</span>" : "Details dekho"} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedPath && selectedPathData && (
            <motion.div
              key={selectedPath}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Higher Education Detail */}
              {selectedPath === "higher-edu" && (
                <div className="space-y-5">
                  {/* Stream Selector */}
                  <div className="flex gap-2 justify-center">
                    {(["science", "commerce", "arts"] as StreamKey[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedStream(s)}
                        className={`px-4 py-2 rounded-xl font-display font-semibold text-sm transition-all capitalize ${
                          selectedStream === s ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {s === "science" ? "<span aria-hidden='true'>🔬</span>" : s === "commerce" ? "<span aria-hidden='true'>📈</span>" : "<span aria-hidden='true'>🎨</span>"} {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const data = (selectedPathData as any).streams[selectedStream];
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader><CardTitle className="font-display text-base"><span aria-hidden="true">📝</span> Exams to Target</CardTitle></CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {data.exams.map((e: string) => (
                                <Badge key={e} variant="secondary" className="font-body">{e}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader><CardTitle className="font-display text-base"><span aria-hidden="true">🏛️</span> Top Colleges</CardTitle></CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {data.colleges.map((c: string) => (
                                <Badge key={c} className="bg-primary/10 text-primary font-body">{c}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="md:col-span-2">
                          <CardHeader><CardTitle className="font-display text-base"><span aria-hidden="true">📅</span> Timeline</CardTitle></CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {data.timeline.map((t: string, i: number) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                                  <span className="font-body text-sm text-foreground">{t}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="md:col-span-2 bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700">
                          <CardContent className="pt-4">
                            <p className="font-body text-amber-900 dark:text-amber-200"><span aria-hidden="true">💡</span> <strong>Tip:</strong> {data.tip}</p>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Direct Job Detail */}
              {selectedPath === "direct-job" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(selectedPathData as any).options.map((opt: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="h-full border-2 hover:border-green-400 transition-colors">
                        <CardContent className="pt-5 space-y-2">
                          <h3 className="font-display font-bold text-foreground">{opt.title}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-body text-xs">
                              <Clock className="w-3 h-3 mr-1" />{opt.duration}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-body text-xs"><span aria-hidden="true">💰</span> {opt.salary}</Badge>
                          </div>
                          <p className="font-body text-sm text-muted-foreground">{opt.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Gap Year Detail */}
              {selectedPath === "gap-year" && (
                <div className="space-y-3">
                  {(selectedPathData as any).options.map((opt: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                      <Card className="border-2 hover:border-purple-400 transition-colors">
                        <CardContent className="pt-4 flex flex-col sm:flex-row sm:items-start gap-3">
                          <div className="flex-1">
                            <h3 className="font-display font-bold text-foreground mb-1">{opt.title}</h3>
                            <p className="font-body text-sm text-muted-foreground">{opt.desc}</p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-body text-xs whitespace-nowrap shrink-0">
                            <span aria-hidden="true">📅</span> {opt.action}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 text-center">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30">
            <CardContent className="pt-6">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-xl text-foreground mb-2">Aur guidance chahiye?</h3>
              <p className="text-muted-foreground font-body mb-4">AI chatbot se apne specific questions poochho — personalized answers milenge!</p>
              <p className="text-muted-foreground font-body text-sm"><span aria-hidden="true">👇</span> Neeche chatbot ka icon hai — click karo!</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
