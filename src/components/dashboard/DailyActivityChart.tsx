import { motion } from "framer-motion";

interface DailyActivityChartProps {
  quizResults: { created_at: string }[];
  students: { created_at: string }[];
}

const DailyActivityChart = ({ quizResults, students }: DailyActivityChartProps) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const dayData = last7Days.map(day => {
    const dayStr = day.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
    const dateStr = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
    
    const quizCount = quizResults.filter(r => r.created_at.startsWith(dateStr)).length;
    const studentCount = students.filter(s => s.created_at.startsWith(dateStr)).length;
    
    return { label: dayStr, quizzes: quizCount, students: studentCount };
  });

  const maxVal = Math.max(...dayData.map(d => Math.max(d.quizzes, d.students)), 1);

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6">
      <h3 className="font-display font-bold text-lg text-foreground mb-1">
        📅 Last 7 Days Activity
      </h3>
      <p className="text-xs text-muted-foreground font-body mb-5">
        Daily quizzes diye gaye aur naye students joined
      </p>
      <div className="flex items-end gap-2 h-40">
        {dayData.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-0.5 items-end h-28">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.quizzes / maxVal) * 100}%` }}
                transition={{ delay: i * 0.07 }}
                className="flex-1 gradient-hero rounded-t-md min-h-[2px]"
                title={`${day.quizzes} quizzes`}
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.students / maxVal) * 100}%` }}
                transition={{ delay: i * 0.07 + 0.03 }}
                className="flex-1 bg-emerald-400/70 rounded-t-md min-h-[2px]"
                title={`${day.students} students`}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-display text-center">
              {day.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-display">
          <span className="w-3 h-3 gradient-hero rounded-sm inline-block" /> Quizzes
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-display">
          <span className="w-3 h-3 bg-emerald-400/70 rounded-sm inline-block" /> New Students
        </span>
      </div>
    </div>
  );
};

export default DailyActivityChart;

