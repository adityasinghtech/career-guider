import { motion } from "framer-motion";
import type { StreamResult } from "@/data/quizData";

const ResultRoadmap = ({ result }: { result: StreamResult }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="bg-card rounded-2xl p-6 shadow-card"
  >
    <h2 className="font-display font-bold text-xl text-foreground mb-4">
      12-Month Roadmap 🗺️
    </h2>
    <div className="space-y-4">
      {result.roadmap.map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm flex-shrink-0">
              {i + 1}
            </div>
            {i < result.roadmap.length - 1 && (
              <div className="w-0.5 h-full bg-primary/20 mt-1" />
            )}
          </div>
          <div className="pb-4">
            <h3 className="font-display font-bold text-foreground">{step.month}</h3>
            <p className="text-muted-foreground text-sm mt-1">{step.task}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default ResultRoadmap;
