import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { StreamResult } from "@/data/quizData";
import {
  generateGuidance,
  profileFromLocalStorage,
  type StudentProfile,
} from "@/utils/guidanceEngine";

const streamKeyFromResult = (result: StreamResult): string => {
  const s = result.stream.toLowerCase();
  if (s === "science" || s === "commerce" || s === "arts") return s;
  return "science";
};

const ResultDescription = ({ result }: { result: StreamResult }) => {
  const output = useMemo(() => {
    const key = streamKeyFromResult(result);
    const stored = profileFromLocalStorage();
    const fallback: StudentProfile = {
      stream: key,
      selectedClass: "Class 10",
      selectedInterest: "undecided",
      dreamGoal: "",
      situation: [],
      confidence: 33,
      personality: "",
      scores: { science: 0, commerce: 0, arts: 0 },
    };
    const profile = stored ?? fallback;
    return generateGuidance({ ...profile, stream: profile.stream || key });
  }, [result]);

  const { urgencyLevel, primaryMessage, alertMessage, alternatePathMessage, studyEarningMessage, nextActionLink, nextActionLabel } =
    output;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-card rounded-2xl p-6 shadow-card border-l-4 ${
        urgencyLevel === "high"
          ? "border-l-amber-500"
          : urgencyLevel === "low"
            ? "border-l-muted-foreground/40"
            : "border-l-primary/60"
      }`}
    >
      {urgencyLevel === "high" && (
        <div
          className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-center text-sm font-display font-semibold text-red-800 dark:text-red-200 animate-pulse"
          role="status"
        >
          ⚡ Time-sensitive: Abhi action lena zaroori hai!
        </div>
      )}

      <h2 className="font-display font-bold text-xl text-foreground mb-3">
        Aapke Liye Ye Kyun Best Hai? 🎯
      </h2>

      <div className="mb-4 rounded-xl bg-background/80 border border-border/60 p-4">
        <p className="font-body text-foreground leading-relaxed whitespace-pre-line">{primaryMessage}</p>
      </div>

      {alertMessage?.trim() && (
        <div className="mb-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-r-xl">
          <p className="font-body text-sm leading-relaxed whitespace-pre-line text-amber-950 dark:text-amber-100">
            {alertMessage.trim()}
          </p>
        </div>
      )}

      {alternatePathMessage?.trim() && (
        <div className="mb-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-r-xl">
          <h3 className="font-display font-bold text-sm text-blue-950 dark:text-blue-100 mb-2">
            Alternate Path Available 🛤️
          </h3>
          <p className="font-body text-sm leading-relaxed whitespace-pre-line text-blue-950 dark:text-blue-100">
            {alternatePathMessage.trim()}
          </p>
        </div>
      )}

      {studyEarningMessage?.trim() && (
        <div className="mb-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 p-4 rounded-r-xl">
          <h3 className="font-display font-bold text-sm text-green-950 dark:text-green-100 mb-2">
            Padhai ke Saath Kamaai 💰
          </h3>
          <p className="font-body text-sm leading-relaxed whitespace-pre-line text-green-950 dark:text-green-100">
            {studyEarningMessage.trim()}
          </p>
        </div>
      )}

      {nextActionLink && nextActionLink !== "#" && (
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-display font-semibold text-foreground">Aage kya karein:</span>
          <Link
            to={nextActionLink}
            className="inline-flex items-center justify-center rounded-full gradient-hero px-4 py-2 text-xs font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {nextActionLabel}
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default ResultDescription;
