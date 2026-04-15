import { useParams, Link } from "react-router-dom";
import { useRef, useMemo } from "react";
import { generateGuidance, profileFromLocalStorage } from "@/utils/guidanceEngine";
import { motion } from "framer-motion";
import { Download, RotateCcw, Share2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "@/components/Navbar";
import { streamResults } from "@/data/quizData";
import type { QuizProfile } from "@/data/quizData";
import ResultHeroCard from "@/components/results/ResultHeroCard";
import ResultDescription from "@/components/results/ResultDescription";
import ResultNextSteps from "@/components/results/ResultNextSteps";
import ResultEarningPaths from "@/components/results/ResultEarningPaths";
import ResultCareers from "@/components/results/ResultCareers";
import ResultExams from "@/components/results/ResultExams";
import ResultRoadmap from "@/components/results/ResultRoadmap";
import ResultColleges from "@/components/results/ResultColleges";
import ResultScholarships from "@/components/results/ResultScholarships";
import ResultYouTube from "@/components/results/ResultYouTube";
import ResultFreeCourses from "@/components/results/ResultFreeCourses";
import CareerPathGraph from "@/components/results/CareerPathGraph";

const EXPLORE_INTERESTS = [
  {
    title: "Science & Technology",
    description: "Experiments, coding, gadgets",
  },
  {
    title: "Business & Money",
    description: "Startups, finance, marketing",
  },
  {
    title: "Arts & Creativity",
    description: "Writing, design, music, film",
  },
  {
    title: "Sports & Fitness",
    description: "Athletics, coaching, sports management",
  },
] as const;

const TWELFTH_PASS_ACTIONS = [
  {
    title: "UG Admissions",
    description: "CUET, JEE, NEET counselling abhi shuru karo",
  },
  {
    title: "Direct Job",
    description: "Diploma, certificate courses, government exams",
  },
  {
    title: "Gap Year",
    description: "Coaching, skill courses, entrance exam prep",
  },
] as const;

const Results = () => {
  const { stream } = useParams<{ stream: string }>();
  const result = streamResults[stream || "science"];
  const reportRef = useRef<HTMLDivElement>(null);

  const guidanceUrgency = useMemo(() => {
    try {
      const s = stream || "science";
      const profile = profileFromLocalStorage();
      if (!profile) return "medium" as const;
      return generateGuidance({ ...profile, stream: profile.stream || s }).urgencyLevel;
    } catch {
      return "medium" as const;
    }
  }, [stream]);

  const quizProfile = useMemo<QuizProfile | null>(() => {
    try {
      const raw = localStorage.getItem("pathfinder_quiz_profile");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const selectedClass = quizProfile?.selectedClass;

  if (selectedClass === "Class 8" || selectedClass === "Class 9") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="gradient-hero rounded-2xl p-8 md:p-10 text-primary-foreground text-center shadow-lg mb-10"
          >
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-3">
              Abhi Explore Karo! <span aria-hidden="true">🚀</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-primary-foreground/95 max-w-2xl mx-auto leading-relaxed">
              Tum abhi {selectedClass} mein ho — yeh time hai naye fields discover karne ka!
            </p>
          </motion.section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {EXPLORE_INTERESTS.map((item, i) => (
              <motion.button
                key={item.title}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() =>
                  toast.success(`Great choice! ${item.title} mein bahut scope hai!`)
                }
                className="text-left rounded-2xl border-2 border-border bg-card p-5 hover:border-primary/50 hover:bg-muted/40 transition-all shadow-sm hover:shadow-md"
              >
                <h3 className="font-display font-bold text-lg text-foreground mb-1.5">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">{item.description}</p>
              </motion.button>
            ))}
          </div>

          <section className="rounded-2xl border-2 border-border bg-card p-6 md:p-8 mb-10">
            <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-4">
              Skills pe focus
            </h2>
            <ul className="space-y-3 font-body text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-semibold">•</span>
                Communication skills develop karo
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold">•</span>
                Maths strong rakho — har field mein kaam aata hai
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold">•</span>
                Apni hobbies ko seriously lo
              </li>
            </ul>
          </section>

          <div className="text-center">
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center font-display font-bold px-8 py-3.5 rounded-xl gradient-hero text-primary-foreground hover:opacity-90 transition-opacity shadow-md"
            >
              Stream Guide Dekhein (Class 10 ke baad)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allScores = quizProfile?.scores || {
    science: stream === "science" ? 38 : stream === "commerce" ? 10 : 8,
    commerce: stream === "science" ? 12 : stream === "commerce" ? 36 : 14,
    arts: stream === "science" ? 8 : stream === "commerce" ? 12 : 35,
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Maaf kijiye! Stream nahi mila <span aria-hidden="true">😅</span></p>
          <Link to="/quiz" className="text-primary underline mt-2 inline-block">
            Quiz dubara dijiye
          </Link>
        </div>
      </div>
    );
  }

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#FFFDF9",
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`PathFinder-${result.stream}-Report.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    }
  };

  const show12thPassBanner = selectedClass === "12th Pass";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Action buttons */}
        <div className="flex gap-3 mb-6 justify-end flex-wrap">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`<span aria-hidden="true">🎯</span> PathFinder Career Report\n\nMera result: ${result.stream} Stream ${result.emoji}\n${result.tagline}\n\nAap bhi apna career path discover karein!\n${window.location.origin}/quiz`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[hsl(142,70%,45%)] text-primary-foreground font-display font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Share2 className="w-4 h-4" /> WhatsApp Share
          </a>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 gradient-hero text-primary-foreground font-display font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" /> PDF Download Karein
          </button>
          <Link
            to="/quiz"
            className="flex items-center gap-2 border-2 border-border text-foreground font-display font-semibold px-5 py-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Dubara Quiz Dein
          </Link>
        </div>

        {/* Report content */}
        <div ref={reportRef} className="space-y-6" data-guidance-urgency={guidanceUrgency}>
          {show12thPassBanner && (
            <div className="rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-6 md:p-8 text-white shadow-lg border border-amber-300/40">
              <h2 className="font-display font-bold text-xl md:text-2xl text-center mb-6 drop-shadow-sm">
                <span aria-hidden="true">🎯</span> 12th Pass — Career Decide Karne Ka Time!
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {TWELFTH_PASS_ACTIONS.map((action) => (
                  <div
                    key={action.title}
                    className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 p-4 text-left"
                  >
                    <h3 className="font-display font-bold text-base mb-1">{action.title}</h3>
                    <p className="font-body text-sm text-white/90 leading-snug">
                      {action.description}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-white/90 mt-5 font-body">
                Scroll karein apna detailed result dekhne ke liye
              </p>
            </div>
          )}

          <ResultHeroCard result={result} allScores={allScores} />
          <ResultDescription result={result} />
          <ResultNextSteps fallbackStream={stream || "science"} />
          <ResultEarningPaths />
          <ResultCareers result={result} />
          <ResultExams result={result} />
          <ResultRoadmap result={result} />
          <CareerPathGraph result={result} />
          <ResultFreeCourses result={result} />
          <ResultColleges result={result} />
          <ResultScholarships result={result} />
          <ResultYouTube result={result} />

          {/* Footer note for PDF */}
          <div className="text-center text-xs text-muted-foreground pt-4">
            Generated by PathFinder on {new Date().toLocaleDateString("en-IN")} • pathfinder.app
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
