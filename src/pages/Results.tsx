import { useParams, Link } from "react-router-dom";
import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "@/components/Navbar";
import { streamResults, buildQuizProfile } from "@/data/quizData";
import type { QuizProfile } from "@/data/quizData";
import ResultHeroCard from "@/components/results/ResultHeroCard";
import ResultDescription from "@/components/results/ResultDescription";
import ResultCareers from "@/components/results/ResultCareers";
import ResultExams from "@/components/results/ResultExams";
import ResultRoadmap from "@/components/results/ResultRoadmap";
import ResultColleges from "@/components/results/ResultColleges";
import ResultScholarships from "@/components/results/ResultScholarships";
import ResultYouTube from "@/components/results/ResultYouTube";
import ResultFreeCourses from "@/components/results/ResultFreeCourses";
import CareerPathGraph from "@/components/results/CareerPathGraph";

const Results = () => {
  const { stream } = useParams<{ stream: string }>();
  const result = streamResults[stream || "science"];
  const reportRef = useRef<HTMLDivElement>(null);

  // Get quiz profile from localStorage or fallback
  const quizProfile = useMemo<QuizProfile | null>(() => {
    try {
      const raw = localStorage.getItem("pathfinder_quiz_profile");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);

  const allScores = quizProfile?.scores || {
    science: stream === "science" ? 38 : stream === "commerce" ? 10 : 8,
    commerce: stream === "science" ? 12 : stream === "commerce" ? 36 : 14,
    arts: stream === "science" ? 8 : stream === "commerce" ? 12 : 35,
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Maaf kijiye! Stream nahi mila 😅</p>
          <Link to="/quiz" className="text-primary underline mt-2 inline-block">Quiz dubara dijiye</Link>
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Action buttons */}
        <div className="flex gap-3 mb-6 justify-end flex-wrap">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🎯 PathFinder Career Report\n\nMera result: ${result.stream} Stream ${result.emoji}\n${result.tagline}\n\nAap bhi apna career path discover karein!\n${window.location.origin}/quiz`)}`}
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
        <div ref={reportRef} className="space-y-6">
          <ResultHeroCard result={result} allScores={allScores} />
          <ResultDescription result={result} />
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
