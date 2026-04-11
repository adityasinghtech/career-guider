export type MarketDemand = "High" | "Medium" | "Low";

export interface ComparisonCareer {
  id: string;
  name: string;
  emoji: string;
  salaryRange: string;
  education: string;
  entranceExams: string[];
  demand: MarketDemand;
  yearsToCareer: string;
  pros: [string, string, string];
  cons: [string, string];
}

export const COMPARISON_CAREERS: ComparisonCareer[] = [
  {
    id: "doctor",
    name: "Doctor",
    emoji: "🩺",
    salaryRange: "₹8–40+ LPA (experience & specialty)",
    education: "Science PCB → MBBS → MD/MS/DNB",
    entranceExams: ["NEET-UG", "NEET-PG / INI-CET", "FMGE (if applicable)"],
    demand: "High",
    yearsToCareer: "10–12+ years (UG + PG + residency)",
    pros: [
      "Stable, respected profession with high social impact",
      "Clear progression: MBBS → specialization",
      "Diverse paths: clinical, research, public health",
    ],
    cons: ["Long, intense training period", "Irregular hours during residency"],
  },
  {
    id: "engineer",
    name: "Engineer",
    emoji: "⚙️",
    salaryRange: "₹5–30+ LPA (role & company)",
    education: "Science PCM → B.Tech/B.E. (or diploma route)",
    entranceExams: ["JEE Main/Advanced", "State engineering CETs", "BITSAT"],
    demand: "High",
    yearsToCareer: "4 years (B.Tech) + optional M.Tech",
    pros: [
      "Huge variety: software, core, civil, etc.",
      "Strong campus placement at good colleges",
      "Global mobility for tech roles",
    ],
    cons: ["Entrance competition is intense", "Need continuous upskilling in tech"],
  },
  {
    id: "ca",
    name: "Chartered Accountant (CA)",
    emoji: "📊",
    salaryRange: "₹7–25+ LPA",
    education: "Commerce → CA (ICAI) + articleship",
    entranceExams: ["CA Foundation", "CA Intermediate", "CA Final"],
    demand: "High",
    yearsToCareer: "4.5–5 years typical (including articleship)",
    pros: [
      "Gold-standard credential in accounting & audit",
      "Work across industry, practice, or consulting",
      "Strong long-term earning potential",
    ],
    cons: ["Multi-level exams with low pass rates", "Articleship can be demanding"],
  },
  {
    id: "mba",
    name: "MBA / Management",
    emoji: "💼",
    salaryRange: "₹8–40+ LPA (institute & role)",
    education: "Any UG → MBA (PGDM/B-school)",
    entranceExams: ["CAT", "XAT", "SNAP", "GMAT (global)"],
    demand: "High",
    yearsToCareer: "3–6 years (UG + 2-year MBA typical)",
    pros: [
      "Opens leadership, consulting, product, marketing roles",
      "Strong alumni networks at top schools",
      "Cross-domain pivot possible after UG",
    ],
    cons: ["Top B-schools are highly competitive", "Cost can be significant"],
  },
  {
    id: "ias",
    name: "IAS / Civil Services",
    emoji: "🏛️",
    salaryRange: "₹8–15 LPA + allowances (scales rise with seniority)",
    education: "Any UG → UPSC CSE",
    entranceExams: ["UPSC CSE (Prelims, Mains, Interview)"],
    demand: "Medium",
    yearsToCareer: "UG + 1–3+ years prep (varies)",
    pros: [
      "Policy impact and diverse postings",
      "Job security and structured career ladder",
      "Prestige and responsibility at scale",
    ],
    cons: ["Extremely competitive single exam", "Long preparation cycles for many"],
  },
  {
    id: "lawyer",
    name: "Lawyer",
    emoji: "⚖️",
    salaryRange: "₹5–35+ LPA",
    education: "UG Law (BA LLB/BBA LLB) or LLB after UG",
    entranceExams: ["CLAT", "AILET", "LSAT / university tests"],
    demand: "High",
    yearsToCareer: "5 years (integrated) or 3 years LLB after UG",
    pros: [
      "Corporate law, litigation, policy — many tracks",
      "Strong verbal & analytical skill payoff",
      "Independent practice option later",
    ],
    cons: ["Initial years can be grueling in litigation", "Long hours in some firms"],
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    emoji: "📈",
    salaryRange: "₹8–35+ LPA",
    education: "STEM UG/PG → stats/ML focus",
    entranceExams: ["GATE (higher studies)", "Company-specific tests / portfolios"],
    demand: "High",
    yearsToCareer: "4–6 years (UG + often PG or strong projects)",
    pros: [
      "High demand across industries",
      "Mix of coding, math, and business impact",
      "Remote-friendly roles increasing",
    ],
    cons: ["Rapidly changing tools — must keep learning", "Math/stats foundation is essential"],
  },
  {
    id: "content-creator",
    name: "Content Creator",
    emoji: "🎬",
    salaryRange: "₹2–50+ LPA (highly variable)",
    education: "No fixed path — arts/media/business/any + skills",
    entranceExams: ["N/A — portfolio & audience matter most"],
    demand: "Medium",
    yearsToCareer: "1–4 years to sustainable income (varies)",
    pros: [
      "Creative freedom and personal brand",
      "Multiple revenue streams possible",
      "Can start early with low capital",
    ],
    cons: ["Income instability early on", "Algorithm and platform dependence"],
  },
  {
    id: "game-developer",
    name: "Game Developer",
    emoji: "🎮",
    salaryRange: "₹6–25+ LPA",
    education: "CS/Game dev courses / diplomas + portfolio",
    entranceExams: ["JEE for degree route; otherwise portfolio & tests"],
    demand: "Medium",
    yearsToCareer: "3–5 years (degree + projects)",
    pros: [
      "Growing industry in India & globally",
      "Blend of art, code, and design",
      "Indie and studio paths both exist",
    ],
    cons: ["Crunch culture in some studios", "Niche hiring vs generic IT"],
  },
  {
    id: "startup-founder",
    name: "Startup Founder",
    emoji: "🚀",
    salaryRange: "Unlimited (equity; often low cash early)",
    education: "Any; business/tech helps",
    entranceExams: ["N/A — execution & traction"],
    demand: "High",
    yearsToCareer: "5–10+ years to stable exit or scale (typical range)",
    pros: [
      "Ownership and upside on success",
      "Learn sales, product, ops end-to-end",
      "Solve real problems you care about",
    ],
    cons: ["High failure risk", "Stress and uncertain income early"],
  },
];

