import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import DailyActivityChart from "../DailyActivityChart";

interface AnalyticsViewProps {
  analyticsExtra: {
    newStudentsToday: number;
    quizzesToday: number;
    messagesToday: number;
    classTotal: number;
    classCounts: Record<string, number>;
    classUnset: number;
    classOther: number;
    interestCounts: {
      tech: number;
      business: number;
      creative: number;
      sports: number;
      skills: number;
      undecided: number;
    };
    top5Cities: [string, number][];
    topCityMax: number;
  };
  quizResults: any[];
  students: any[];
  streamCounts: Record<string, number>;
  totalQuizzes: number;
  CLASS_ORDER: readonly string[];
}

const AnalyticsView = ({
  analyticsExtra,
  quizResults,
  students,
  streamCounts,
  totalQuizzes,
  CLASS_ORDER,
}: AnalyticsViewProps) => {
  return (
    <div className="space-y-4">
      {/* Today's activity */}
      <div className="rounded-2xl border-2 border-primary/25 bg-primary/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <CalendarDays className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm font-body text-foreground">
          <span className="font-display font-semibold">Aaj:</span>{" "}
          <span className="text-muted-foreground">
            {analyticsExtra.newStudentsToday} new students joined • {analyticsExtra.quizzesToday} quizzes given •{" "}
            {analyticsExtra.messagesToday} messages received
          </span>
        </p>
      </div>

      <DailyActivityChart quizResults={quizResults} students={students} />

      <div className="bg-card border-2 border-border rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg text-foreground mb-4">📊 Stream-wise Breakdown</h3>
        {Object.keys(streamCounts).length === 0 ? (
          <p className="text-muted-foreground text-sm">Abhi tak koi data nahi hai</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(streamCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([stream, count]) => {
                const pct = totalQuizzes > 0 ? (count / totalQuizzes) * 100 : 0;
                return (
                  <div key={stream}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-display font-semibold text-foreground capitalize">{stream}</span>
                      <span className="text-muted-foreground">
                        {count} ({Math.round(pct)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className="h-full gradient-hero rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Class-wise */}
      <div className="bg-card border-2 border-border rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg text-foreground mb-4">📚 Class-wise Students</h3>
        {analyticsExtra.classTotal === 0 ? (
          <p className="text-muted-foreground text-sm">Abhi tak koi student data nahi hai</p>
        ) : (
          <div className="space-y-3">
            {CLASS_ORDER.map((cls) => {
              const count = analyticsExtra.classCounts[cls] ?? 0;
              const pct = analyticsExtra.classTotal > 0 ? (count / analyticsExtra.classTotal) * 100 : 0;
              return (
                <div key={cls}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-display font-semibold text-foreground">{cls}</span>
                    <span className="text-muted-foreground">
                      {count} students ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className="h-full gradient-hero rounded-full"
                    />
                  </div>
                </div>
              );
            })}
            {analyticsExtra.classUnset > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-display font-semibold text-foreground">Class not set</span>
                  <span className="text-muted-foreground">
                    {analyticsExtra.classUnset} students (
                    {Math.round((analyticsExtra.classUnset / analyticsExtra.classTotal) * 100)}%)
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${analyticsExtra.classTotal > 0 ? (analyticsExtra.classUnset / analyticsExtra.classTotal) * 100 : 0}%`,
                    }}
                    className="h-full gradient-hero rounded-full"
                  />
                </div>
              </div>
            )}
            {analyticsExtra.classOther > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-display font-semibold text-foreground">Other / unlisted</span>
                  <span className="text-muted-foreground">
                    {analyticsExtra.classOther} students (
                    {Math.round((analyticsExtra.classOther / analyticsExtra.classTotal) * 100)}%)
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${analyticsExtra.classTotal > 0 ? (analyticsExtra.classOther / analyticsExtra.classTotal) * 100 : 0}%`,
                    }}
                    className="h-full gradient-hero rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interest distribution */}
      <div className="bg-card border-2 border-border rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg text-foreground mb-2">🎯 Interest Distribution</h3>
        <p className="text-xs text-muted-foreground font-body mb-4">
          Har quiz ke liye: scores close ho to &quot;Undecided&quot;, warna stream → category mein count hota hai.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(
            [
              { key: "tech", label: "💻 Tech", v: analyticsExtra.interestCounts.tech },
              { key: "business", label: "💼 Business", v: analyticsExtra.interestCounts.business },
              { key: "creative", label: "🎨 Creative", v: analyticsExtra.interestCounts.creative },
              { key: "sports", label: "🏆 Sports", v: analyticsExtra.interestCounts.sports },
              { key: "skills", label: "🛠️ Skills", v: analyticsExtra.interestCounts.skills },
              { key: "undecided", label: "🤷 Undecided", v: analyticsExtra.interestCounts.undecided },
            ] as const
          ).map((row) => (
            <div
              key={row.key}
              className="rounded-xl border border-border bg-muted/30 px-3 py-3 text-center shadow-card"
            >
              <p className="text-xs font-display font-semibold text-muted-foreground mb-1">{row.label}</p>
              <p className="font-display font-bold text-xl text-foreground">{row.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 cities */}
      <div className="bg-card border-2 border-border rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg text-foreground mb-4">🏙️ Top 5 Cities</h3>
        {analyticsExtra.top5Cities.length === 0 ? (
          <p className="text-muted-foreground text-sm">City data abhi tak nahi hai</p>
        ) : (
          <div className="space-y-4">
            {analyticsExtra.top5Cities.map(([city, count]) => {
              const barPct = analyticsExtra.topCityMax > 0 ? (count / analyticsExtra.topCityMax) * 100 : 0;
              return (
                <div key={city}>
                  <div className="flex justify-between text-sm mb-1 gap-2">
                    <span className="font-display font-semibold text-foreground truncate">{city}</span>
                    <span className="text-muted-foreground shrink-0">
                      {count} student{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      className="h-full gradient-hero rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;
