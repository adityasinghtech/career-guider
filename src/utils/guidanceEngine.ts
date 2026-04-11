export interface StudentProfile {
  stream: string; // "science" | "commerce" | "arts"
  selectedClass: string; // "Class 8" to "12th Pass"
  selectedInterest: string; // "tech" | "business" | "creative" | "sports" | "undecided"
  dreamGoal: string; // "Doctor" | "Engineer" | "IAS" etc.
  situation: string[]; // ["Padhai ke saath earning chahiye", etc.]
  confidence: number; // 0-100
  personality: string;
  scores: { science: number; commerce: number; arts: number };
}

export interface GuidanceOutput {
  primaryMessage: string;
  alertMessage?: string;
  alternatePathMessage?: string;
  studyEarningMessage?: string;
  nextActionLabel: string;
  nextActionLink: string;
  urgencyLevel: "high" | "medium" | "low";
}

const INTEREST_KEYS = ["tech", "business", "creative", "sports", "undecided"] as const;

function normalizeInterest(v: unknown): (typeof INTEREST_KEYS)[number] {
  if (typeof v === "string" && INTEREST_KEYS.includes(v as (typeof INTEREST_KEYS)[number])) {
    return v as (typeof INTEREST_KEYS)[number];
  }
  return "undecided";
}

/** Read merged quiz profile from localStorage (pathfinder_quiz_profile). */
export function profileFromLocalStorage(streamFallback: string): StudentProfile {
  try {
    const raw = localStorage.getItem("pathfinder_quiz_profile");
    const p = raw ? JSON.parse(raw) : {};
    return {
      stream: typeof p.stream === "string" ? p.stream : streamFallback,
      selectedClass: typeof p.selectedClass === "string" ? p.selectedClass : "Class 10",
      selectedInterest: normalizeInterest(p.selectedInterest),
      dreamGoal: typeof p.dreamGoal === "string" ? p.dreamGoal : "",
      situation: Array.isArray(p.situation) ? (p.situation as string[]) : [],
      confidence: typeof p.confidence === "number" ? p.confidence : 33,
      personality: typeof p.personality === "string" ? p.personality : "",
      scores:
        p.scores &&
        typeof p.scores === "object" &&
        typeof (p.scores as { science: number }).science === "number"
          ? (p.scores as StudentProfile["scores"])
          : { science: 0, commerce: 0, arts: 0 },
    };
  } catch {
    return {
      stream: streamFallback,
      selectedClass: "Class 10",
      selectedInterest: "undecided",
      dreamGoal: "",
      situation: [],
      confidence: 33,
      personality: "",
      scores: { science: 0, commerce: 0, arts: 0 },
    };
  }
}

function dreamMatches(goal: string, keywords: string[]): boolean {
  const g = goal.trim();
  if (!g || g === "Abhi decide nahi" || g === "undecided") return false;
  return keywords.some((k) => g.includes(k));
}

/** Slugs from StudentRegistrationForm + display labels for messages */
const DREAM_GOAL_LABELS: Record<string, string> = {
  doctor: "Doctor / Medical",
  engineer: "Engineer / Software Dev",
  ai_ml: "AI / Data Science",
  ca: "CA / Finance",
  mba: "MBA / Business",
  startup: "Startup / Entrepreneur",
  ias: "IAS / Government Officer",
  lawyer: "Lawyer",
  teacher: "Teacher / Professor",
  content_creator: "Content Creator / YouTuber",
  defense: "Army / Navy / Air Force",
  sports: "Professional Sports",
  designer: "Designer / Artist",
};

const SCIENCE_SLUGS = new Set(["doctor", "engineer", "ai_ml", "defense"]);
const COMMERCE_SLUGS = new Set(["ca", "mba", "startup"]);
const ARTS_SLUGS = new Set(["ias", "lawyer", "teacher", "content_creator", "designer", "sports"]);

function dreamGoalDisplay(goal: string): string {
  return DREAM_GOAL_LABELS[goal] || goal;
}

