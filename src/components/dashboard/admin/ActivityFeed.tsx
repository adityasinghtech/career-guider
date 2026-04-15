import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ActivityItem {
  type: "student" | "quiz" | "message";
  text: string;
  time: string;
  id: string;
}

interface ActivityFeedProps {
  activityFeed: ActivityItem[];
}

const ActivityFeed = ({ activityFeed }: ActivityFeedProps) => {
  const [showActivityFeed, setShowActivityFeed] = useState(false);

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-4 mb-6">
      <button
        onClick={() => setShowActivityFeed((v) => !v)}
        className="w-full flex items-center justify-between font-display font-bold text-foreground"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live Activity Feed
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            showActivityFeed ? "rotate-180" : ""
          }`}
        />
      </button>

      {showActivityFeed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-2"
        >
          {activityFeed.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Koi activity nahi abhi tak
            </p>
          ) : (
            activityFeed.map((item) => (
              <div
                key={item.id + item.time}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors"
              >
                <span className="text-lg">
                  {item.type === "student"
                    ? "<span aria-hidden='true'>👤</span>"
                    : item.type === "quiz"
                    ? "<span aria-hidden='true'>📝</span>"
                    : "<span aria-hidden='true'>💬</span>"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-foreground truncate">
                    {item.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(item.time).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ActivityFeed;
