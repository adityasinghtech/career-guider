import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Wallet } from "lucide-react";

const EARNING_OPTIONS = [
  {
    id: "tutoring",
    title: "Online Tutoring",
    salary: "₹5,000–15,000/month",
    description: "Chote bachon ko padha ke ₹5,000-15,000/month",
    skills: "Subject knowledge, patience",
    start: "UrbanPro, Superprof, local Facebook groups",
  },
  {
    id: "freelancing",
    title: "Freelancing",
    salary: "₹10,000–50,000/month",
    description: "Writing, design, coding projects ₹10,000-50,000/month",
    skills: "One marketable skill",
    start: "Fiverr, Upwork, LinkedIn",
  },
  {
    id: "content",
    title: "Content Writing",
    salary: "₹8,000–25,000/month",
    description: "Blogs, articles, social media ₹8,000-25,000/month",
    skills: "Good English/Hindi writing",
    start: "Internshala, LinkedIn, direct outreach",
  },
  {
    id: "video",
    title: "Video Editing",
    salary: "₹10,000–40,000/month",
    description: "YouTube, reels, corporate ₹10,000-40,000/month",
    skills: "CapCut, Premiere Pro basics",
    start: "Instagram portfolio, local businesses",
  },
  {
    id: "social",
    title: "Social Media Management",
    salary: "₹8,000–20,000/month",
    description: "Manage business pages ₹8,000-20,000/month",
    skills: "Canva, basic marketing",
    start: "Approach local shops, small businesses",
  },
  {
    id: "intern",
    title: "Part-time Internship",
    salary: "₹5,000–15,000/month",
    description: "Real experience + ₹5,000-15,000/month stipend",
    skills: "Domain knowledge",
    start: "Internshala, LinkedIn, college placement cell",
  },
] as const;

const ResultEarningPaths = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border-2 border-border bg-card shadow-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-muted/40 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-display font-bold text-foreground block">
              Padhai ke Saath Earning Dekhein 💰
            </span>
            <span className="text-xs text-muted-foreground font-body">
              Study ke saath earning — expand karke dekho
            </span>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4 md:p-6 pt-2 md:pt-4 space-y-6">
              <div>
                <h2 className="font-display font-bold text-lg md:text-xl text-foreground">
                  Padhai ke Saath Kamaai 💰
                </h2>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  Agar financial support chahiye — ye realistic options hain
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EARNING_OPTIONS.map((opt, i) => (
                  <motion.div
                    key={opt.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="rounded-2xl border-2 border-border bg-card p-4 flex flex-col gap-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-foreground text-base">{opt.title}</h3>
                      <span className="text-xs font-display font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100 border border-emerald-300/60 dark:border-emerald-800/50 shrink-0">
                        {opt.salary}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-body leading-snug">{opt.description}</p>
                    <p className="text-xs text-foreground/80 font-body">
                      <span className="font-display font-semibold text-muted-foreground">Skills needed: </span>
                      {opt.skills}
                    </p>
                    <p className="text-sm text-muted-foreground font-body mt-auto pt-1 border-t border-border/80">
                      <span className="font-display font-semibold text-foreground/80">Kaise shuru karein: </span>
                      {opt.start}
                    </p>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground font-body text-center leading-relaxed border-t border-border pt-4">
                Note: Income varies based on skill level aur time investment. Starting mein time lagta hai.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultEarningPaths;

