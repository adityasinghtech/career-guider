import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, IndianRupee, Search, Scissors } from "lucide-react";
import type { StreamResult, College, CollegeTypeTag } from "@/data/quizData";
import { allStates, stateLabels } from "@/data/quizData";

type CategoryFilter = "all" | CollegeTypeTag;

/** When `collegeType` is omitted in data, infer for filters + badges */
function resolveCollegeType(c: College): CollegeTypeTag {
  if (c.collegeType) return c.collegeType;
  const n = c.name.toLowerCase();
  const loc = c.location.toLowerCase();
  const f = c.fees.toLowerCase();
  if (/\biit\b|\biisc\b|\baiims\b/.test(n)) return "top";
  if (n.includes("nit ") || n.startsWith("nit ") || n.includes("(nit")) return "top";
  if (/\biiit\b/.test(n)) return "top";
  if (/\bbits\b/.test(n)) return "top";
  if (/polytechnic/.test(n) || /\bdiploma\b/.test(n)) return "polytechnic";
  if (/international|🇺🇸|🇬🇧|🇩🇪|🇨🇦|🇫🇷|🇸🇬|🇰🇷|🇯🇵|🇦🇺/.test(loc)) return "top";
  if (
    /iim |xlri|fms |mdi |nlsiu|nlud|^nlu |srcc|lse |harvard|wharton|insead|oxford|cambridge|stanford|^mit |eth |nus |kaist|mannheim|rotman|yonsei|mext|fulbright|commonwealth|daad|national law school|school of economics/.test(
      n,
    )
  ) {
    return "top";
  }
  if (/mit \(massachusetts/.test(n)) return "top";
  if (
    /private|nmims|symbiosis|christ university|manipal|^vit |srm university|amity|reva|jain university|pes university|st\. xavier|loyola college|ashoka|flame|krea|narsee monjee|set \/|srishti|asian college/.test(
      n,
    )
  ) {
    return "private";
  }
  if (
    (/college of engineering|institute of technology|hbtu|government medical|national institute of technology|vssut|dcrust|^coep|^vjti|savitribai phule pune university/i.test(n) &&
      !/private/i.test(n)) ||
    /^patna medical|^muzaffarpur institute|^bhagalpur college|^gaya college|^nalanda medical|^darbhanga medical/i.test(n)
  ) {
    return "government";
  }
  if (/lak|l\/year|l\/2|l\/sem|\$|£|€|cad |aud |sgd /.test(f) || /[5-9]l|[1-9][0-9]l/.test(f)) {
    return "private";
  }
  return "government";
}

function feesBadgeClass(fees: string): string {
  const s = fees.toLowerCase();
  if (/free|₹1,628|scholarship only|€250|₹22k|₹45k|semester.*₹/.test(s)) {
    return "bg-green-500/15 text-green-800 dark:text-green-200 border-green-500/40";
  }
  if (/\$|£|€|cad |aud |sgd |[6-9]l|crore|full tuition|55,000\/year/.test(s)) {
    return "bg-red-500/15 text-red-800 dark:text-red-200 border-red-500/40";
  }
  if (/[3-5]l|4-5l|4-6l|3-4l|2-4l/.test(s)) {
    return "bg-red-500/15 text-red-800 dark:text-red-200 border-red-500/40";
  }
  if (/k\/year|k-/.test(s) && !/[4-9]l/.test(s)) {
    return "bg-green-500/15 text-green-800 dark:text-green-200 border-green-500/40";
  }
  if (/1l|2l|1-2l|2-3l|1\.5l|80k|90k/.test(s)) {
    return "bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/40";
  }
  return "bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/40";
}

const typeBadgeClass: Record<CollegeTypeTag, string> = {
  government: "bg-blue-500/15 text-blue-800 dark:text-blue-200 border-blue-500/40",
  private: "bg-muted text-muted-foreground border-border",
  polytechnic: "bg-violet-500/15 text-violet-800 dark:text-violet-200 border-violet-500/40",
  local: "bg-teal-500/15 text-teal-800 dark:text-teal-200 border-teal-500/40",
  top: "bg-amber-400/25 text-amber-950 dark:text-amber-100 border-amber-500/50",
};

const typeLabel: Record<CollegeTypeTag, string> = {
  government: "Govt",
  private: "Private",
  polytechnic: "Polytechnic",
  local: "Local",
  top: "Top",
};

const categoryOptions: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "top", label: "Top Colleges" },
  { id: "government", label: "Government" },
  { id: "private", label: "Private" },
  { id: "polytechnic", label: "Polytechnic/Diploma" },
  { id: "local", label: "Local" },
];

