import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { StreamResult } from "@/data/quizData";
import {
  generateGuidance,
  profileFromLocalStorage,
} from "@/utils/guidanceEngine";

const streamKeyFromResult = (result: StreamResult): string => {
  const s = result.stream.toLowerCase();
  if (s === "science" || s === "commerce" || s === "arts") return s;
  return "science";
};

const ResultDescription = ({ result }: { result: StreamResult }) => {
  const guidance = useMemo(() => {
    const key = streamKeyFromResult(result);
    const profile = profileFromLocalStorage(key);
    return generateGuidance(profile);
  }, [result]);

  const { urgencyLevel } = guidance;

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
      <h2 className="font-display font-bold text-xl text-foreground mb-3">
        Aapke Liye Ye Kyun Best Hai? 🎯
      </h2>

      <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-4">
        {guidance.primaryMessage}
      </p>

      {guidance.alertMessage?.trim() && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-body leading-relaxed whitespace-pre-line">{guidance.alertMessage.trim()}</p>
        </div>
      )}

      {guidance.alternatePathMessage?.trim() && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-100">
          <p className="font-body leading-relaxed whitespace-pre-line">{guidance.alternatePathMessage.trim()}</p>
        </div>
      )}

      {guidance.studyEarningMessage?.trim() && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-950 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-100">
          <p className="font-body leading-relaxed whitespace-pre-line">{guidance.studyEarningMessage.trim()}</p>
        </div>
      )}

      {guidance.nextActionLink && guidance.nextActionLink !== "#" && (
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-display font-semibold text-foreground">Aage kya karein:</span>
          <Link
            to={guidance.nextActionLink}
            className="inline-flex items-center justify-center rounded-full gradient-hero px-4 py-2 text-xs font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {guidance.nextActionLabel}
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default ResultDescription;
