// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─────────────────────────────────────────────
// FULL KNOWLEDGE BASE (from quizData.ts)
// ─────────────────────────────────────────────
const STREAM_DATA = {
  science: {
    careers: [
      "Doctor (MBBS/MD) - ₹8-25 LPA",
      "Software Engineer - ₹6-30 LPA",
      "Mechanical/Civil Engineer - ₹5-15 LPA",
      "Research Scientist - ₹6-20 LPA",
      "Data Scientist - ₹8-35 LPA",
      "Architect - ₹5-18 LPA",
      "Pharmacist - ₹3-10 LPA",
      "Agricultural Scientist - ₹4-12 LPA",
    ],
    exams: [
      "JEE Main & Advanced — IITs, NITs ke liye (Jan & April)",
      "NEET UG — Medical colleges ke liye (May)",
      "BCECE — Bihar state engineering entrance",
      "KVPY / INSPIRE — Research scholarships ke liye",
      "BITSAT — BITS Pilani ke liye (May-June)",
      "UPSEE / AKTU — UP state engineering colleges ke liye",
      "WBJEE — West Bengal engineering entrance",
      "MHT CET — Maharashtra engineering/medical entrance",
      "KCET — Karnataka engineering entrance",
      "AP EAMCET / TS EAMCET — AP & Telangana entrance",
    ],
    topColleges: [
      "IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Roorkee",
      "AIIMS Delhi, AIIMS Patna, AIIMS Jodhpur, AIIMS Bhopal",
      "NIT Trichy, NIT Warangal, NIT Surathkal",
      "BITS Pilani, IISc Bangalore, VIT Vellore",
      "Bihar: IIT Patna, NIT Patna, AIIMS Patna, PMCH",
      "UP: IIT (BHU) Varanasi, IIT Kanpur, MNNIT Allahabad, KGMU Lucknow",
    ],
    scholarships: [
      "INSPIRE Scholarship (DST) — ₹80,000/year for BSc/Integrated MSc",
      "KVPY Fellowship — ₹5,000-7,000/month",
      "Central Sector Scheme (MHRD) — ₹10,000-20,000/year",
      "Pragati Scholarship (AICTE) — ₹50,000/year for girls",
      "PM Yasasvi Scholarship — ₹75,000-1,25,000/year (OBC/EBC)",
      "Bihar State Merit Scholarship — ₹10,000-25,000/year",
      "Bihar SC/ST Post Matric — Full fees + ₹2,500/month",
      "DAAD Germany — €934/month + full fees (for higher studies)",
    ],
  },
  commerce: {
    careers: [
      "Chartered Accountant (CA) - ₹7-25 LPA",
      "Investment Banker - ₹10-50 LPA",
      "Digital Marketing Manager - ₹5-20 LPA",
      "MBA Graduate - ₹8-30 LPA",
      "Stock Market Analyst - ₹6-25 LPA",
      "Entrepreneur - Unlimited!",
      "Bank PO / Clerk - ₹4-8 LPA",
      "Company Secretary (CS) - ₹5-15 LPA",
    ],
    exams: [
      "CA Foundation — Chartered Accountant banna hai toh (Nov & May)",
      "CLAT — Law colleges ke liye (May-June)",
      "CS Foundation — Company Secretary ke liye",
      "Bank PO / SSC — Government jobs ke liye",
      "CUET — Central universities ke liye (May)",
      "IPMAT — IIM Indore integrated MBA ke liye",
      "SET / NPAT — Symbiosis / NMIMS entrance",
      "RBI Grade B — Reserve Bank officer ke liye",
      "CAT — IIM MBA entrance (after graduation)",
    ],
    topColleges: [
      "SRCC Delhi, Hindu College Delhi, Lady Shri Ram College (LSR)",
      "IIM Ahmedabad, IIM Bangalore, IIM Calcutta, IIM Lucknow",
      "St. Xavier's Mumbai, HR College Mumbai, NMIMS Mumbai",
      "Symbiosis Pune, Christ University Bangalore, Loyola Chennai",
      "Bihar: IIM Bodh Gaya, Patna University, CIMP Patna",
      "UP: BHU Commerce, IIM Lucknow, Lucknow University, AMU",
    ],
    scholarships: [
      "ICAI Scholarship (CA students) — ₹20,000-50,000/year",
      "Central Sector Scheme (MHRD) — ₹10,000-20,000/year",
      "Sitaram Jindal Foundation — ₹6,000-18,000/year",
      "Pragati Scholarship (AICTE girls) — ₹50,000/year",
      "PM Yasasvi Scholarship — ₹75,000-1,25,000/year (OBC/EBC)",
      "Bihar State Merit Scholarship — ₹10,000-25,000/year",
      "UP Post Matric Scholarship — ₹12,000-30,000/year",
      "DAAD Germany / Chevening UK — fully funded higher studies",
    ],
  },
  arts: {
    careers: [
      "Lawyer (LLB) - ₹5-30 LPA",
      "UX/UI Designer - ₹6-25 LPA",
      "Journalist / Content Creator - ₹4-15 LPA",
      "Film Director / Producer - ₹5-50 LPA",
      "Professor / Teacher - ₹4-12 LPA",
      "IAS/IPS Officer - ₹8-15 LPA + perks",
      "Theatre / Performing Arts - ₹3-20 LPA",
      "Civil Services (BPSC/UPPSC) - ₹6-12 LPA + perks",
    ],
    exams: [
      "CLAT — Top law colleges ke liye (May-June)",
      "UPSC / BPSC / UPPSC — Civil services ke liye",
      "NID / NIFT Entrance — Design colleges ke liye",
      "CUET — Central university admissions ke liye",
      "IIMC Entrance — Journalism ke liye",
      "UGC NET — Professor banna hai toh (June & Dec)",
      "AILET — NLU Delhi entrance",
      "UCEED — IIT Design entrance",
    ],
    topColleges: [
      "JNU Delhi (₹500/year!), Delhi University Arts, Jamia Millia Islamia",
      "NLSIU Bangalore (Law #1), NLU Delhi, NLU Jodhpur, NUJS Kolkata",
      "TISS Mumbai, Ashoka University, Presidency University Kolkata",
      "NID Ahmedabad (Design), NIFT Delhi, IIMC Delhi (Journalism)",
      "Bihar: Chanakya National Law University Patna, Patna University, Nalanda University",
      "UP: BHU Arts, AMU, Allahabad University, RMLNLU Lucknow",
    ],
    scholarships: [
      "Maulana Azad National Fellowship — ₹25,000-28,000/month (Minority PG/PhD)",
      "Central Sector Scheme (MHRD) — ₹10,000-20,000/year",
      "CLAT Fee Waiver at NLUs — SC/ST/BPL students",
      "NIFT Fee Waiver — SC/ST/PwD students",
      "PM Yasasvi Scholarship — ₹75,000-1,25,000/year (OBC/EBC)",
      "Begum Hazrat Mahal Scholarship — ₹5,000-6,000/year (Minority girls)",
      "Bihar State Merit Scholarship — ₹10,000-25,000/year",
      "Chevening UK / Eiffel France / Fulbright USA — fully funded higher studies",
    ],
  },
  sports: {
    careers: [
      "Professional Athlete - ₹3-50 LPA (sport pe depend)",
      "Sports Coach / Trainer - ₹3-15 LPA",
      "Fitness Trainer / Gym Instructor - ₹3-15 LPA",
      "Sports Journalist / Commentator - ₹4-15 LPA",
      "Sports Psychologist - ₹5-18 LPA",
      "Physiotherapist - ₹4-12 LPA",
      "Sports Manager / Agent - ₹5-20 LPA",
      "Sports Photographer / Videographer - ₹3-15 LPA",
      "Physical Education Teacher - ₹3-10 LPA (govt job!)",
      "Sports Analyst / Data Analyst - ₹8-25 LPA",
      "Sports Nutrition Expert - ₹4-12 LPA",
      "Sports Event Manager - ₹4-15 LPA",
      "Defense Services (Army/Navy/Air Force) - ₹6-20 LPA",
    ],
    exams: [
      "BPEd Entrance — Physical Education degree ke liye",
      "NIS Patiala Coaching Course — National Institute of Sports",
      "SAI (Sports Authority of India) — Direct recruitment",
      "NDA — Defence ke liye (12th ke baad)",
      "UPSC (Physical Education optional) — Civil services",
      "State Sports Quota admissions — colleges mein",
      "NEET — Sports Medicine / Physiotherapy ke liye",
      "CMAT / MAT — Sports Management MBA ke liye",
    ],
    topColleges: [
      "NIS Patiala — Sports coaching ka India ka #1 institute",
      "LNIPE Gwalior — Physical Education university",
      "Amity School of Physical Education (Delhi/NCR)",
      "Banaras Hindu University (BHU) — BPEd program",
      "Pune University — Sports Management",
      "Tata Football Academy / Sports academies across India",
      "SAI Regional Centers — Patna, Bangalore, Chennai, Delhi",
    ],
    scholarships: [
      "Sports Scholarship (Ministry of Youth Affairs) — Khelo India",
      "SAI Scholarship — selected athletes ko full support",
      "State Sports Department Scholarships — har state mein",
      "Arjuna Award / Dronacharya Award — national recognition",
      "NSDF (National Sports Development Fund) — athletes ke liye",
      "PM Yasasvi Scholarship — OBC/EBC students ke liye",
      "Central Sector Scholarship — merit-based",
    ],
  },
  creative: {
    careers: [
      "Graphic Designer - ₹3-20 LPA",
      "UX/UI Designer - ₹6-25 LPA",
      "Video Editor / Motion Graphics - ₹4-20 LPA",
      "Animator (2D/3D) - ₹4-25 LPA",
      "Filmmaker / Director - ₹5-50 LPA",
      "Photographer - ₹3-15 LPA",
      "Content Creator / Influencer - ₹2-50 LPA",
      "Fashion Designer - ₹4-20 LPA",
      "Interior Designer - ₹4-18 LPA",
      "Music Producer / Sound Designer - ₹4-20 LPA",
      "Game Designer - ₹6-25 LPA",
      "Brand Identity Designer - ₹5-25 LPA",
      "Art Director (Advertising) - ₹8-30 LPA",
    ],
    exams: [
      "NID DAT — National Institute of Design (top design college)",
      "NIFT Entrance — Fashion & design colleges",
      "UCEED — IIT Design entrance",
      "CEED — M.Des IIT entrance",
      "FTII Entrance — Film & Television Institute of India",
      "Symbiosis Design / MIT Design entrance",
      "Whistling Woods — Film school Mumbai",
      "Pearl Academy entrance — Fashion & design",
    ],
    topColleges: [
      "NID Ahmedabad — India ka best design college",
      "NIFT Delhi / Mumbai / Bangalore — Fashion",
      "IIT Bombay / IIT Delhi (Industrial Design) — UCEED",
      "FTII Pune — Filmmaking (govt institute!)",
      "Srishti Manipal Bangalore — Creative arts",
      "MIT Institute of Design Pune",
      "Pearl Academy Delhi / Mumbai",
      "Whistling Woods International Mumbai",
    ],
    scholarships: [
      "NID Scholarship — merit + need based",
      "NIFT Scholarship — SC/ST/PwD students",
      "Lakmé Fashion Fund — fashion designers ke liye",
      "India Design Mark — design excellence award",
      "Central Sector Scheme — ₹10,000-20,000/year",
      "State scholarships — har state mein available",
    ],
  },
  skills: {
    careers: [
      "Full Stack Web Developer - ₹5-30 LPA",
      "Mobile App Developer - ₹6-30 LPA",
      "Digital Marketer - ₹4-20 LPA",
      "SEO / SEM Specialist - ₹4-15 LPA",
      "Freelancer (various skills) - ₹2-50 LPA",
      "YouTuber / Content Creator - ₹1-50 LPA",
      "Dropshipping / E-commerce - ₹2-unlimited",
      "Cybersecurity Analyst - ₹8-30 LPA",
      "Data Analyst - ₹5-25 LPA",
      "Stock Market Trader - ₹variable",
      "Social Media Manager - ₹3-15 LPA",
      "Virtual Assistant - ₹2-10 LPA (remote)",
      "Podcast Creator - ₹2-20 LPA",
    ],
    exams: [
      "Google Certifications — free, globally recognized",
      "Meta (Facebook) Blueprint — Digital Marketing",
      "AWS / Azure Certifications — Cloud computing",
      "Coursera / edX Certificates — from top universities",
      "Udemy courses — Practical skill courses",
      "NIELIT CCC/O/A/B Level — Govt IT certification",
      "CompTIA — Cybersecurity certifications",
    ],
    topColleges: [
      "IIT / NIT (CSE) — for coding/tech careers",
      "NIIT — IT training institute",
      "Aptech / Arena Animation — IT + Design",
      "YouTube + Udemy — FREE self-learning",
      "PhysicsWallah (coding bootcamp) — affordable",
      "Masai School / Newton School — coding bootcamp (pay after placement)",
      "UpGrad / Simplilearn — online upskilling",
    ],
    scholarships: [
      "Google Career Certificates — FREE online",
      "Microsoft Learn — FREE certifications",
      "GitHub Student Pack — FREE developer tools",
      "AWS Educate — FREE cloud learning",
      "PM e-VIDYA — free govt online education",
      "SWAYAM Courses — free with govt certificate",
    ],
  },
};

