import { motion } from "framer-motion";
import { Youtube } from "lucide-react";
import type { StreamResult } from "@/data/quizData";

const ResultYouTube = ({ result }: { result: StreamResult }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="bg-card rounded-2xl p-6 shadow-card"
  >
    <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
      <Youtube className="w-5 h-5 text-primary" /> Free Padhai — YouTube Channels 🎥
    </h2>
    <div className="space-y-2">
      {result.youtubeChannels.map((ch) => (
        <div key={ch} className="bg-muted/50 rounded-xl p-3 text-foreground font-body">
          {ch}
        </div>
      ))}
    </div>
  </motion.div>
);

export default ResultYouTube;
