import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { QuizProfile } from "@/data/quizData";
import { CalendarClock, Route } from "lucide-react";

type StreamKey = "science" | "commerce" | "arts";

function normalizeStream(s: string | null | undefined): StreamKey {
  if (!s) return "science";
  const x = s.toLowerCase();
  if (x === "commerce") return "commerce";
  if (x === "arts") return "arts";
  return "science";
}

function shortTermContent(selectedClass?: string): { heading: string; bullets: string[] } {
  if (selectedClass === "Class 8" || selectedClass === "Class 9") {
    return {
      heading: "Short term — pehle steps",
      bullets: [
        "Different activities try karo, hobbies seriously lo",
        "School clubs, science/math events, reading — explore karo",
        "Strong basics: Maths + English daily practice",
      ],
    };
  }
  if (selectedClass === "Class 10") {
    return {
      heading: "Short term — stream decide karna hai",
      bullets: [
        "Subjects carefully choose karo, coaching options dekho",
        "Apne marks aur interest ke hisaab se PCM/Commerce/Arts research karo",
        "Seniors/teachers se stream ke pros-cons poochho",
      ],
    };
  }
  if (selectedClass === "Class 11" || selectedClass === "Class 12") {
    return {
      heading: "Short term — board + entrance balance",
      bullets: [
        "Board exams pe focus karo, entrance exam syllabus dekho",
        "Weekly mock tests / PYQs routine banao",
        "Weak topics ke liye extra revision slots",
      ],
    };
  }
  if (selectedClass === "12th Pass") {
    return {
      heading: "Short term — ab apply karna hai",
      bullets: [
        "CUET/JEE/NEET/CLAT application forms bharo abhi",
        "Deadlines calendar mein mark karo, documents ready rakho",
        "Counselling updates + backup college list",
      ],
    };
  }
  return {
    heading: "Short term — start here",
    bullets: [
      "Apni class aur goals ke hisaab se routine set karo",
      "Coaching/online resources compare karo",
      "Har week thoda entrance syllabus touch karo",
    ],
  };
}

function midTermContent(stream: StreamKey): { heading: string; bullets: string[] } {
  if (stream === "science") {
    return {
      heading: "Mid term — depth aur practice",
      bullets: [
        "JEE/NEET mock tests shuru karo, coaching ya online classes join karo",
        "NCERT + reference books parallel padho",
        "Test analysis: har mistake se seekho",
      ],
    };
  }
  if (stream === "commerce") {
    return {
      heading: "Mid term — professional foundation",
      bullets: [
        "CA Foundation ya BBA entrance prep shuru karo",
        "Accounts + Economics concepts hands-on (Tally/Excel)",
        "Internship ya virtual case competitions try karo",
      ],
    };
  }
  return {
    heading: "Mid term — skills + exams",
    bullets: [
      "CLAT/UPSC syllabus start karo, current affairs daily",
      "Essay/debate practice weekly",
      "Optional: online courses (law, civils, design basics)",
    ],
  };
}

function longTermContent(stream: StreamKey, interest: string): { heading: string; bullets: string[] } {
  if (stream === "science" && interest === "tech") {
    return {
      heading: "Long term — tech career track",
      bullets: [
        "IIT/NIT tier colleges mein admission target karo",
        "Internships (2nd year se) — product/SDE roles",
        "Placements: DSA, projects, GitHub portfolio strong rakho",
      ],
    };
  }
  if (stream === "commerce" && interest === "business") {
    return {
      heading: "Long term — business & finance",
      bullets: [
        "IIM/CA/CS qualification roadmap follow karo",
        "Business network: LinkedIn, events, mentors",
        "Side projects: freelancing, small ventures, case comps",
      ],
    };
  }
  if (stream === "arts" && interest === "creative") {
    return {
      heading: "Long term — creative careers",
      bullets: [
        "NLU/JNU/NID/IIMC admission — entrance + portfolio",
        "Portfolio: writing, design, videos, internships",
        "Freelance + personal brand gradually build karo",
      ],
    };
  }
  if (stream === "science") {
    return {
      heading: "Long term — science track",
      bullets: [
        "Top colleges (IIT/AIIMS/state) mein admission goal",
        "Research/internships — labs, summer projects",
        "GATE/NEET PG ya placements — field ke hisaab se",
      ],
    };
  }
  if (stream === "commerce") {
    return {
      heading: "Long term — commerce track",
      bullets: [
        "CA/MBA/Banking — ek clear credential pe focus",
        "Corporate internships + certifications",
        "Financial literacy + networking long-term asset hai",
      ],
    };
  }
  return {
    heading: "Long term — arts & beyond",
    bullets: [
      "UPSC/law/media/design — ek direction mein depth",
      "Public speaking + writing portfolio",
      "Meaningful internships aur fellowships apply karo",
    ],
  };
}

