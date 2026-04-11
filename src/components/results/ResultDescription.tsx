import { useMemo } from "react";
import { motion } from "framer-motion";
import type { QuizProfile, StreamResult } from "@/data/quizData";
import { generatePersonalizedText } from "@/utils/personalizedDescription";

const ResultDescription = ({ result }: { result: StreamResult }) => {
  const quizProfile = useMemo(() => {
    try {
      const raw = localStorage.getItem("pathfinder_quiz_profile");
      return raw ? (JSON.parse(raw) as QuizProfile) : null;
    } catch {
      return null;
    }
  }, []);

  const text = useMemo(
    () => generatePersonalizedText(quizProfile, result),
    [quizProfile, result],
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
