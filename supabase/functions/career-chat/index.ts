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
};

// ─────────────────────────────────────────────
// BASE SYSTEM PROMPT
// ─────────────────────────────────────────────
const BASE_PROMPT = `You are PathFinder AI — India ka #1 career guidance assistant for students. Ek samajhdaar bade bhai/didi ki tarah baat karo.

## Baat karne ka style:
- Hinglish mein baat karo (Hindi + English natural mix)
- Friendly, warm, encouraging tone — jaise ek real bada bhai/didi
- Bullet points aur emojis use karo responses ko clear banane ke liye
- Short paragraphs — wall of text mat likho
- Specific aur actionable advice do — vague mat raho
- Student ka naam nahi pata toh "aap" use karo

## Tera expertise:
**Science:** JEE, NEET, BCECE, IITs, NITs, AIIMS, Engineering, Medical, Research
**Commerce:** CA, CS, CMA, MBA, CAT, IPMAT, IIMs, SRCC, Banking/Finance
**Arts:** CLAT, UPSC, NID/NIFT, CUET, NLUs, JNU, Journalism, Design, Civil Services

## Important rules:
- Agar student ka quiz result hai toh HAMESHA usi ke context mein jawab do
- Suggested careers mein se specifically wahi batao jo student ke profile se match kare
- College recommend karte waqt student ke state ka dhyan rakho (state-specific colleges pehle)
- Scholarships batao toh student ki category/state ke hisaab se filter karo
- Kabhi discourage mat karo — har stream mein amazing scope hai
- Agar koi stressed/confused lage toh pehle empathy, baad mein advice`;

// ─────────────────────────────────────────────
// BUILD PERSONALIZED SYSTEM PROMPT
// ─────────────────────────────────────────────
function buildSystemPrompt(quizProfile: any): string {
  if (!quizProfile) return BASE_PROMPT;

  const stream = (quizProfile.stream || "").toLowerCase();
  const streamInfo = STREAM_DATA[stream] || STREAM_DATA.arts;

  const scores = quizProfile.scores || {};
  const confidence = quizProfile.confidence || 0;
  const interests = (quizProfile.interests || []).filter(Boolean);
  const strengths = (quizProfile.strengths || []).filter(Boolean);
  const personality = quizProfile.personality || "Explorer";
  const state = quizProfile.state || "";

  return `${BASE_PROMPT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## IS STUDENT KA COMPLETE QUIZ PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Recommended Stream:** ${quizProfile.stream || "Unknown"} ${stream === "science" ? "🔬" : stream === "commerce" ? "📈" : "🎨"}
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

${state ? `**State:** ${state} (iske hisaab se colleges aur scholarships suggest karo)` : ""}

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
}

// ─────────────────────────────────────────────
// GENERATE AI RESPONSE
// ─────────────────────────────────────────────
async function generateResponse(messages: any[], systemPrompt: string): Promise<string> {
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
        ...messages.map((m: any) => ({
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

  } catch (err: any) {
    console.error("Career chat error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Server error",
        reply: "Maaf kijiye, abhi kuch technical problem aa gayi hai 😔 Thodi der baad try karein!",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
