import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Award, Search } from "lucide-react";
import type { StreamResult } from "@/data/quizData";

const categoryOrder = [
  "Bihar", "UP", "National",
  "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal",
  "Rajasthan", "Madhya Pradesh", "Gujarat", "Telangana", "Kerala",
  "Punjab", "Haryana", "Jharkhand", "Uttarakhand", "Assam",
  "Odisha", "Chhattisgarh", "Andhra Pradesh",
  "International",
];

const categoryLabels: Record<string, string> = {
  Bihar: "🏛️ Bihar",
  UP: "🏛️ UP",
  National: "🇮🇳 National",
  Delhi: "🏙️ Delhi",
  Maharashtra: "🏙️ Maharashtra",
  Karnataka: "🏙️ Karnataka",
  "Tamil Nadu": "🏙️ Tamil Nadu",
  "West Bengal": "🏙️ West Bengal",
  Rajasthan: "🏛️ Rajasthan",
  "Madhya Pradesh": "🏛️ MP",
  Gujarat: "🏙️ Gujarat",
  Telangana: "🏙️ Telangana",
  Kerala: "🌴 Kerala",
  Punjab: "🏛️ Punjab",
  Haryana: "🏛️ Haryana",
  Jharkhand: "🏛️ Jharkhand",
  Uttarakhand: "🏔️ Uttarakhand",
  Assam: "🌿 Assam",
  Odisha: "🏛️ Odisha",
  Chhattisgarh: "🏛️ Chhattisgarh",
  "Andhra Pradesh": "🏛️ AP",
  International: "🌍 International",
};

const ResultScholarships = ({ result }: { result: StreamResult }) => {
  const [activeCategory, setActiveCategory] = useState("Bihar");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Read student profile for personalised filter
  const profile = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("pathfinder_quiz_profile") || "{}"); }
    catch { return {}; }
  }, []);
  const studentCategory: string | null = profile.category || null;

  // Top-level filter options
  const filterOptions = [
    "All",
    "National",
    "Bihar",
    "UP",
    "International",
    ...(studentCategory && studentCategory !== "general" ? ["Aapke liye 🎯"] : []),
  ];

  // Pre-scoped pool based on top-level filter
  const scopedScholarships = useMemo(() => {
    if (activeFilter === "All") return result.scholarships;
    if (activeFilter === "Aapke liye 🎯") {
      return result.scholarships.filter(
        (s) =>
          s.category === "National" ||
          s.eligibility?.toLowerCase().includes(studentCategory?.toLowerCase() ?? "")
      );
    }
    return result.scholarships.filter((s) => s.category === activeFilter);
  }, [result.scholarships, activeFilter, studentCategory]);

  const availableCategories = useMemo(() => {
    return categoryOrder.filter((cat) =>
      scopedScholarships.some((s) => s.category === cat)
    );
  }, [scopedScholarships]);

  const filteredScholarships = useMemo(() => {
    let scholarships = scopedScholarships.filter((s) => s.category === activeCategory);
    if (!scholarships.length && availableCategories.length) {
      // If current category becomes empty after filter change, fall back to first available
      scholarships = scopedScholarships.filter((s) => s.category === availableCategories[0]);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      scholarships = scholarships.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.eligibility.toLowerCase().includes(q)
      );
    }
    return scholarships;
  }, [scopedScholarships, activeCategory, availableCategories, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" /> Scholarships — State Wise 💸
      </h2>

      {/* NSP Portal Quick Link */}
      <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-display font-bold text-foreground">National Scholarship Portal</p>
          <p className="text-xs text-muted-foreground">Sabhi govt scholarships ek jagah</p>
        </div>
        <a
          href="https://scholarships.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-display font-semibold px-3 py-2 rounded-lg gradient-hero text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
        >
          Visit NSP 🔗
        </a>
      </div>

      {/* Top-level personalised filter */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => {
            const isPersonalised = opt === "Aapke liye 🎯";
            const isActive = activeFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => {
                  setActiveFilter(opt);
                  setSearchQuery("");
                  // Reset category to first available when filter changes
                  const first = categoryOrder.find((cat) =>
                    (opt === "All" ? result.scholarships : result.scholarships.filter(
                      (s) => opt === "Aapke liye 🎯"
                        ? s.category === "National" || s.eligibility?.toLowerCase().includes(studentCategory?.toLowerCase() ?? "")
                        : s.category === opt
                    )).some((s) => s.category === cat)
                  );
                  if (first) setActiveCategory(first);
                }}
                className={`px-3 py-1.5 rounded-full font-display font-semibold text-xs transition-all border ${
                  isPersonalised && isActive
                    ? "bg-amber-500 border-amber-500 text-white"
                    : isPersonalised
                    ? "border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    : isActive
                    ? "gradient-hero border-transparent text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {scopedScholarships.length} scholarship{scopedScholarships.length !== 1 ? "s" : ""}
          {activeFilter !== "All" ? ` — ${activeFilter}` : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Scholarship search karein..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground text-sm font-body focus:border-primary focus:outline-none"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-lg font-display font-semibold text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
              activeCategory === cat
                ? "gradient-hero text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {filteredScholarships.length} scholarship{filteredScholarships.length !== 1 ? "s" : ""} — {categoryLabels[activeCategory] || activeCategory}
      </p>

      <div className="space-y-4">
        {filteredScholarships.map((s) => (
          <div key={s.name} className="bg-muted/50 rounded-xl p-4 space-y-2 border border-border/50 hover:border-primary/30 transition-colors">
            {/* Name */}
            <h3 className="font-display font-bold text-foreground">{s.name}</h3>

            {/* Amount — prominent */}
            {s.amount && (
              <span className="inline-block text-sm font-display font-bold text-green-700 dark:text-green-400">
                💰 {s.amount}
              </span>
            )}

            {/* Eligibility */}
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Eligibility:</span> {s.eligibility}
            </p>

            {/* Deadline + Apply row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {s.deadline && (
                <span className="text-xs text-amber-700 dark:text-amber-400 font-display font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  ⏰ {s.deadline}
                </span>
              )}
              <a
                href={s.link || "https://scholarships.gov.in"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-display font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Apply Now → 🔗
              </a>
            </div>
          </div>
        ))}
        {filteredScholarships.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            {searchQuery ? "Koi match nahi mila" : "Is category mein scholarships nahi hain"}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ResultScholarships;