const cardStyles = {
  short: "border-emerald-300/80 bg-gradient-to-br from-emerald-50/95 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/25 dark:border-emerald-800/60",
  mid: "border-blue-300/80 bg-gradient-to-br from-blue-50/95 to-sky-50/80 dark:from-blue-950/40 dark:to-sky-950/25 dark:border-blue-800/60",
  long: "border-purple-300/80 bg-gradient-to-br from-purple-50/95 to-violet-50/80 dark:from-purple-950/40 dark:to-violet-950/25 dark:border-purple-800/60",
};

const badgeStyles = {
  short: "bg-emerald-600/90 text-white dark:bg-emerald-600",
  mid: "bg-blue-600/90 text-white dark:bg-blue-600",
  long: "bg-purple-600/90 text-white dark:bg-purple-600",
};

interface ResultNextStepsProps {
  /** When quiz profile has no stream, use URL stream */
  fallbackStream?: string;
}

const ResultNextSteps = ({ fallbackStream = "science" }: ResultNextStepsProps) => {
  const navigate = useNavigate();
  const quizProfile = useMemo<QuizProfile | null>(() => {
    try {
      const raw = localStorage.getItem("pathfinder_quiz_profile");
      return raw ? (JSON.parse(raw) as QuizProfile) : null;
    } catch {
      return null;
    }
  }, []);

  const stream = normalizeStream(quizProfile?.stream || fallbackStream);
  const selectedClass = quizProfile?.selectedClass;
  const interest = quizProfile?.selectedInterest || "";

  const sections = useMemo(() => {
    const s = shortTermContent(selectedClass);
    const m = midTermContent(stream);
    const l = longTermContent(stream, interest);
    return [
      {
        key: "short",
        timeBadge: "0–6 months",
        title: "SHORT TERM",
        ...s,
        style: cardStyles.short,
        badge: badgeStyles.short,
      },
      {
        key: "mid",
        timeBadge: "6 months – 2 years",
        title: "MID TERM",
        ...m,
        style: cardStyles.mid,
        badge: badgeStyles.mid,
      },
      {
        key: "long",
        timeBadge: "2–5 years",
        title: "LONG TERM",
        ...l,
        style: cardStyles.long,
        badge: badgeStyles.long,
      },
    ];
  }, [selectedClass, stream, interest]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-card rounded-2xl border-2 border-border p-6 md:p-8 shadow-card"
      aria-labelledby="next-steps-heading"
    >
      <div className="flex items-center gap-2 mb-6">
        <Route className="w-6 h-6 text-primary shrink-0" />
        <h2 id="next-steps-heading" className="font-display font-bold text-xl text-foreground">
          What To Do Next
        </h2>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-8">
        Tumhari class, stream aur interest ke hisaab se short / mid / long term focus — timeline follow karo! <span aria-hidden="true">📌</span>
      </p>

      <div className="relative pl-1 sm:pl-0">
        <div className="absolute left-3 sm:left-4 top-4 bottom-4 w-0.5 bg-border/80" aria-hidden />

        <motion.ul className="space-y-6 relative" variants={container} initial="hidden" animate="show">
          {sections.map((sec) => (
            <motion.li key={sec.key} variants={item} className="relative flex gap-3 sm:gap-4">
              <div
                className={`relative z-10 mt-5 h-3 w-3 shrink-0 rounded-full border-2 border-background ring-2 ${
                  sec.key === "short"
                    ? "bg-emerald-500 ring-emerald-400/40"
                    : sec.key === "mid"
                      ? "bg-blue-500 ring-blue-400/40"
                      : "bg-purple-500 ring-purple-400/40"
                }`}
                aria-hidden
              />
              <div className={`min-w-0 flex-1 rounded-2xl border-2 p-4 md:p-5 ${sec.style} shadow-sm`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wide px-2.5 py-1 rounded-full w-fit ${sec.badge}`}
                  >
                    <CalendarClock className="w-3.5 h-3.5 opacity-90" />
                    {sec.timeBadge}
                  </span>
                  <span className="font-display font-bold text-sm text-foreground/90">{sec.title}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-3 text-base">{sec.heading}</h3>
                <ul className="space-y-2 font-body text-sm text-muted-foreground">
                  {sec.bullets.slice(0, 3).map((b, idx) => (
                    <li key={`${sec.key}-${idx}`} className="flex gap-2">
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
      <button
        onClick={() => navigate("/after-12th")}
        className="w-full mt-4 px-4 py-3 rounded-xl border-2 border-border bg-card font-display font-semibold text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all text-center"
      >
        <span aria-hidden="true">📅</span> 12th ke baad complete guide →
      </button>
    </motion.section>
  );
};

export default ResultNextSteps;
