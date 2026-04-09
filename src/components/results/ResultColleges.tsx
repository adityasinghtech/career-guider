import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, IndianRupee, Search, Scissors } from "lucide-react";
import type { StreamResult } from "@/data/quizData";
import { allStates, stateLabels } from "@/data/quizData";

const ResultColleges = ({ result }: { result: StreamResult }) => {
  const [activeTab, setActiveTab] = useState("Bihar");
  const [searchQuery, setSearchQuery] = useState("");

  // Get only states that have colleges
  const availableStates = useMemo(() => {
    return allStates.filter((state) =>
      result.colleges.some((c) => c.state === state)
    );
  }, [result.colleges]);

  const filteredColleges = useMemo(() => {
    let colleges = result.colleges.filter((c) => c.state === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      colleges = colleges.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }
    return colleges;
  }, [result.colleges, activeTab, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-primary" /> Top Colleges — State Wise 🎓
      </h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="College ya city search karein..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground text-sm font-body focus:border-primary focus:outline-none"
        />
      </div>

      {/* State tabs - scrollable */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {availableStates.map((state) => (
          <button
            key={state}
            onClick={() => { setActiveTab(state); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-lg font-display font-semibold text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTab === state
                ? "gradient-hero text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {stateLabels[state] || state}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-3">
        {filteredColleges.length} college{filteredColleges.length !== 1 ? "s" : ""} — {stateLabels[activeTab] || activeTab}
      </p>

      <div className="space-y-3">
        {filteredColleges.map((college) => (
          <div
            key={college.name}
            className="bg-muted/50 rounded-xl p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-display font-bold text-foreground">{college.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {college.location}
                </p>
                {college.cutoff && (
                  <p className="text-xs text-accent font-semibold mt-1 flex items-center gap-1">
                    <Scissors className="w-3 h-3" /> Cutoff: {college.cutoff}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm flex-shrink-0">
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <IndianRupee className="w-3 h-3" /> {college.fees}
                </span>
                <span>{college.rating}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredColleges.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            {searchQuery ? "Koi match nahi mila — doosra search try karein" : "Is state mein abhi colleges add nahi hue"}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ResultColleges;
