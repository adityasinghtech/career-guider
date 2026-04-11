import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  COMPARISON_CAREERS,
  getCareerById,
  type ComparisonCareer,
} from "@/data/careerComparison";
import { toast } from "sonner";
import { Share2, Check, X } from "lucide-react";

const demandClass: Record<string, string> = {
  High: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-800",
  Medium: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-800",
  Low: "bg-muted text-muted-foreground border-border",
};

function CareerCard({ career }: { career: ComparisonCareer }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-card flex flex-col h-full">
      <div className="mb-3">
        <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2 flex-wrap">
          <span className="text-2xl" aria-hidden>
            {career.emoji}
          </span>
          {career.name}
        </h2>
        <p className="text-sm font-semibold text-primary mt-1">{career.salaryRange}</p>
      </div>

      <dl className="space-y-3 text-sm font-body flex-1">
        <div>
          <dt className="text-muted-foreground text-xs font-display font-semibold uppercase tracking-wide">
            Stream / Education
          </dt>
          <dd className="text-foreground mt-0.5">{career.education}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-display font-semibold uppercase tracking-wide">
            Top entrance exams
          </dt>
          <dd className="text-foreground mt-0.5">{career.entranceExams.join(" · ")}</dd>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs font-display font-semibold uppercase tracking-wide">
            Job demand
          </span>
          <span
            className={`text-xs font-display font-bold px-2 py-0.5 rounded-full border ${demandClass[career.demand]}`}
          >
            {career.demand}
          </span>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs font-display font-semibold uppercase tracking-wide">
            Time to career
          </dt>
          <dd className="text-foreground mt-0.5">{career.yearsToCareer}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-display font-semibold text-sm mb-1">
            <Check className="w-4 h-4" /> Pros
          </dt>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {career.pros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-rose-700 dark:text-rose-400 font-display font-semibold text-sm mb-1">
            <X className="w-4 h-4" /> Cons
          </dt>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {career.cons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </dl>
    </div>
  );
}

const CareerComparison = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [slot1, setSlot1] = useState("doctor");
  const [slot2, setSlot2] = useState("engineer");
  const [slot3, setSlot3] = useState<string>("");

  const applyUrl = useCallback(() => {
    const raw = searchParams.get("c");
    if (!raw) return;
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
    const valid = parts
      .map((id) => getCareerById(id))
      .filter(Boolean) as ComparisonCareer[];
    if (valid.length >= 1) {
      setSlot1(valid[0].id);
      setSlot2(valid[1]?.id ?? COMPARISON_CAREERS.find((c) => c.id !== valid[0].id)?.id ?? "engineer");
      setSlot3(valid[2]?.id ?? "");
    }
  }, [searchParams]);

  useEffect(() => {
    applyUrl();
  }, [applyUrl]);

  const resolved = useMemo(() => {
    const rawIds = [slot1, slot2, slot3].filter(Boolean);
    const seen = new Set<string>();
    const ids = rawIds.filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    return ids.map((id) => getCareerById(id)).filter(Boolean) as ComparisonCareer[];
  }, [slot1, slot2, slot3]);

  const shareSummary = useCallback(() => {
    const lines = resolved.map((c) => {
      return [
        `${c.emoji} ${c.name}`,
        `Salary: ${c.salaryRange}`,
        `Education: ${c.education}`,
        `Exams: ${c.entranceExams.join(", ")}`,
        `Demand: ${c.demand} | Timeline: ${c.yearsToCareer}`,
        `Pros: ${c.pros.join(" | ")}`,
        `Cons: ${c.cons.join(" | ")}`,
      ].join("\n");
    });
    const text = [`PathFinder — Career Comparison ⚖️`, "", ...lines].join("\n\n");
    navigator.clipboard.writeText(text).then(
      () => toast.success("Comparison copy ho gayi! 📋"),
      () => toast.error("Copy nahi ho paaya"),
    );
  }, [resolved]);

  const syncUrl = (a: string, b: string, c: string) => {
    const parts = [a, b, ...(c ? [c] : [])].filter(Boolean);
    setSearchParams({ c: parts.join(",") }, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              Career Comparison ⚖️
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-1">
              2–3 careers select karke side-by-side dekho — salary, exams, demand, aur pros/cons.
            </p>
          </div>
          <button
            type="button"
            onClick={shareSummary}
            disabled={resolved.length < 2}
            className="inline-flex items-center justify-center gap-2 border-2 border-border bg-card font-display font-semibold px-5 py-2.5 rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            Share Comparison
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <label className="block">
            <span className="text-xs font-display font-semibold text-muted-foreground mb-1 block">
              Career 1
            </span>
            <select
              value={slot1}
              onChange={(e) => {
                const v = e.target.value;
                setSlot1(v);
                syncUrl(v, slot2, slot3);
              }}
              className="w-full px-3 py-2 rounded-xl border-2 border-border bg-card font-body text-foreground"
            >
              {COMPARISON_CAREERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-display font-semibold text-muted-foreground mb-1 block">
              Career 2
            </span>
            <select
              value={slot2}
              onChange={(e) => {
                const v = e.target.value;
                setSlot2(v);
                syncUrl(slot1, v, slot3);
              }}
              className="w-full px-3 py-2 rounded-xl border-2 border-border bg-card font-body text-foreground"
            >
              {COMPARISON_CAREERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-display font-semibold text-muted-foreground mb-1 block">
              Career 3 (optional)
            </span>
            <select
              value={slot3}
              onChange={(e) => {
                const v = e.target.value;
                setSlot3(v);
                syncUrl(slot1, slot2, v);
              }}
              className="w-full px-3 py-2 rounded-xl border-2 border-border bg-card font-body text-foreground"
            >
              <option value="">— None —</option>
              {COMPARISON_CAREERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          className={`grid gap-4 ${
            resolved.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2"
          } grid-cols-1`}
        >
          {resolved.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>

        {resolved.length < 2 && (
          <p className="text-center text-sm text-muted-foreground mt-6 font-body">
            Kam se kam do careers select karein compare karne ke liye.
          </p>
        )}
      </div>
    </div>
  );
};

export default CareerComparison;
