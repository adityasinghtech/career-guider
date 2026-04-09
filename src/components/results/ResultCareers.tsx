import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import type { StreamResult } from "@/data/quizData";

const ResultCareers = ({ result }: { result: StreamResult }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-card rounded-2xl p-6 shadow-card"
  >
    <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
      <Briefcase className="w-5 h-5 text-primary" /> Career Options 💼
    </h2>
    <div className="grid md:grid-cols-2 gap-3">
      {result.careers.map((career) => (
        <div key={career} className="bg-muted/50 rounded-xl p-3 text-foreground font-body">
          {career}
        </div>
      ))}
    </div>
  </motion.div>
);

export default ResultCareers;