const admissionLabel: Record<NonNullable<College["admissionType"]>, string> = {
  merit: "Merit",
  entrance: "Entrance",
  management: "Management",
};

const ResultColleges = ({ result }: { result: StreamResult }) => {
  const [activeTab, setActiveTab] = useState("Bihar");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const availableStates = useMemo(() => {
    return allStates.filter((state) => result.colleges.some((c) => c.state === state));
  }, [result.colleges]);

  const filteredColleges = useMemo(() => {
    let colleges = result.colleges.filter((c) => c.state === activeTab);
    if (categoryFilter !== "all") {
      colleges = colleges.filter((c) => resolveCollegeType(c) === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      colleges = colleges.filter(
        (c) => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q),
      );
    }
    return colleges;
  }, [result.colleges, activeTab, searchQuery, categoryFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-2xl p-6 shadow-card border border-border"
    >
      <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-primary" /> Top & Local Colleges — State Wise 🎓
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

      {/* Category filter — horizontal scroll on mobile */}
      <p className="text-xs font-display font-semibold text-muted-foreground mb-2">Category</p>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin">
        {categoryOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setCategoryFilter(opt.id)}
            className={`px-3 py-1.5 rounded-lg font-display font-semibold text-xs whitespace-nowrap transition-colors flex-shrink-0 snap-start border-2 ${
              categoryFilter === opt.id
                ? "gradient-hero text-primary-foreground border-transparent"
                : "bg-muted text-muted-foreground hover:bg-muted/80 border-border"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* State tabs */}
      <p className="text-xs font-display font-semibold text-muted-foreground mb-2">State</p>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {availableStates.map((state) => (
          <button
            key={state}
            type="button"
            onClick={() => {
              setActiveTab(state);
              setSearchQuery("");
            }}
            className={`px-3 py-1.5 rounded-lg font-display font-semibold text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTab === state ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {stateLabels[state] || state}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-3 font-body">
        {filteredColleges.length} college{filteredColleges.length !== 1 ? "s" : ""} — {stateLabels[activeTab] || activeTab}
        {categoryFilter !== "all" && (
          <span className="text-foreground font-display font-semibold"> · {categoryOptions.find((o) => o.id === categoryFilter)?.label}</span>
        )}
      </p>

      <div className="space-y-3">
        {filteredColleges.map((college, idx) => {
          const kind = resolveCollegeType(college);
          return (
            <div
              key={`${college.state}-${college.name}-${college.location}-${idx}`}
              className="bg-muted/50 rounded-xl p-4 border border-border"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                      <h3 className="font-display font-bold text-foreground">{college.name}</h3>
                      <span className="text-sm shrink-0">{college.rating}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-lg text-xs font-display font-semibold border border-border bg-background text-foreground">
                      <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                      {college.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-display font-semibold border ${feesBadgeClass(college.fees)}`}>
                    <IndianRupee className="w-3 h-3 shrink-0" />
                    {college.fees}
                  </span>
                  <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-display font-semibold border ${typeBadgeClass[kind]}`}>
                    {typeLabel[kind]}
                  </span>
                  {college.courseDuration && (
                    <span className="inline-flex px-2 py-1 rounded-lg text-xs font-body border border-border bg-card text-muted-foreground">
                      {college.courseDuration}
                    </span>
                  )}
                  {college.admissionType && (
                    <span className="inline-flex px-2 py-1 rounded-lg text-xs font-display font-semibold border border-primary/30 bg-primary/5 text-foreground">
                      Admission: {admissionLabel[college.admissionType]}
                    </span>
                  )}
                </div>

                {college.cutoff && (
                  <p className="text-xs text-accent font-semibold flex items-center gap-1 font-body">
                    <Scissors className="w-3 h-3 shrink-0" /> Cutoff: {college.cutoff}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {filteredColleges.length === 0 && (
          <p className="text-muted-foreground text-center py-4 font-body">
            {searchQuery || categoryFilter !== "all"
              ? "Koi match nahi mila — filter ya search badal ke dekhein"
              : "Is state mein abhi colleges add nahi hue"}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground font-body mt-5 pt-4 border-t border-border leading-relaxed">
        💡 Tip: Government colleges mein fees kam hoti hai. State-wise scholarship bhi milti hai — Scholarships section zaroor dekho!
      </p>
    </motion.div>
  );
};

export default ResultColleges;
