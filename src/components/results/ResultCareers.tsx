import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, ChevronDown, ChevronUp, Flame, GitCompare } from "lucide-react";
import type { StreamResult } from "@/data/quizData";
import { resolveCompareSlugFromLabel } from "@/data/careerComparison";

const ResultCareers = ({ result }: { result: StreamResult }) => {
  const [passionOpen, setPassionOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-2xl p-6 shadow-card space-y-8"
    >
      <div>
        <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" /> Career Options <span aria-hidden="true">💼</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {result.careers.map((career) => {
            const slug = resolveCompareSlugFromLabel(career);
            return (
              <div
                key={career}
                className="bg-muted/50 rounded-xl p-3 text-foreground font-body flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex-1 min-w-0">{career}</span>
                {slug && (
                  <Link
                    to={`/career-comparison?c=${slug}`}
                    className="inline-flex items-center gap-1.5 shrink-0 text-xs font-display font-semibold text-primary hover:underline border border-primary/30 rounded-lg px-2 py-1 self-start sm:self-center"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    Compare
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {result.modernCareers && result.modernCareers.length > 0 && (
        <section
          className="rounded-2xl border-2 border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-orange-50/80 to-amber-100/50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-900/20 dark:border-amber-800/60 p-5 md:p-6"
          aria-labelledby="modern-careers-heading"
        >
          <h3
            id="modern-careers-heading"
            className="font-display font-bold text-lg md:text-xl text-amber-950 dark:text-amber-100 mb-4 flex items-center gap-2"
          >
            <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            Modern & Trending Careers <span aria-hidden="true">🔥</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {result.modernCareers.map((c) => {
              const slug = resolveCompareSlugFromLabel(c.title);
              return (
                <div
                  key={c.title}
                  className="rounded-xl border border-amber-200/90 bg-card/90 dark:bg-card/80 dark:border-amber-800/50 p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h4 className="font-display font-bold text-foreground text-base leading-tight">{c.title}</h4>
                    <span className="shrink-0 text-xs font-display font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100 border border-amber-300/60 dark:border-amber-700/50">
                      {c.salary}
                    </span>
                  </div>
                  <span className="inline-block text-xs font-display font-semibold mb-2 px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 dark:bg-orange-950/60 dark:text-orange-100 border border-orange-200/80 dark:border-orange-800/50">
                    {c.trend}
                  </span>
                  <p className="text-sm text-muted-foreground font-body mt-1">{c.description}</p>
                  {slug && (
                    <Link
                      to={`/career-comparison?c=${slug}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-display font-semibold text-amber-800 dark:text-amber-200 hover:underline"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      Compare this career
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {result.nonAcademicCareers && result.nonAcademicCareers.length > 0 && (
        <section className="rounded-2xl border-2 border-border bg-muted/20 p-4 md:p-5" aria-labelledby="passion-careers-heading">
          <button
            type="button"
            id="passion-careers-heading"
            onClick={() => setPassionOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-3 text-left font-display font-bold text-lg text-foreground hover:text-primary transition-colors"
          >
            <span>Passion-Based Careers <span aria-hidden="true">🎭</span></span>
            {passionOpen ? (
              <ChevronUp className="w-5 h-5 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground" />
            )}
          </button>

          {passionOpen && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <ul className="space-y-3 font-body">
                {result.nonAcademicCareers.map((c) => (
                  <li
                    key={c.title}
                    className="rounded-lg bg-card/80 border border-border px-3 py-2.5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-display font-semibold text-foreground">{c.title}</span>
                      <span className="text-xs font-semibold text-primary shrink-0">{c.salary}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground font-body italic pt-1">
                Passion + Skill + Dedication = Success in these fields
              </p>
            </div>
          )}
        </section>
      )}
    </motion.div>
  );
};

export default ResultCareers;
