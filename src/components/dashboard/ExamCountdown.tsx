import { useEffect, useMemo, useState } from "react";
import { motion, animate } from "framer-motion";

type StreamKey = "science" | "commerce" | "arts";

type ExamColor = "blue" | "green" | "purple" | "amber";

interface ExamItem {
  name: string;
  date: string;
  color: ExamColor;
}

const EXAMS: Record<StreamKey, ExamItem[]> = {
  science: [
    { name: "JEE Main", date: "2026-04-02", color: "blue" },
    { name: "NEET UG", date: "2026-05-04", color: "green" },
    { name: "JEE Advanced", date: "2026-05-18", color: "blue" },
    { name: "BITSAT", date: "2026-06-01", color: "purple" },
  ],
  commerce: [
    { name: "CA Foundation", date: "2026-06-01", color: "amber" },
    { name: "CUET UG", date: "2026-05-15", color: "blue" },
    { name: "IPMAT", date: "2026-05-20", color: "green" },
    { name: "CLAT", date: "2026-05-11", color: "purple" },
  ],
  arts: [
    { name: "CLAT", date: "2026-05-11", color: "blue" },
    { name: "CUET UG", date: "2026-05-15", color: "green" },
    { name: "IIMC Entrance", date: "2026-05-25", color: "amber" },
    { name: "DU Open", date: "2026-07-01", color: "purple" },
  ],
};

function normalizeStream(stream: string): StreamKey {
  const s = stream.toLowerCase();
  if (s === "commerce") return "commerce";
  if (s === "arts") return "arts";
  return "science";
}

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function daysUntilExam(examDateStr: string): number {
  const exam = parseLocalDate(examDateStr);
  exam.setHours(0, 0, 0, 0);
  const today = startOfToday();
  return Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function cardClasses(daysLeft: number): string {
  if (daysLeft <= 7) {
    return "border-red-400";
  }
  if (daysLeft <= 30) {
    return "border-amber-400";
  }
  return "border-border";
}

function dayNumberColorClass(daysLeft: number): string {
  if (daysLeft <= 7) return "text-red-600 dark:text-red-400";
  if (daysLeft <= 30) return "text-amber-600 dark:text-amber-400";
  return "text-primary";
}

function ExamDayCount({ daysLeft, colorClass }: { daysLeft: number; colorClass: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, daysLeft, {
      duration: 0.75,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [daysLeft]);

  return (
    <span className={`font-display font-black text-3xl tabular-nums ${colorClass}`}>{display}</span>
  );
}

const ExamCountdown = ({ stream }: { stream: string }) => {
  const key = normalizeStream(stream);

  const upcoming = useMemo(() => {
    return EXAMS[key]
      .map((exam) => ({ ...exam, daysLeft: daysUntilExam(exam.date) }))
      .filter((e) => e.daysLeft > 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [key]);

  if (upcoming.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card border-2 border-border rounded-2xl p-5 md:p-6 shadow-card"
    >
      <h2 className="font-display font-bold text-lg text-foreground mb-4">Upcoming Exams ⏰</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {upcoming.map((exam) => (
          <div
            key={`${exam.name}-${exam.date}`}
            className={`min-w-[140px] shrink-0 snap-start bg-card border-2 rounded-xl p-4 text-center relative ${cardClasses(exam.daysLeft)}`}
          >
            {exam.daysLeft <= 7 && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-display font-bold uppercase tracking-wide text-white">
                URGENT
              </span>
            )}
            <div className="mt-1">
              <ExamDayCount daysLeft={exam.daysLeft} colorClass={dayNumberColorClass(exam.daysLeft)} />
            </div>
            <p className="text-muted-foreground text-xs font-body mt-1">din bache</p>
            <p className="font-display font-semibold text-sm mt-2 text-foreground leading-tight">{exam.name}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default ExamCountdown;

