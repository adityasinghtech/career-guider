export interface StudentProfile {
  stream: string;
  selectedClass: string;
  selectedInterest: string;
  dreamGoal: string;
  situation: string[];
  confidence: number;
  personality: string;
  scores: { science: number; commerce: number; arts: number };
  mentorNotes?: string[];
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

export interface CareerMatch {
  career: string;
  matchPercent: number;
  stream: string;
  salaryRange: string;
  keySkill: string;
  icon: string;
}

export function profileFromLocalStorage(): StudentProfile | null {
  try {
    const raw = localStorage.getItem("pathfinder_quiz_profile");
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function calculateCareerMatches(profile: StudentProfile): CareerMatch[] {
  const total = (profile.scores.science + profile.scores.commerce + profile.scores.arts) || 1;
  const sci = profile.scores.science / total;
  const com = profile.scores.commerce / total;
  const art = profile.scores.arts / total;
  const interest = profile.selectedInterest || "";

  const interestBoost = (forInterests: string[]) =>
    forInterests.includes(interest) ? 0.12 : 0;

  const careers: CareerMatch[] = [
    {
      career: "Software Engineer",
      matchPercent: Math.round((sci * 0.65 + com * 0.2 + art * 0.05 + interestBoost(["tech"])) * 100),
      stream: "science", salaryRange: "6–30 LPA", keySkill: "Coding + Maths", icon: "💻"
    },
    {
      career: "Doctor / MBBS",
      matchPercent: Math.round((sci * 0.80 + art * 0.1 + com * 0.05 + interestBoost(["science"])) * 100),
      stream: "science", salaryRange: "8–40 LPA", keySkill: "Biology + Dedication", icon: "🩺"
    },
    {
      career: "CA / Finance",
      matchPercent: Math.round((com * 0.78 + sci * 0.12 + art * 0.05 + interestBoost(["business"])) * 100),
      stream: "commerce", salaryRange: "8–35 LPA", keySkill: "Accounts + Maths", icon: "📊"
    },
    {
      career: "IAS Officer",
      matchPercent: Math.round((art * 0.72 + com * 0.18 + sci * 0.05 + interestBoost(["social"])) * 100),
      stream: "arts", salaryRange: "8–15 LPA + perks", keySkill: "GK + Writing", icon: "🏛️"
    },
    {
      career: "MBA Manager",
      matchPercent: Math.round((com * 0.70 + sci * 0.18 + art * 0.08 + interestBoost(["business"])) * 100),
      stream: "commerce", salaryRange: "8–50 LPA", keySkill: "Leadership + Analytics", icon: "🏢"
    },
    {
      career: "Designer / Artist",
      matchPercent: Math.round((art * 0.80 + sci * 0.08 + com * 0.08 + interestBoost(["creative"])) * 100),
      stream: "arts", salaryRange: "4–25 LPA", keySkill: "Creativity + Aesthetics", icon: "🎨"
    },
    {
      career: "Data Scientist",
      matchPercent: Math.round((sci * 0.62 + com * 0.22 + art * 0.08 + interestBoost(["tech"])) * 100),
      stream: "science", salaryRange: "8–45 LPA", keySkill: "Maths + Python", icon: "🤖"
    },
    {
      career: "Lawyer",
      matchPercent: Math.round((art * 0.74 + com * 0.14 + sci * 0.08 + interestBoost(["social"])) * 100),
      stream: "arts", salaryRange: "5–35 LPA", keySkill: "Reasoning + Communication", icon: "⚖️"
    },
    {
      career: "Sports Professional",
      matchPercent: Math.round((interestBoost(["sports"]) * 5 + art * 0.3 + sci * 0.2 + com * 0.2) * 100),
      stream: "any", salaryRange: "Variable + Government job", keySkill: "Physical + Mental", icon: "🏏"
    },
    {
      career: "Content Creator",
      matchPercent: Math.round((art * 0.60 + com * 0.20 + sci * 0.10 + interestBoost(["creative"])) * 100),
      stream: "any", salaryRange: "2–50 LPA (variable)", keySkill: "Creativity + Consistency", icon: "🎬"
    },
  ];

  // Boost dream goal match by 18%
  if (profile.dreamGoal && profile.dreamGoal !== "undecided") {
    careers.forEach(c => {
      if (c.career.toLowerCase().includes(profile.dreamGoal.toLowerCase()) ||
          profile.dreamGoal.toLowerCase().includes(c.career.toLowerCase().split(" ")[0].toLowerCase())) {
        c.matchPercent = Math.min(99, c.matchPercent + 18);
      }
    });
  }

  return careers
    .map(c => ({ ...c, matchPercent: Math.min(99, Math.max(10, c.matchPercent)) }))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5);
}

export function generateGuidance(profile: StudentProfile): GuidanceOutput {
  const { stream, selectedClass, selectedInterest, dreamGoal, situation, mentorNotes } = profile;

  const output: GuidanceOutput = {
    primaryMessage: "",
    nextActionLabel: "Apna result dekhein",
    nextActionLink: "#",
    urgencyLevel: "medium",
  };

  // MISMATCH DETECTION
  const sciGoals = ["doctor", "engineer", "ai_ml", "defense", "Doctor", "Engineer"];

  const goalMismatch = dreamGoal && dreamGoal !== "undecided" && (
    (stream === "arts" && sciGoals.some(g => dreamGoal.toLowerCase().includes(g.toLowerCase()))) ||
    (stream === "commerce" && sciGoals.some(g => dreamGoal.toLowerCase().includes(g.toLowerCase())))
  );

  if (goalMismatch) {
    output.alertMessage = `Tumhara quiz result ${stream} stream suggest karta hai, lekin tumhara dream goal ${dreamGoal} hai. Ghabrao nahi — bridge paths available hain! Neeche dekho.`;

    if (stream === "arts") {
      output.alternatePathMessage = `Engineering/Medical ke liye officially Science chahiye. Options:\n(1) Agar Class 10 mein ho → Class 11 mein PCM/PCB lo — abhi bilkul time hai\n(2) Agar 11th-12th Arts mein ho → Open Schooling (NIOS) se Science subjects add kar sakte ho\n(3) Defense ke liye → NDA/CDS exam DONO streams ke liye open hai\n(4) BCA/MCA route → IT industry mein Arts se bhi entry possible hai`;
    } else if (stream === "commerce") {
      output.alternatePathMessage = `Engineering ke liye PCM chahiye. Options:\n(1) Class 10 mein ho → Class 11 mein Science (PCM) lo\n(2) 11th Commerce mein ho → Diploma → Lateral Entry B.Tech (valid path)\n(3) BCA → MCA → Software Engineer (Commerce se bhi IT mein jaana possible)\n(4) FinTech/Data Analytics → Commerce + tech skills → High salary`;
    }
  }

  // EARNING SITUATION
  const needsEarning = situation?.some(s =>
    s.includes("earning") || s.includes("Financial")
  );
  if (needsEarning) {
    const earningMap: Record<string, string> = {
      science: "Maths/Science tutoring (₹5–15K/month) • Coding freelancing on Fiverr • Science YouTube channel",
      commerce: "Tally data entry work • Social media management • CA articleship (stipend milta hai) • Stock market intern",
      arts: "Content writing (₹3–10K per article) • UPSC notes selling • Teaching assistant • Blog monetization",
    };
    output.studyEarningMessage = `Padhai ke saath earning possible hai:\n${earningMap[stream] || "Freelancing, tutoring, ya skill-based part-time work explore karo"}\n\nGovernment help: NSP Scholarship (scholarships.gov.in) • PM Scholarship • State government schemes zaroor check karo.`;
  }

  // MATHS WEAK
  if (situation?.some((s) => s.includes("Maths mein thoda weak hoon")) && stream === "science") {
    output.alertMessage = (output.alertMessage || "") +
      `\nMaths weakness + Science stream — important note:\nJEE ke liye Maths strong karna hoga. Lekin NEET (Biology group) mein Maths kam important hai — consider PCB instead of PCM.`;
  }

  const studyStruggle =
    situation?.some((s) => s.includes("Padhai boring") || s.includes("focus nahi")) ||
    (mentorNotes || []).join(" ").match(/padhai|study|boring|man nahi|focus|nahi pasand/i);

  if (studyStruggle) {
    output.alertMessage = (output.alertMessage || "") +
      `\nPadhai/focus tough lag raha hai — yeh common hai, aur iska matlab yeh nahi ki tum "weak" ho. Chhote goals (25-minute study blocks), interesting YouTube teachers, aur ek sport/hobby routine se brain fresh rehta hai. Agar possible ho toh school counselor se ek baar baat zaroor karo — early help best help hoti hai.`;
  }

  // FAMILY PRESSURE
  if (situation?.some((s) => s.includes("Family ne stream decide ki"))) {
    output.alertMessage = (output.alertMessage || "") +
      `\nFamily ne stream decide ki hai — unki baat samajh aati hai. Lekin agar tumhara quiz result aur family choice different hai, ek baar counselor se baat karo. PathFinder chatbot bhi available hai! 💬`;
  }

  // PRIMARY MESSAGE
  const classMsgs: Record<string, string> = {
    "Class 8": "Tum explore stage mein ho — best time hai apne interests dhundhne ka! Koi pressure nahi.",
    "Class 9": "Class 9 — Stream choose karne mein 1 saal bacha hai. Soch-samajhkar explore karo.",
    "Class 10": "CLASS 10 — STREAM DECIDE KARNE KA SABSE IMPORTANT TIME! Yeh decision thoughtfully lo.",
    "Class 11": "Class 11 — stream toh decide ho gayi. Ab career direction aur exam strategy banao.",
    "Class 12": "Class 12 — Boards + Entrance exams DONO simultaneously. Bilkul focused raho.",
    "12th Pass": "12TH PASS — ADMISSION SEASON CHAL RAHA HAI! Application deadlines miss mat karo.",
    "Graduation": "Graduation ke baad — MBA vs Job vs Govt Exam vs Startup. Sahi decision time hai.",
  };

  const streamMsgs: Record<string, Record<string, string>> = {
    science: {
      tech: "PCM + coding skills = Software Engineer / AI Engineer ka perfect combination. JEE ya direct tech colleges target karo.",
      business: "PCM + business thinking = Tech startup founder ya Engineering Manager. IIT ke baad MBA bhi option hai.",
      creative: "Science + creativity = UX Engineer, Tech Designer, ya Science Journalist. Rare aur high-demand combination.",
      sports: "Science + sports interest = Sports Science, Physiotherapy, ya Sports Tech — emerging fields hain India mein.",
      undecided: "Science se Engineering, Medical, Research, Data Science — sabse zyada career options milte hain. Explore karo!",
    },
    commerce: {
      tech: "Commerce + tech = FinTech, Digital Marketing, E-commerce — India ka fastest growing sector. BBA + tech skills = gold.",
      business: "Commerce + business mind = CA / MBA / Startup Founder — ideal combination India ki economy ke liye.",
      creative: "Commerce + creativity = Brand Management, Advertising, Event Management — fun aur high-paying careers.",
      sports: "Commerce + sports = Sports Management, Player Agent, Sports Marketing — IPL ne ye careers boom karaya hai.",
      undecided: "Commerce se CA, MBA, Banking, Finance, Insurance — stable + high-paying + always in demand.",
    },
    arts: {
      tech: "Arts + tech = UX/UI Design, Digital Policy, Journalism Tech — rare combination, premium salaries.",
      business: "Arts + business = Law (LLB), HR Management, NGO Leadership — meaningful + impactful careers.",
      creative: "Arts + creativity = Perfect match! Design, Film, Writing, Content — creative economy is booming.",
      sports: "Arts + sports = Sports Journalism, Sports Law, Sports Psychology — all growing fields.",
      undecided: "Arts se UPSC (IAS/IPS), Law, Design, Journalism, Psychology — sab powerful careers hain.",
    },
  };

  const classMsg = classMsgs[selectedClass] || "Apna career path explore karo — bahut options hain!";
  const streamMsg = streamMsgs[stream]?.[selectedInterest] || `${stream} stream mein bahut scope hai!`;

  output.primaryMessage = `${classMsg}\n\n${streamMsg}`;

  const voiceNotes = (mentorNotes || []).map((n) => n.trim()).filter(Boolean);
  if (voiceNotes.length > 0) {
    const preview = voiceNotes.slice(0, 3).join(" · ");
    const short = preview.length > 220 ? `${preview.slice(0, 217)}…` : preview;
    output.primaryMessage =
      `Tumne jo apne words mein likha ("${short}"), usko dhyaan mein rakhte hue neeche guidance hai.\n\n` +
      output.primaryMessage;
  }

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
