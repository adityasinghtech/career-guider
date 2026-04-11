import { useMemo } from "react";
import { motion } from "framer-motion";
import type { QuizProfile, StreamResult } from "@/data/quizData";
import { generatePersonalizedDescription } from "@/utils/personalizedDescription";

const ResultDescription = ({ result }: { result: StreamResult }) => {
  const quizProfile = useMemo<QuizProfile | null>(() => {
    try {
      const raw = localStorage.getItem("pathfinder_quiz_profile");
      if (!raw) return null;
      return JSON.parse(raw) as QuizProfile;
    } catch {
      return null;
    }
  }, []);

  const text = useMemo(
    () => generatePersonalizedDescription(quizProfile, result.description),
    [quizProfile, result.description],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-bold text-xl text-foreground mb-3">
        Aapke Liye Ye Kyun Best Hai? 🎯
      </h2>
      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{text}</p>
    </motion.div>
  );
};

export default ResultDescription;
