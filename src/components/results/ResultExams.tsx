import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { StreamResult } from "@/data/quizData";

const ResultExams = ({ result }: { result: StreamResult }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
    className="bg-card rounded-2xl p-6 shadow-card"
  >
    <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
      <FileText className="w-5 h-5 text-primary" /> Kaunse Exams Dene Hain? <span aria-hidden="true">📝</span>
    </h2>
    <div className="space-y-2">
      {result.examsToPrepare.map((exam) => (
        <div key={exam} className="bg-muted/50 rounded-xl p-3 text-foreground font-body">
          {exam}
        </div>
      ))}
    </div>
  </motion.div>
);

export default ResultExams;
