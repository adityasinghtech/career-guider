import { useMemo, useId } from "react";
import { motion } from "framer-motion";

const R = 50;
/** 2 * Math.PI * 50 ≈ 314 — matches spec for dasharray/offset */
const CIRC = 2 * Math.PI * 50;

export interface CareerReadinessScoreProps {
  quizCount: number;
  hasGoal: boolean;
  checklistPercent: number;
  streakDays: number;
}

function pillClass(score: number, max: number): string {
  if (score <= 0) return "bg-muted/80 text-muted-foreground border-border";
  if (score >= max) return "bg-green-500/15 text-green-800 dark:text-green-300 border-green-500/40";
  return "bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/40";
}

const CareerReadinessScore = ({
  quizCount,
  hasGoal,
  checklistPercent,
  streakDays,
}: CareerReadinessScoreProps) => {
  const gradId = useId().replace(/:/g, "");

  const { quizScore, goalScore, checklistScore, streakScore, total } = useMemo(() => {
    const q = quizCount > 0 ? 25 : 0;
    const g = hasGoal ? 20 : 0;
    const c = Math.round(checklistPercent * 30);
    const s = Math.min(streakDays * 5, 25);
    return {
      quizScore: q,
      goalScore: g,
      checklistScore: c,
      streakScore: s,
      total: q + g + c + s,
    };
  }, [quizCount, hasGoal, checklistPercent, streakDays]);

  const finalOffset = CIRC - (total / 100) * CIRC;

  const message =
    total >= 80 ? (
      <p className="font-display font-bold text-green-600 dark:text-green-400">Bahut Badhiya! <span aria-hidden='true'>🔥</span></p>
    ) : total >= 50 ? (
      <p className="font-display font-bold text-amber-600 dark:text-amber-400">Achha Progress! <span aria-hidden='true'>💪</span></p>
    ) : (
      <p className="font-display font-bold text-muted-foreground">Abhi Shuru Karo! <span aria-hidden='true'>🎯</span></p>
    );

  const pills = [
    { label: "Quiz <span aria-hidden='true'>✅</span>", score: quizScore, max: 25, text: `${quizScore}/25` },
    { label: "Goal", score: goalScore, max: 20, text: `${goalScore}/20` },
    { label: "Checklist", score: checklistScore, max: 30, text: `${checklistScore}/30` },
    { label: "Streak", score: streakScore, max: 25, text: `${streakScore}/25` },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-2 border-border rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-bold text-lg text-foreground mb-4 text-center">Career Readiness</h2>

      <div className="flex flex-col items-center">
        <div className="relative mx-auto mb-4 h-[120px] w-[120px] shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" className="absolute inset-0">
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
              </linearGradient>
            </defs>
            <circle cx={60} cy={60} r={R} fill="none" stroke="#e5e7eb" strokeWidth={8} />
            <g transform="rotate(-90 60 60)">
              <motion.circle
                cx={60}
                cy={60}
                r={R}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: finalOffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </g>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-display font-black text-2xl text-foreground leading-none">
              {total}
              <span className="text-lg font-bold text-muted-foreground">/100</span>
            </p>
          </div>
        </div>

        <div className="w-full mb-4 text-center">{message}</div>

        <div className="flex flex-wrap justify-center gap-2 w-full">
          {pills.map((p) => (
            <span
              key={p.label}
              className={`inline-flex items-center gap-1 rounded-full border-2 px-3 py-1.5 text-xs font-display font-semibold ${pillClass(p.score, p.max)}`}
            >
              {p.label} {p.text}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CareerReadinessScore;
