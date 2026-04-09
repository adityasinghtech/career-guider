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

  const availableCategories = useMemo(() => {
    return categoryOrder.filter((cat) =>
      result.scholarships.some((s) => s.category === cat)
    );
  }, [result.scholarships]);

  const filteredScholarships = useMemo(() => {
    let scholarships = result.scholarships.filter((s) => s.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      scholarships = scholarships.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.eligibility.toLowerCase().includes(q)
      );
    }
    return scholarships;
  }, [result.scholarships, activeCategory, searchQuery]);

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
          <div key={s.name} className="bg-muted/50 rounded-xl p-4 space-y-2">
            <h3 className="font-display font-bold text-foreground">{s.name}</h3>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Amount: </span>
                <span className="text-primary font-semibold">{s.amount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Deadline: </span>
                <span className="text-foreground font-medium">{s.deadline}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Eligibility:</span> {s.eligibility}
            </p>
            <a
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-primary font-semibold hover:underline"
            >
              Apply Karein →
            </a>
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
