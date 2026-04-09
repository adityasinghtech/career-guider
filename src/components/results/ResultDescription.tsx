import { motion } from "framer-motion";
import type { StreamResult } from "@/data/quizData";

const ResultDescription = ({ result }: { result: StreamResult }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-card rounded-2xl p-6 shadow-card"
  >
    <h2 className="font-display font-bold text-xl text-foreground mb-3">
      Aapke Liye Ye Kyun Best Hai? 🎯
    </h2>
    <p className="text-muted-foreground leading-relaxed">{result.description}</p>
  </motion.div>
);

export default ResultDescription;
