import { motion } from "framer-motion";
import { Users, BookOpen, BarChart3, Mail } from "lucide-react";

interface DashboardStatsProps {
  totalStudents: number;
  totalQuizzes: number;
  streamCounts: Record<string, number>;
  unreadCount: number;
  statsWithTrend: {
    newStudentsToday: number;
    quizzesToday: number;
  };
  analyticsExtra: {
    messagesToday: number;
  };
}

const DashboardStats = ({
  totalStudents,
  totalQuizzes,
  streamCounts,
  unreadCount,
  statsWithTrend,
  analyticsExtra,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border-2 border-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground">{totalStudents}</span>
        </div>
        <p className="text-muted-foreground text-sm font-body">Kul Students</p>
        <p className="text-xs text-muted-foreground mt-1 font-body">
          +{statsWithTrend.newStudentsToday} aaj
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border-2 border-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-orange-500" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground">{totalQuizzes}</span>
        </div>
        <p className="text-muted-foreground text-sm font-body">Kul Quiz Diye Gaye</p>
        <p className="text-xs text-muted-foreground mt-1 font-body">
          +{statsWithTrend.quizzesToday} aaj
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border-2 border-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-secondary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground">{Object.keys(streamCounts).length}</span>
        </div>
        <p className="text-muted-foreground text-sm font-body">Active Streams</p>
        <p className="text-xs text-muted-foreground mt-1 font-body">
          {Object.keys(streamCounts).length > 0 ? "Trending 📈" : "No streams yet"}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border-2 border-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground">{unreadCount}</span>
        </div>
        <p className="text-muted-foreground text-sm font-body">Naye Messages</p>
        <p className="text-xs text-muted-foreground mt-1 font-body">
          +{analyticsExtra.messagesToday} aaj
        </p>
      </motion.div>
    </div>
  );
};

export default DashboardStats;