// ─────────────────────────────────────────────
// BASE SYSTEM PROMPT
// ─────────────────────────────────────────────
const BASE_PROMPT = `You are PathFinder AI — India ka #1 AI career mentor for students.
Ek caring, honest, experienced bade bhai/didi ki tarah baat karo.

## RESPONSE RULES:
- ONLY answer: career, stream, exams, colleges, scholarships, skills, jobs, education, salary
- Off-topic (movies, cricket scores, cooking, relationships) → reply: "Main sirf career aur education guidance ke liye hoon 😊 Kuch career related poochho!"
- NEVER break this rule

## TONE & STYLE:
- Hinglish (Hindi + English natural mix)
- Warm, encouraging, specific
- Bullet points + emojis
- Short paragraphs (no walls of text)
- ALWAYS end with: "Aur kuch poochho! 😊" ya ek follow-up question

## STUDENT TYPES — SPECIFIC HANDLING:

### 🎓 Academic Student (Science/Commerce/Arts):
- Stream-specific exams, colleges, scholarships
- State-wise guidance (Bihar/UP students extra care)
- Low marks students → government colleges + scholarships + backup plans

### 🏆 Sports Student:
- 13+ career options beyond "player" (coach, analyst, journalist, physio, manager)
- BPEd, NIS Patiala, SAI, sports quota admission
- Khelo India, SAI scholarships
- NEVER say "sports mein career nahi banta" — it DOES!

### 🎨 Creative Student:
- NID, NIFT, FTII, UCEED (IIT design)
- Portfolio building tips
- Freelancing + full-time both options
- Design industry salary reality (₹6-25 LPA possible)

### 💻 Skills/Tech Student:
- Bootcamps (Masai, Newton — pay after placement)
- Free resources (FreeCodeCamp, Google Certifications)
- Freelancing on Fiverr/Upwork
- Portfolio projects importance

### 😔 Confused / Low Motivation Student:
- Empathy first, advice second
- Practical alternatives: ITI, Diploma, skill courses, govt jobs
- "Padhai mein mann nahi" → skill-based paths
- NEVER discourage — every path has scope

### 💸 Financial Constraint Student:
- Government colleges ONLY (IIT/NIT/AIIMS fees ₹2-8K/year!)
- Scholarships immediately suggest
- Earn while study: tutoring, freelancing
- Study loan info if needed

## EXAM DATES (Important):
- JEE Main: January & April
- NEET: May
- CUET: May-June
- CLAT: May
- CA Foundation: November & May
- UPSC Prelims: May-June
- NDA: April & September

## SCHOLARSHIP PORTALS:
- scholarships.gov.in (NSP — national portal)
- buddy4study.com (private scholarships)
- vidyasaarathi.co.in (corporate scholarships)
- State portals: ekalyan.bih.nic.in (Bihar), scholarship.up.gov.in (UP)

## HONEST SALARY DATA (Reality check):
- Fresh graduate realistic: ₹3-8 LPA (most fields)
- 5 years experience: ₹8-20 LPA
- Premium (IIT/IIM/top college): ₹15-50 LPA
- Entrepreneurship: variable but possible
- NEVER mislead with unrealistic salary claims`;

