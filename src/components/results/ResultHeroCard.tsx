import { motion } from "framer-motion";
import type { StreamResult } from "@/data/quizData";

interface Props {
  result: StreamResult;
  allScores: { science: number; commerce: number; arts: number };
}

const streamColors: Record<string, string> = {
  Science: "from-blue-500 to-purple-600",
  Commerce: "from-amber-500 to-orange-600",
  Arts: "from-pink-500 to-rose-600",
};

const streamEmojis: Record<string, string> = {
  Science: "🔬",
  Commerce: "📊",
  Arts: "🎨",
};

const ResultHeroCard = ({ result, allScores }: Props) => {
  const total = allScores.science + allScores.commerce + allScores.arts || 1;
  const percentages = {
    Science: Math.round((allScores.science / total) * 100),
    Commerce: Math.round((allScores.commerce / total) * 100),
    Arts: Math.round((allScores.arts / total) * 100),
  };

  const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="gradient-hero rounded-2xl p-8 text-primary-foreground"
    >
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{result.emoji}</div>
        <h1 className="font-display font-900 text-3xl md:text-5xl mb-2">
          {result.stream} Stream
        </h1>
        <p className="font-display font-bold text-xl opacity-90">{result.tagline}</p>
        <div className="mt-2 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-display font-semibold">
          🎯 {percentages[result.stream]}% Match
        </div>
      </div>

      {/* All 3 Stream Match Bars */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4 space-y-3">
        <p className="font-display font-semibold text-sm opacity-80 text-center mb-2">Aapka Stream Match Score</p>
        {sorted.map(([stream, pct], i) => (
          <div key={stream} className="flex items-center gap-3">
            <span className="text-lg w-6">{streamEmojis[stream]}</span>
            <span className="font-display font-semibold text-sm w-24">{stream}</span>
            <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                className={`h-full rounded-full ${i === 0 ? "bg-white" : "bg-white/50"}`}
              />
            </div>
            <span className="font-display font-bold text-sm w-10 text-right">
              {i === 0 ? `🥇 ${pct}%` : i === 1 ? `🥈 ${pct}%` : `🥉 ${pct}%`}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultHeroCard;