const byId = Object.fromEntries(COMPARISON_CAREERS.map((c) => [c.id, c])) as Record<
  string,
  ComparisonCareer
>;

export function getCareerById(id: string): ComparisonCareer | undefined {
  return byId[id];
}

/** Map a quiz career line or modern title to a comparison career id, if possible. */
export function resolveCompareSlugFromLabel(text: string): string | null {
  const t = text.toLowerCase();

  if (/doctor|mbbs|md\b|medical\b/.test(t)) return "doctor";
  if (/data scientist|machine learning|\bai\b|\/ml/.test(t)) return "data-scientist";
  if (/game developer|game dev/.test(t)) return "game-developer";
  if (/software|engineer|engineering|mechanical|civil|coding/.test(t)) return "engineer";
  if (/chartered accountant|chartered account/.test(t)) return "ca";
  if (/\bmba\b|management graduate|ipmat/.test(t)) return "mba";
  if (/ias|ips|upsc|civil services|officer/.test(t)) return "ias";
  if (/lawyer|llb|advocate|law\b/.test(t)) return "lawyer";
  if (/content creator|youtuber|journalist|influencer|podcast/.test(t)) return "content-creator";
  if (/startup|founder|entrepreneur|business owner/.test(t)) return "startup-founder";
  if (/digital marketing|marketing manager/.test(t)) return "mba";

  return null;
}