// ─────────────────────────────────────────────
// BUILD PERSONALIZED SYSTEM PROMPT
// ─────────────────────────────────────────────
interface QuizProfileInput {
  stream?: string;
  scores?: { science?: number; commerce?: number; arts?: number };
  confidence?: number;
  interests?: string[];
  strengths?: string[];
  personality?: string;
  state?: string;
  selectedInterest?: string;
  situation?: string[];
  budget?: string;
  quizUserNotes?: Record<string, string>;
}

function buildSystemPrompt(quizProfile: QuizProfileInput | null): string {
  if (!quizProfile) return BASE_PROMPT;

  const stream = (quizProfile.stream || "").toLowerCase();
  const streamInfo = STREAM_DATA[stream as keyof typeof STREAM_DATA] || STREAM_DATA.skills;

  const scores = quizProfile.scores || {};
  const confidence = quizProfile.confidence || 0;
  const interests = (quizProfile.interests || []).filter(Boolean);
  const strengths = (quizProfile.strengths || []).filter(Boolean);
  const personality = quizProfile.personality || "Explorer";
  const state = quizProfile.state || "";

  const interest = quizProfile.selectedInterest || "";
  const interestMap: Record<string, string> = {
    tech: "Technology & Science mein interest — coding, AI, engineering paths prioritize karo",
    business: "Business & Finance mein interest — CA, MBA, startup, digital marketing focus karo",
    creative: "Arts & Creative mein interest — design, media, content creation, law paths batao",
    sports: "Sports mein interest — sports management, coaching, physiotherapy, defense paths batao",
    undecided: "Abhi interest clear nahi — multiple options clearly compare karo with pros/cons",
  };
  const interestLine =
    interest && interestMap[interest]
      ? `\n**Student ka Interest:** ${interestMap[interest]}`
      : "";

  // ── Non-traditional path detection ──────────────────────────────────────
  const selectedInterest = quizProfile?.selectedInterest || "";
  const notes = quizProfile?.quizUserNotes || {};
  const notesText = Object.values(notes).join(" ").toLowerCase();

  const isSports = selectedInterest === "sports" ||
    /sports|cricket|football|badminton|khelna|athlete|player/.test(notesText);
  const isCreative = selectedInterest === "creative" ||
    /design|drawing|film|music|creative|animation|art|photography/.test(notesText);
  const isSkills = selectedInterest === "tech" ||
    /coding|app|youtube|freelance|digital|skills|web dev/.test(notesText);
  const isConfused = (quizProfile?.confidence || 0) < 35 ||
    /confused|nahi pata|decide nahi|kuch bhi|koi bhi/.test(notesText);
  const needsFinance = quizProfile?.situation?.includes("Financial") ||
    quizProfile?.budget === "low";

  let extraContext = "";
  if (isSports) extraContext += "\n\n🏆 IMPORTANT: Ye student SPORTS mein interested hai! Sports-specific career options prioritize karo — 13+ options hain sirf 'player' ke alawa.";
  if (isCreative) extraContext += "\n\n🎨 IMPORTANT: Ye student CREATIVE field mein jaana chahta hai! NID, NIFT, FTII, animation, design careers focus karo.";
  if (isSkills) extraContext += "\n\n💻 IMPORTANT: Ye student SKILLS/TECH mein interested hai! Coding bootcamps, freelancing, digital marketing paths batao.";
  if (isConfused) extraContext += "\n\n😔 NOTE: Ye student confused/undecided hai. Pehle explore karne ka option do, 2-3 paths compare karo clearly.";
  if (needsFinance) extraContext += "\n\n💸 NOTE: Financial constraint hai! Only government colleges + scholarships suggest karo.";

  const basePrompt = `${BASE_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## IS STUDENT KA COMPLETE QUIZ PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Recommended Stream:** ${quizProfile.stream || "Unknown"} ${stream === "science" ? "🔬" : stream === "commerce" ? "📈" : stream === "sports" ? "🏆" : stream === "creative" ? "🎨" : stream === "skills" ? "💻" : "🎭"}
**Personality Type:** ${personality}
**Confidence Level:** ${confidence}% (${confidence > 70 ? "Bahut clear — ek hi stream pe focus karo" : confidence > 50 ? "Fairly clear — primary stream strong hai" : "Mixed — thoda explore karo pehle"})

**Quiz Scores:**
- Science: ${scores.science || 0} points
- Commerce: ${scores.commerce || 0} points
- Arts: ${scores.arts || 0} points

${interests.length > 0 ? `**Student ke Interests (quiz se):**
${interests.slice(0, 5).map((i: string) => `- ${i}`).join("\n")}` : ""}

${strengths.length > 0 ? `**Student ki Strengths (quiz se):**
${strengths.slice(0, 4).map((s: string) => `- ${s}`).join("\n")}` : ""}

${state ? `**State:** ${state} (iske hisaab se colleges aur scholarships suggest karo)` : ""}${interestLine}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ${(quizProfile.stream || "").toUpperCase()} STREAM — COMPLETE DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Suggested Careers (salary ke saath):**
${streamInfo.careers.map((c: string) => `• ${c}`).join("\n")}

**Important Exams:**
${streamInfo.exams.map((e: string) => `• ${e}`).join("\n")}

**Top Colleges:**
${streamInfo.topColleges.map((c: string) => `• ${c}`).join("\n")}

**Available Scholarships:**
${streamInfo.scholarships.map((s: string) => `• ${s}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## CHATBOT BEHAVIOR RULES FOR THIS STUDENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **Career questions** → Student ke suggested careers mein se unke interests se match karne wale specifically batao
2. **College questions** → ${state ? `${state} ke colleges pehle suggest karo, phir national level` : "Pehle poochho ki student kahan se hai, phir state-specific + national colleges batao"}
3. **Exam questions** → ${quizProfile.stream} stream ke exams specifically batao with dates aur preparation tips
4. **Scholarship questions** → Upar diye scholarships mein se relevant wale batao with amounts aur deadlines
5. **Confusion/doubt** → ${confidence}% confidence level ko address karo — ${confidence > 70 ? "stream clear hai, focus karo aur reassure karo" : "explore karna bilkul theek hai, dono options discuss karo"}
6. **Motivation** → Personality type "${personality}" ke hisaab se motivate karo — specific aur personal feel karo
7. **Har jawab ke end mein** → Ek relevant follow-up question suggest karo jo student aage poochh sake`;

  return basePrompt + (extraContext ? "\n\n━━━━━━━━━━━━━━━\n## THIS STUDENT CONTEXT:" + extraContext : "");
}

// ─────────────────────────────────────────────
// GENERATE AI RESPONSE
// ─────────────────────────────────────────────
interface ChatMessage {
  role: string;
  content: string;
}

async function generateResponse(messages: ChatMessage[], systemPrompt: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY Supabase secrets mein set nahi hai");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://career-guider-six.vercel.app",
      "X-Title": "PathFinder AI",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-haiku",
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("OpenRouter error:", errText);
    throw new Error(`OpenRouter API error: ${res.status}`);
  }

  const data = await res.json();

  if (data?.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  if (data?.error) {
    throw new Error(data.error.message || "AI response error");
  }

  throw new Error("AI se koi response nahi mila");
}

// ─────────────────────────────────────────────
// MAIN SERVER
// ─────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages = body.messages || [];
    const quizProfile = body.quizProfile || null;

    if (!messages.length) {
      return new Response(
        JSON.stringify({ error: "Messages array empty hai" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = buildSystemPrompt(quizProfile);
    const reply = await generateResponse(messages, systemPrompt);

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: unknown) {
    console.error("Career chat error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return new Response(
      JSON.stringify({
        error: message,
        reply: "Maaf kijiye, abhi kuch technical problem aa gayi hai 😔 Thodi der baad try karein!",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