function isScienceGoal(goal: string): boolean {
  if (SCIENCE_SLUGS.has(goal)) return true;
  return dreamMatches(goal, ["Doctor", "Medical", "Engineer", "AI/ML", "Defense", "Technical"]);
}

function isCommerceGoal(goal: string): boolean {
  if (COMMERCE_SLUGS.has(goal)) return true;
  return dreamMatches(goal, ["CA", "MBA", "Business", "Finance"]);
}

function isArtsGoal(goal: string): boolean {
  if (ARTS_SLUGS.has(goal)) return true;
  return dreamMatches(goal, ["IAS", "Lawyer", "Teacher", "Journalist", "Designer", "Government Officer"]);
}

function hasSituation(situation: string[], variants: string[]): boolean {
  return situation.some((s) => variants.includes(s));
}

export function generateGuidance(profile: StudentProfile): GuidanceOutput {
  const { stream, selectedClass, selectedInterest, dreamGoal, situation } = profile;

  const output: GuidanceOutput = {
    primaryMessage: "",
    nextActionLabel: "Apna result dekhein",
    nextActionLink: "#",
    urgencyLevel: "medium",
  };

  const goalActive = !!dreamGoal && dreamGoal !== "Abhi decide nahi" && dreamGoal !== "undecided";

  const goalMismatch =
    goalActive &&
    ((stream === "science" && (isCommerceGoal(dreamGoal) || isArtsGoal(dreamGoal))) ||
      (stream === "commerce" && (isScienceGoal(dreamGoal) || isArtsGoal(dreamGoal))) ||
      (stream === "arts" && (isScienceGoal(dreamGoal) || isCommerceGoal(dreamGoal))));

  const dreamLabel = dreamGoalDisplay(dreamGoal);

  if (goalMismatch && goalActive) {
    output.alertMessage = `⚠️ Tumhara quiz result ${stream} stream suggest karta hai, lekin tumhara dream goal ${dreamLabel} hai. Ye possible hai! Bridge path available hai — neeche "Alternate Path" section dekho.`;

    if (stream === "arts" && isScienceGoal(dreamGoal)) {
      output.alternatePathMessage = `${dreamLabel} ke liye officially Science stream chahiye. Options: (1) Class 10 mein PCM/PCB le lo — abhi bhi time hai. (2) Agar 11th/12th mein hain → lateral path ya open schooling se Science possible hai. (3) Defense ke liye Arts bhi valid hai — NDA/CDS exam dono ke liye open hai!`;
    }

    if (
      stream === "commerce" &&
      (dreamGoal === "engineer" || dreamGoal === "ai_ml" || dreamGoal === "doctor" || dreamMatches(dreamGoal, ["Engineer", "Tech", "Medical", "Doctor"]))
    ) {
      output.alternatePathMessage = `Engineering ke liye PCM chahiye. Agar abhi Class 10 mein hain → Class 11 mein Science (PCM) lo. Agar 11th Commerce mein hain → Lateral Entry (Diploma ke baad B.Tech possible hai). Alternative: BCA/MCA → IT industry mein entry possible hai Commerce se bhi!`;
    }
  }

  const needsEarning =
    hasSituation(situation, [
      "💰 Padhai ke saath earning chahiye",
      "Padhai ke saath earning chahiye",
    ]) ||
    hasSituation(situation, ["💸 Financial constraints hain", "Financial constraints hain"]);
  if (needsEarning) {
    output.studyEarningMessage = `💰 Tum padhai ke saath earning kar sakte ho!
    ${
      stream === "science"
        ? "Science students ke liye: Maths/Science tutoring (₹5-15K/month), coding freelancing, science YouTube channel"
        : stream === "commerce"
          ? "Commerce students ke liye: Tally work, data entry, social media management, CA article ship (stipend milta hai)"
          : "Arts students ke liye: Content writing, blog writing, teaching assistant, UPSC notes selling"
    }
    Neeche "Padhai ke Saath Kamaai" section mein details hain! 👇`;
  }

  if (
    hasSituation(situation, ["📉 Maths mein thoda weak hoon", "Weak in Maths"])
  ) {
    if (stream === "science") {
      const extra =
        "\n📚 Maths mein weakness hai aur Science stream hai — important! JEE/NEET ke liye Maths/Physics strong karna padega. Suggested: Physics Wallah free lectures + daily 1 hour Maths practice. Alternative agar Maths bahut weak hai: PCB (Biology group) lo, Medical line mein Maths less important hai.";
      output.alertMessage = (output.alertMessage || "") + extra;
    }
  }

  if (
    hasSituation(situation, [
      "👨‍👩‍👦 Family ne stream decide ki hai",
      "Family ne stream already decide ki",
    ])
  ) {
    output.alertMessage =
      (output.alertMessage || "") +
      `\n👨‍👩‍👦 Family ne stream decide ki hai — samajhte hain! Lekin apne interest ke baare mein bhi sochna zaroori hai. Agar tumhara quiz aur family ka choice match nahi karta → ek baar counselor ya mentor se baat karo. PathFinder AI chatbot se bhi guidance le sakte ho! 💬`;
  }

  const classMessages: Record<string, string> = {
    "Class 8": "Tum abhi explore stage mein ho — yeh sabse best time hai!",
    "Class 9": "Class 9 mein ho — thoda aur time hai stream choose karne ka.",
    "Class 10": "Class 10 — STREAM DECIDE KARNE KA CRITICAL TIME! 🎯",
    "Class 11": "Class 11 — stream decide ho gayi, ab career direction clear karo.",
    "Class 12": "Class 12 — boards + entrance exams DONO pe focus karo!",
    "12th Pass": "12th Pass — ADMISSION SEASON! Abhi action lene ka time hai. ⚡",
  };

  const streamMessages: Record<string, Record<string, string>> = {
    science: {
      tech: "PCM + coding skills → Software Engineer/AI Engineer banne ka perfect path!",
      business: "PCM + business sense → Tech startup founder ya engineering manager!",
      creative: "Science + creativity → UX Engineer, Tech Designer, ya Science journalist!",
      sports: "Science + sports → Sports Science, Physiotherapy, ya Sports Tech!",
      undecided: "Science stream se Engineering, Medical, Research — sab open hai. Explore karo!",
    },
    commerce: {
      tech: "Commerce + tech → FinTech, Digital Marketing, E-commerce — booming field!",
      business: "Commerce + business mind → CA, MBA, Startup Founder — ideal combination!",
      creative: "Commerce + creativity → Brand Management, Advertising, Event Management!",
      sports: "Commerce + sports → Sports Management, Agent, Sports Marketing!",
      undecided: "Commerce se CA, MBA, Banking, Finance — stable + high-paying careers!",
    },
    arts: {
      tech: "Arts + tech interest → UX/UI Design, Journalism Tech, Digital Policy!",
      business: "Arts + business → Law (LLB), HR Management, NGO Leadership!",
      creative: "Arts + creativity → perfect match! Design, Film, Writing, Content!",
      sports: "Arts + sports → Sports Journalism, Sports Law, Sports Psychology!",
      undecided: "Arts se UPSC, Law, Design, Journalism — sab powerful careers hain!",
    },
  };

  const classMsg = classMessages[selectedClass] || "Apna career path explore karo!";
  const streamMsg =
    streamMessages[stream]?.[selectedInterest] || `${stream} stream mein bahut scope hai!`;

  output.primaryMessage = `${classMsg}\n\n${streamMsg}`;

  if (selectedClass === "12th Pass" || selectedClass === "Class 12") {
    output.urgencyLevel = "high";
    output.nextActionLabel = "Application deadlines check karo";
    output.nextActionLink = `/results/${stream}`;
  } else if (selectedClass === "Class 10") {
    output.urgencyLevel = "high";
    output.nextActionLabel = "Stream guide dekhein";
    output.nextActionLink = `/results/${stream}`;
  }

  return output;
}
