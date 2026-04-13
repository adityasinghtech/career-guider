export interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; scores: { science: number; commerce: number; arts: number } }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "School mein aapko kaunsa subject sabse zyada pasand hai? 📚",
    options: [
      { text: "Maths aur Science - formulas solve karna accha lagta hai", scores: { science: 3, commerce: 1, arts: 0 } },
      { text: "Business Studies / Economics - paisa aur market samajhna accha lagta hai", scores: { science: 0, commerce: 3, arts: 1 } },
      { text: "History / Geography / Languages - stories aur cultures interesting lagti hain", scores: { science: 0, commerce: 1, arts: 3 } },
      { text: "Sab acche lagte hain, koi ek choose nahi ho paata", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 2,
    question: "Free time mein aap kya karte/karti hain? 🎮",
    options: [
      { text: "Gadgets kholna, experiments karna, coding try karna", scores: { science: 3, commerce: 0, arts: 1 } },
      { text: "Online selling ideas sochna, money management games", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Drawing, writing, music, ya creative kaam", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Friends ke saath time spend karna, sports, ya social media", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 3,
    question: "Bade hokar kya banna chahte/chahti hain? 🚀",
    options: [
      { text: "Doctor, Engineer, Scientist, ya Tech mein kuch", scores: { science: 3, commerce: 0, arts: 0 } },
      { text: "CA, MBA, Business owner, ya Finance mein", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Lawyer, Teacher, Writer, Designer, ya Artist", scores: { science: 0, commerce: 1, arts: 3 } },
      { text: "Abhi decide nahi hai, explore kar rahe/rahi hain", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 4,
    question: "Problem solve kaise karte/karti hain? 🧩",
    options: [
      { text: "Logic use karke - step by step sochte/sochti hain", scores: { science: 3, commerce: 1, arts: 0 } },
      { text: "Practical approach - kya kaam karega woh dekhte/dekhti hain", scores: { science: 1, commerce: 3, arts: 0 } },
      { text: "Creative way se - alag angle se sochte/sochti hain", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Dusron se discuss karke solution nikalte/nikalti hain", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 5,
    question: "Kaisa kaam ka environment chahiye aapko? 🏢",
    options: [
      { text: "Lab, hospital, ya tech company - research type", scores: { science: 3, commerce: 0, arts: 0 } },
      { text: "Office, bank, ya apna business - professional setup", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Studio, stage, ya open space - creative jagah", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Koi bhi chalega, kaam important hai jagah nahi", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 6,
    question: "Group project mein aap kya role lete/leti hain? 👥",
    options: [
      { text: "Research aur data wala kaam - facts dhundhna", scores: { science: 3, commerce: 1, arts: 0 } },
      { text: "Planning aur organizing - sab manage karna", scores: { science: 0, commerce: 3, arts: 1 } },
      { text: "Presentation aur design - creative part", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Sab mein help karte/karti hain, koi fixed role nahi", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 7,
    question: "Kaunsi movie/show type pasand hai? 🎬",
    options: [
      { text: "Sci-fi, documentaries, tech related stuff", scores: { science: 3, commerce: 0, arts: 1 } },
      { text: "Shark Tank, business stories, real-life success", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Drama, art films, music shows, creative content", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Action, comedy - entertainment chahiye bas", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 8,
    question: "10 lakh rupaye mil jaayein toh kya karenge? 💰",
    options: [
      { text: "Koi gadget banayenge ya research karenge", scores: { science: 3, commerce: 0, arts: 0 } },
      { text: "Invest karenge ya small business start karenge", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Travel karenge, art studio setup, ya creative project", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Save karenge aur baad mein sochenge", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 9,
    question: "Kal Maths ka exam hai — aapki reaction? 😅",
    options: [
      { text: "Accha hai! Practice kar lete/leti hain", scores: { science: 3, commerce: 1, arts: 0 } },
      { text: "Theek hai, percentage aur profit loss toh aata hai", scores: { science: 1, commerce: 3, arts: 0 } },
      { text: "Kuch aur padh lete/leti toh better hota", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Thoda nervous hain, par kar lenge somehow", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 10,
    question: "Future mein kya achieve karna chahte hain life mein? 🌟",
    options: [
      { text: "Kuch naya invent karna ya medical breakthrough", scores: { science: 3, commerce: 0, arts: 0 } },
      { text: "Apna empire banana, financially independent hona", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Society mein change laana, apni art se logo ko inspire karna", scores: { science: 0, commerce: 1, arts: 3 } },
      { text: "Khush rehna aur family ke liye accha karna", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 11,
    question: "Coding ya programming ke baare mein kya sochte/sochti hain? 🤖",
    options: [
      { text: "Mast lagta hai! App ya game banana chahte/chahti hain", scores: { science: 3, commerce: 1, arts: 0 } },
      { text: "Business automation ke liye useful hai", scores: { science: 1, commerce: 3, arts: 0 } },
      { text: "Nahi yaar, creative kaam zyada pasand hai", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Thoda interest hai, par abhi seekha nahi", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 12,
    question: "Newspaper/social media pe kaunsi news sabse pehle padhte/padhti hain? 📰",
    options: [
      { text: "Technology, space, aur science discoveries", scores: { science: 3, commerce: 0, arts: 0 } },
      { text: "Stock market, startups, business news", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Politics, society, art aur culture ki news", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Sports, entertainment, trending topics", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 13,
    question: "School mein kaunsa teacher ka style sabse accha lagta hai? 👩‍🏫",
    options: [
      { text: "Jo experiments aur practicals karwaye — hands-on learning", scores: { science: 3, commerce: 0, arts: 1 } },
      { text: "Jo real-life examples se samjhaye — practical knowledge", scores: { science: 1, commerce: 3, arts: 0 } },
      { text: "Jo discussions aur debates karwaye — open thinking", scores: { science: 0, commerce: 1, arts: 3 } },
      { text: "Jo simple aur friendly tarike se padhaye", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 14,
    question: "2040 mein aap kahan dekhte/dekhti hain apne aap ko? 🔮",
    options: [
      { text: "Silicon Valley mein AI company chalate hue ya NASA mein kaam karte hue", scores: { science: 3, commerce: 0, arts: 0 } },
      { text: "Apni Shark Tank wali company ka empire khadaa karte hue", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Bollywood mein, ya IAS officer, ya apni art gallery mein", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Kuch bada — par abhi figure out kar rahe/rahi hain", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 15,
    question: "Last sawaal! Aapki superpower kya hai? 💪",
    options: [
      { text: "Dimaag se koi bhi problem solve kar sakte/sakti hain — Logic King/Queen", scores: { science: 3, commerce: 1, arts: 0 } },
      { text: "Logon ko convince karna aur deals karna — Business Mind", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Imagination aur creativity — kuch naya soch sakte/sakti hain", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Sabke saath mil ke kaam kar sakte/sakti hain — Team Player", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  // ===== ADVANCED QUESTIONS (16-20) =====
  {
    id: 16,
    question: "Ek nayi technology launch ho rahi hai — aapki pehli reaction? 🧪",
    options: [
      { text: "Isko kaise banaya — technical details samajhna chahte hain", scores: { science: 3, commerce: 0, arts: 1 } },
      { text: "Isko market mein kaise sell karenge — business model dekhenge", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Iske social impact pe sochenge — society pe kya asar hoga", scores: { science: 0, commerce: 1, arts: 3 } },
      { text: "Interesting hai, par use karke dekhenge pehle", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 17,
    question: "Stress mein kaise deal karte/karti hain? 🧘",
    options: [
      { text: "Problem ko analyse karke systematically solve karte hain", scores: { science: 3, commerce: 1, arts: 0 } },
      { text: "Plan B ready rakhte hain — practical solution dhundhte hain", scores: { science: 1, commerce: 3, arts: 0 } },
      { text: "Music, art, ya writing se apne aap ko express karte hain", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Friends/family se baat karke better feel hota hai", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 18,
    question: "School mein kaunsa competition jeetna chahte hain sabse zyada? 🏆",
    options: [
      { text: "Science Olympiad, Math Quiz, ya Robotics", scores: { science: 3, commerce: 0, arts: 0 } },
      { text: "Business Plan competition, Stock Market Game", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Debate, Essay Writing, Art Exhibition, ya Drama", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Sports ya general knowledge quiz", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 19,
    question: "Agar YouTube channel banana ho toh kis topic pe banaoge? 📹",
    options: [
      { text: "Science experiments, tech reviews, coding tutorials", scores: { science: 3, commerce: 0, arts: 1 } },
      { text: "Finance tips, business ideas, stock market analysis", scores: { science: 0, commerce: 3, arts: 0 } },
      { text: "Storytelling, art, music covers, ya social commentary", scores: { science: 0, commerce: 0, arts: 3 } },
      { text: "Vlogs, gaming, ya lifestyle content", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
  {
    id: 20,
    question: "India ke kaunse bade problem ko solve karna chahte hain? 🇮🇳",
    options: [
      { text: "Clean energy, healthcare, ya technology gap", scores: { science: 3, commerce: 0, arts: 1 } },
      { text: "Poverty, unemployment — economic growth se", scores: { science: 0, commerce: 3, arts: 1 } },
      { text: "Education inequality, social justice, ya cultural preservation", scores: { science: 0, commerce: 1, arts: 3 } },
      { text: "Sab important hain, jo bhi ho sakta hai woh karunga/karungi", scores: { science: 1, commerce: 1, arts: 1 } },
    ],
  },
];
export interface Scholarship {
  name: string;
  amount: string;
  eligibility: string;
  deadline: string;
  link: string;
  category: string; // "Bihar" | "UP" | "National" | state name | "International"
}

export type CollegeTypeTag = "government" | "private" | "polytechnic" | "local" | "top";

export interface College {
  name: string;
  location: string;
  fees: string;
  rating: string;
  state: string;
  cutoff?: string;
  collegeType?: CollegeTypeTag;
  courseDuration?: string;
  admissionType?: "merit" | "entrance" | "management";
}

export interface StreamResult {
  stream: "Science" | "Commerce" | "Arts" | "Sports" | "Creative" | "Skills";
  emoji: string;
  tagline: string;
  description: string;
  careers: string[];
  modernCareers?: { title: string; salary: string; description: string; trend: string }[];
  nonAcademicCareers?: { title: string; salary: string; description: string }[];
  roadmap: { month: string; task: string }[];
  colleges: College[];
  scholarships: Scholarship[];
  examsToPrepare: string[];
  youtubeChannels: string[];
}

/** Same passion-based paths shown for every stream */
const NON_ACADEMIC_CAREERS_ALL_STREAMS: {
  title: string;
  salary: string;
  description: string;
}[] = [
  { title: "Professional Sports", salary: "₹2-100 LPA", description: "Cricket, Football, Badminton, etc" },
  { title: "Music / Singing", salary: "₹2-50 LPA", description: "Singer, composer, music producer" },
  { title: "Acting / Film", salary: "₹3-unlimited", description: "Bollywood, OTT, theatre" },
  { title: "Sports Coaching", salary: "₹3-15 LPA", description: "Apni expertise dusron ko sikhao" },
];

// ============== ALL STATES LIST ==============
export const allStates = [
  "Bihar", "UP", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu",
  "West Bengal", "Rajasthan", "Madhya Pradesh", "Gujarat", "Telangana",
  "Kerala", "Punjab", "Haryana", "Jharkhand", "Uttarakhand", "Assam",
  "Odisha", "Chhattisgarh", "Andhra Pradesh", "Other States", "International"
];

export const stateLabels: Record<string, string> = {
  Bihar: "🏛️ Bihar",
  UP: "🏛️ UP",
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
  "Other States": "🇮🇳 Other States",
  International: "🌍 International",
};

export const streamResults: Record<string, StreamResult> = {
  science: {
    stream: "Science",
    emoji: "🔬",
    tagline: "Aap hain future ke Einstein! 🧠",
    description:
      "Aapke answers se pata chalta hai ki aap logic, problem-solving aur research mein strong hain. Science stream aapke liye perfect hai kyunki aap curious hain, experiments pasand karte/karti hain, aur nayi cheezein discover karna aapki natural tendency hai. Engineering, Medical, ya Pure Science — sab options open hain!",
    careers: [
      "🩺 Doctor (MBBS/MD) - ₹8-25 LPA",
      "💻 Software Engineer - ₹6-30 LPA",
      "🔧 Mechanical/Civil Engineer - ₹5-15 LPA",
      "🧬 Research Scientist - ₹6-20 LPA",
      "📊 Data Scientist - ₹8-35 LPA",
      "🏗️ Architect - ₹5-18 LPA",
      "💊 Pharmacist - ₹3-10 LPA",
      "🌾 Agricultural Scientist - ₹4-12 LPA",
    ],
    modernCareers: [
      { title: "AI / Machine Learning Engineer", salary: "₹12-50 LPA", description: "AI models build karo", trend: "🔥 Hottest" },
      { title: "Data Scientist", salary: "₹8-35 LPA", description: "Data se insights nikalo", trend: "📈 Growing" },
      { title: "Cyber Security Expert", salary: "₹10-40 LPA", description: "Systems ko secure karo", trend: "🔒 Critical" },
      { title: "Game Developer", salary: "₹6-25 LPA", description: "Games banao", trend: "🎮 Rising" },
    ],
    nonAcademicCareers: NON_ACADEMIC_CAREERS_ALL_STREAMS,
    examsToPrepare: [
      "🎯 JEE Main & Advanced — IITs, NITs ke liye (Jan & April)",
      "🩺 NEET UG — Medical colleges ke liye (May)",
      "📐 BCECE — Bihar state engineering entrance",
      "🔬 KVPY / INSPIRE — Research scholarships ke liye",
      "💻 BITSAT — BITS Pilani ke liye (May-June)",
      "🏛️ UPSEE / AKTU — UP state engineering colleges ke liye",
      "📝 WBJEE — West Bengal engineering entrance",
      "🎓 MHT CET — Maharashtra engineering/medical entrance",
      "📋 KCET — Karnataka engineering entrance",
      "🔬 AP EAMCET / TS EAMCET — AP & Telangana entrance",
    ],
    roadmap: [
      { month: "Month 1-2", task: "Class 11 ki PCM/PCB foundation strong karein. NCERT line by line padhein. Agar coaching join karni hai toh abhi kar lein — Allen, PW, ya Unacademy." },
      { month: "Month 3-4", task: "JEE/NEET ka syllabus samjhein aur daily 4-5 hours padhai shuru karein. HC Verma (Physics), RD Sharma (Maths), NCERT Bio — ye aapki Bible hai." },
      { month: "Month 5-6", task: "Chapter-wise PYQs (Previous Year Questions) solve karein. Weak topics identify karein aur unpe extra time dein. Doubt sessions attend karein." },
      { month: "Month 7-8", task: "Mock tests dena shuru karein — NTA Abhyas App, Allen Test Series, PW test series. Har week 1-2 mock dein aur analyse karein." },
      { month: "Month 9-10", task: "Revision mode ON! Formula sheets banayein, short notes ready karein. Time management practice karein — 3 hours mein paper complete karna seekhein." },
      { month: "Month 11-12", task: "College research karein — IIT, NIT, AIIMS, state colleges sab ki cutoff dekhein. Application forms bharein. Final revision aur exam dein — all the best! 🔥" },
    ],
    colleges: [
      // ===== BIHAR =====
      { name: "IIT Patna", location: "Patna, Bihar", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Bihar", cutoff: "JEE Advanced: Rank 3000-8000", collegeType: "top", courseDuration: "4 years", admissionType: "entrance" },
      { name: "NIT Patna", location: "Patna, Bihar", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "JEE Main: 85-95 percentile", collegeType: "top", courseDuration: "4 years", admissionType: "entrance" },
      { name: "AIIMS Patna", location: "Patna, Bihar", fees: "₹1,628/year", rating: "⭐⭐⭐⭐⭐", state: "Bihar", cutoff: "NEET: 620+ marks", collegeType: "top", courseDuration: "5.5 years", admissionType: "entrance" },
      { name: "Patna Medical College (PMCH)", location: "Patna, Bihar", fees: "₹15-30K/year", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "NEET: 550-600 marks", collegeType: "government", courseDuration: "5.5 years", admissionType: "entrance" },
      { name: "Muzaffarpur Institute of Technology", location: "Muzaffarpur, Bihar", fees: "₹80K-1.2L/year", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "BCECE: Top 5000 rank" },
      { name: "Darbhanga Medical College", location: "Darbhanga, Bihar", fees: "₹15-25K/year", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "NEET: 500-550 marks" },
      { name: "Nalanda Medical College", location: "Patna, Bihar", fees: "₹20K/year", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "NEET: 520-570 marks" },
      { name: "BIT Mesra (Patna Campus)", location: "Patna, Bihar", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "JEE Main: 75-85 percentile" },
      { name: "Bhagalpur College of Engineering", location: "Bhagalpur, Bihar", fees: "₹70K-1L/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "BCECE: Top 10000 rank" },
      { name: "Gaya College of Engineering", location: "Gaya, Bihar", fees: "₹60K-90K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "BCECE: Top 15000 rank", collegeType: "government", courseDuration: "4 years", admissionType: "entrance" },
      { name: "Government Engineering College", location: "Patna (state capital), Bihar", fees: "₹20-50K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "BCECE: Any rank", collegeType: "government", courseDuration: "4 years", admissionType: "entrance" },
      { name: "District Engineering Institute", location: "Patna, Bihar", fees: "₹15-40K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "State merit / lateral entry", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },
      { name: "Government Polytechnic", location: "Patna, Bihar", fees: "₹8-20K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "10th merit / polytechnic entrance", collegeType: "polytechnic", courseDuration: "3 years", admissionType: "merit" },

      // ===== UP =====
      { name: "IIT (BHU) Varanasi", location: "Varanasi, UP", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "JEE Advanced: Rank 2000-6000", collegeType: "top", courseDuration: "4 years", admissionType: "entrance" },
      { name: "IIT Kanpur", location: "Kanpur, UP", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "JEE Advanced: Rank 500-3000", collegeType: "top", courseDuration: "4 years", admissionType: "entrance" },
      { name: "MNNIT Allahabad", location: "Prayagraj, UP", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "JEE Main: 90-97 percentile" },
      { name: "BHU (Banaras Hindu University)", location: "Varanasi, UP", fees: "₹10-50K/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "CUET: 85-95 percentile" },
      { name: "KGMU Lucknow", location: "Lucknow, UP", fees: "₹20-50K/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "NEET: 600+ marks" },
      { name: "AMU (Aligarh Muslim University)", location: "Aligarh, UP", fees: "₹15-40K/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "AMU Entrance: 70%+" },
      { name: "HBTU Kanpur", location: "Kanpur, UP", fees: "₹1-1.5L/year", rating: "⭐⭐⭐⭐", state: "UP", cutoff: "JEE Main: 80-90 percentile" },
      { name: "AKTU Lucknow (affiliated colleges)", location: "Lucknow, UP", fees: "₹80K-2L/year", rating: "⭐⭐⭐", state: "UP", cutoff: "UPSEE: 70-85 percentile", collegeType: "private", courseDuration: "4 years", admissionType: "entrance" },
      { name: "Government Engineering College", location: "Lucknow (state capital), UP", fees: "₹25-55K/year", rating: "⭐⭐⭐", state: "UP", cutoff: "UPSEE / AKTU: State merit", collegeType: "government", courseDuration: "4 years", admissionType: "entrance" },
      { name: "District Engineering Institute", location: "Kanpur, UP", fees: "₹18-45K/year", rating: "⭐⭐⭐", state: "UP", cutoff: "JEECUP / merit", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },
      { name: "Government Polytechnic", location: "Kanpur, UP", fees: "₹10-25K/year", rating: "⭐⭐⭐", state: "UP", cutoff: "JEECUP / 10th merit", collegeType: "polytechnic", courseDuration: "3 years", admissionType: "merit" },

      // ===== DELHI =====
      { name: "IIT Delhi", location: "New Delhi", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "JEE Advanced: Rank 100-2000", collegeType: "top", courseDuration: "4 years", admissionType: "entrance" },
      { name: "AIIMS Delhi", location: "New Delhi", fees: "₹1,628/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "NEET: 700+ marks", collegeType: "top", courseDuration: "5.5 years", admissionType: "entrance" },
      { name: "Delhi University (Science)", location: "New Delhi", fees: "₹10-30K/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "CUET: 90-98 percentile" },
      { name: "DTU (Delhi Technological University)", location: "New Delhi", fees: "₹1.5-2L/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "JEE Main: 95-99 percentile" },
      { name: "NSUT Delhi", location: "New Delhi", fees: "₹1.5-2L/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "JEE Main: 93-98 percentile" },
      { name: "IIIT Delhi", location: "New Delhi", fees: "₹3-3.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "JEE Main: 95-99 percentile" },
      { name: "Maulana Azad Medical College", location: "New Delhi", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "NEET: 690+ marks", collegeType: "government", courseDuration: "5.5 years", admissionType: "entrance" },
      { name: "Government Engineering College", location: "Delhi NCR (state capital region)", fees: "₹30-60K/year", rating: "⭐⭐⭐", state: "Delhi", cutoff: "State quota / JEE Main", collegeType: "government", courseDuration: "4 years", admissionType: "entrance" },
      { name: "District Engineering Institute", location: "New Delhi", fees: "₹20-50K/year", rating: "⭐⭐⭐", state: "Delhi", cutoff: "CET / merit", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },
      { name: "Government Polytechnic", location: "New Delhi", fees: "₹12-28K/year", rating: "⭐⭐⭐", state: "Delhi", cutoff: "CET / 10th merit", collegeType: "polytechnic", courseDuration: "3 years", admissionType: "merit" },

      // ===== MAHARASHTRA =====
      { name: "IIT Bombay", location: "Mumbai", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "JEE Advanced: Rank 1-1000", collegeType: "top", courseDuration: "4 years", admissionType: "entrance" },
      { name: "COEP Pune", location: "Pune", fees: "₹1-1.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "MHT CET: 99+ percentile / JEE: 90+" },
      { name: "VJTI Mumbai", location: "Mumbai", fees: "₹80K-1.2L/year", rating: "⭐⭐⭐⭐", state: "Maharashtra", cutoff: "MHT CET: 98+ percentile" },
      { name: "Grant Medical College Mumbai", location: "Mumbai", fees: "₹30-50K/year", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "NEET: 600+ marks" },
      { name: "Savitribai Phule Pune University", location: "Pune", fees: "₹20-60K/year", rating: "⭐⭐⭐⭐", state: "Maharashtra", cutoff: "MHT CET: 85-95 percentile", collegeType: "government", courseDuration: "3-5 years", admissionType: "entrance" },
      { name: "Government Engineering College", location: "Mumbai (capital region), Maharashtra", fees: "₹25-50K/year", rating: "⭐⭐⭐", state: "Maharashtra", cutoff: "MHT CET: State rank", collegeType: "government", courseDuration: "4 years", admissionType: "entrance" },
      { name: "District Engineering Institute", location: "Pune, Maharashtra", fees: "₹18-42K/year", rating: "⭐⭐⭐", state: "Maharashtra", cutoff: "Diploma merit", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },
      { name: "Government Polytechnic", location: "Pune, Maharashtra", fees: "₹15-35K/year", rating: "⭐⭐⭐", state: "Maharashtra", cutoff: "Diploma CET / merit", collegeType: "polytechnic", courseDuration: "3 years", admissionType: "merit" },

      // ===== KARNATAKA =====
      { name: "IISc Bangalore", location: "Bangalore", fees: "₹35K/year", rating: "⭐⭐⭐⭐⭐", state: "Karnataka", cutoff: "JEE Advanced/KVPY: Top ranks" },
      { name: "NIT Karnataka Surathkal", location: "Surathkal", fees: "₹1.5-2L/year", rating: "⭐⭐⭐⭐⭐", state: "Karnataka", cutoff: "JEE Main: 95-99 percentile" },
      { name: "RV College of Engineering", location: "Bangalore", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐", state: "Karnataka", cutoff: "KCET: Rank 2000-5000" },
      { name: "Bangalore Medical College", location: "Bangalore", fees: "₹40-60K/year", rating: "⭐⭐⭐⭐⭐", state: "Karnataka", cutoff: "NEET: 580+ marks" },
      { name: "PES University", location: "Bangalore", fees: "₹3-5L/year", rating: "⭐⭐⭐⭐", state: "Karnataka", cutoff: "PESSAT/KCET: 60%+" },

      // ===== TAMIL NADU =====
      { name: "IIT Madras", location: "Chennai", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "JEE Advanced: Rank 100-2500" },
      { name: "NIT Trichy", location: "Tiruchirappalli", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "JEE Main: 95-99 percentile" },
      { name: "Anna University", location: "Chennai", fees: "₹50K-1L/year", rating: "⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "TNEA: 190+ cutoff marks" },
      { name: "Madras Medical College", location: "Chennai", fees: "₹20-40K/year", rating: "⭐⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "NEET: 600+ marks" },
      { name: "VIT Vellore", location: "Vellore", fees: "₹2-4L/year", rating: "⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "VITEEE: 70+ marks" },

      // ===== WEST BENGAL =====
      { name: "IIT Kharagpur", location: "Kharagpur", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "JEE Advanced: Rank 500-4000" },
      { name: "Jadavpur University", location: "Kolkata", fees: "₹10-25K/year", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "WBJEE: Rank 500-3000" },
      { name: "NIT Durgapur", location: "Durgapur", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "West Bengal", cutoff: "JEE Main: 85-95 percentile" },
      { name: "Calcutta Medical College", location: "Kolkata", fees: "₹15-30K/year", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "NEET: 570+ marks" },

      // ===== RAJASTHAN =====
      { name: "IIT Jodhpur", location: "Jodhpur", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Rajasthan", cutoff: "JEE Advanced: Rank 3000-8000" },
      { name: "MNIT Jaipur", location: "Jaipur", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Rajasthan", cutoff: "JEE Main: 90-97 percentile" },
      { name: "AIIMS Jodhpur", location: "Jodhpur", fees: "₹1,628/year", rating: "⭐⭐⭐⭐⭐", state: "Rajasthan", cutoff: "NEET: 640+ marks" },
      { name: "SMS Medical College Jaipur", location: "Jaipur", fees: "₹30-50K/year", rating: "⭐⭐⭐⭐⭐", state: "Rajasthan", cutoff: "NEET: 550+ marks" },
      { name: "BITS Pilani", location: "Pilani", fees: "₹4-5L/year", rating: "⭐⭐⭐⭐⭐", state: "Rajasthan", cutoff: "BITSAT: 300+ marks" },

      // ===== MADHYA PRADESH =====
      { name: "IIT Indore", location: "Indore", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Madhya Pradesh", cutoff: "JEE Advanced: Rank 2500-7000" },
      { name: "MANIT Bhopal", location: "Bhopal", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Madhya Pradesh", cutoff: "JEE Main: 88-95 percentile" },
      { name: "AIIMS Bhopal", location: "Bhopal", fees: "₹1,628/year", rating: "⭐⭐⭐⭐⭐", state: "Madhya Pradesh", cutoff: "NEET: 640+ marks" },
      { name: "Gandhi Medical College Bhopal", location: "Bhopal", fees: "₹30-50K/year", rating: "⭐⭐⭐⭐", state: "Madhya Pradesh", cutoff: "NEET: 530+ marks" },

      // ===== GUJARAT =====
      { name: "IIT Gandhinagar", location: "Gandhinagar", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Gujarat", cutoff: "JEE Advanced: Rank 2000-7000" },
      { name: "NIT Surat (SVNIT)", location: "Surat", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Gujarat", cutoff: "JEE Main: 90-96 percentile" },
      { name: "BJ Medical College Ahmedabad", location: "Ahmedabad", fees: "₹25-45K/year", rating: "⭐⭐⭐⭐⭐", state: "Gujarat", cutoff: "NEET: 580+ marks" },
      { name: "DA-IICT Gandhinagar", location: "Gandhinagar", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐", state: "Gujarat", cutoff: "JEE Main: 80-90 percentile" },

      // ===== TELANGANA =====
      { name: "IIT Hyderabad", location: "Hyderabad", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Telangana", cutoff: "JEE Advanced: Rank 2000-6000" },
      { name: "NIT Warangal", location: "Warangal", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Telangana", cutoff: "JEE Main: 93-98 percentile" },
      { name: "IIIT Hyderabad", location: "Hyderabad", fees: "₹2.5-3L/year", rating: "⭐⭐⭐⭐⭐", state: "Telangana", cutoff: "JEE Main: 97+ percentile" },
      { name: "Osmania Medical College", location: "Hyderabad", fees: "₹30-50K/year", rating: "⭐⭐⭐⭐⭐", state: "Telangana", cutoff: "NEET: 580+ marks" },

      // ===== KERALA =====
      { name: "NIT Calicut", location: "Kozhikode", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Kerala", cutoff: "JEE Main: 92-97 percentile" },
      { name: "Government Medical College Trivandrum", location: "Thiruvananthapuram", fees: "₹15-30K/year", rating: "⭐⭐⭐⭐⭐", state: "Kerala", cutoff: "NEET: 570+ marks" },
      { name: "CET Trivandrum", location: "Thiruvananthapuram", fees: "₹40-60K/year", rating: "⭐⭐⭐⭐", state: "Kerala", cutoff: "KEAM: Top 3000 rank" },

      // ===== PUNJAB =====
      { name: "IIT Ropar", location: "Rupnagar", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Punjab", cutoff: "JEE Advanced: Rank 3000-8000" },
      { name: "NIT Jalandhar", location: "Jalandhar", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Punjab", cutoff: "JEE Main: 85-93 percentile" },
      { name: "Thapar University", location: "Patiala", fees: "₹3-4L/year", rating: "⭐⭐⭐⭐", state: "Punjab", cutoff: "JEE Main: 75-85 percentile" },
      { name: "Government Medical College Patiala", location: "Patiala", fees: "₹30-50K/year", rating: "⭐⭐⭐⭐", state: "Punjab", cutoff: "NEET: 540+ marks" },

      // ===== HARYANA =====
      { name: "NIT Kurukshetra", location: "Kurukshetra", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Haryana", cutoff: "JEE Main: 88-95 percentile" },
      { name: "PGIMS Rohtak", location: "Rohtak", fees: "₹40-60K/year", rating: "⭐⭐⭐⭐⭐", state: "Haryana", cutoff: "NEET: 560+ marks" },
      { name: "DCRUST Murthal", location: "Sonipat", fees: "₹80K-1.2L/year", rating: "⭐⭐⭐", state: "Haryana", cutoff: "JEE Main: 70-80 percentile" },

      // ===== JHARKHAND =====
      { name: "IIT (ISM) Dhanbad", location: "Dhanbad", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Jharkhand", cutoff: "JEE Advanced: Rank 2000-7000" },
      { name: "NIT Jamshedpur", location: "Jamshedpur", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Jharkhand", cutoff: "JEE Main: 85-93 percentile" },
      { name: "BIT Mesra Ranchi", location: "Ranchi", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐", state: "Jharkhand", cutoff: "JEE Main: 75-85 percentile" },
      { name: "RIMS Ranchi", location: "Ranchi", fees: "₹20-40K/year", rating: "⭐⭐⭐⭐", state: "Jharkhand", cutoff: "NEET: 530+ marks" },

      // ===== UTTARAKHAND =====
      { name: "IIT Roorkee", location: "Roorkee", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Uttarakhand", cutoff: "JEE Advanced: Rank 500-3500" },
      { name: "NIT Uttarakhand (NITUK)", location: "Srinagar, Uttarakhand", fees: "₹1.5L/year", rating: "⭐⭐⭐", state: "Uttarakhand", cutoff: "JEE Main: 75-85 percentile" },
      { name: "AIIMS Rishikesh", location: "Rishikesh", fees: "₹1,628/year", rating: "⭐⭐⭐⭐⭐", state: "Uttarakhand", cutoff: "NEET: 630+ marks" },

      // ===== ASSAM =====
      { name: "IIT Guwahati", location: "Guwahati", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Assam", cutoff: "JEE Advanced: Rank 1500-5000" },
      { name: "NIT Silchar", location: "Silchar", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Assam", cutoff: "JEE Main: 80-90 percentile" },
      { name: "Gauhati Medical College", location: "Guwahati", fees: "₹20-40K/year", rating: "⭐⭐⭐⭐", state: "Assam", cutoff: "NEET: 530+ marks" },

      // ===== ODISHA =====
      { name: "NIT Rourkela", location: "Rourkela", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Odisha", cutoff: "JEE Main: 90-96 percentile" },
      { name: "VSSUT Burla", location: "Sambalpur", fees: "₹50-80K/year", rating: "⭐⭐⭐⭐", state: "Odisha", cutoff: "JEE Main: 70-80 percentile" },
      { name: "SCB Medical College", location: "Cuttack", fees: "₹15-30K/year", rating: "⭐⭐⭐⭐", state: "Odisha", cutoff: "NEET: 540+ marks" },

      // ===== CHHATTISGARH =====
      { name: "NIT Raipur", location: "Raipur", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Chhattisgarh", cutoff: "JEE Main: 82-92 percentile" },
      { name: "Pt. Ravishankar Shukla University", location: "Raipur", fees: "₹15-30K/year", rating: "⭐⭐⭐", state: "Chhattisgarh", cutoff: "CG Pre-Engineering: Merit based" },
      { name: "AIIMS Raipur", location: "Raipur", fees: "₹1,628/year", rating: "⭐⭐⭐⭐⭐", state: "Chhattisgarh", cutoff: "NEET: 630+ marks" },

      // ===== ANDHRA PRADESH =====
      { name: "IIT Tirupati", location: "Tirupati", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Andhra Pradesh", cutoff: "JEE Advanced: Rank 3000-8000" },
      { name: "NIT Andhra Pradesh", location: "Tadepalligudem", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Andhra Pradesh", cutoff: "JEE Main: 80-90 percentile" },
      { name: "Andhra Medical College", location: "Visakhapatnam", fees: "₹20-40K/year", rating: "⭐⭐⭐⭐", state: "Andhra Pradesh", cutoff: "NEET: 540+ marks" },
      { name: "IIIT Sri City", location: "Chittoor", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐", state: "Andhra Pradesh", cutoff: "JEE Main: 85-95 percentile" },

      // ===== OTHER STATES =====
      { name: "IIT Mandi", location: "Mandi, Himachal Pradesh", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Other States", cutoff: "JEE Advanced: Rank 3000-9000" },
      { name: "NIT Hamirpur", location: "Hamirpur, HP", fees: "₹1.5L/year", rating: "⭐⭐⭐⭐", state: "Other States", cutoff: "JEE Main: 80-90 percentile" },
      { name: "IIT Bhubaneswar", location: "Bhubaneswar, Odisha", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Other States", cutoff: "JEE Advanced: Rank 3000-8000" },
      { name: "AIIMS Nagpur", location: "Nagpur, Maharashtra", fees: "₹1,628/year", rating: "⭐⭐⭐⭐⭐", state: "Other States", cutoff: "NEET: 630+ marks" },
      { name: "NIT Meghalaya", location: "Shillong", fees: "₹1.5L/year", rating: "⭐⭐⭐", state: "Other States", cutoff: "JEE Main: 70-80 percentile" },
      { name: "AIIMS Kalyani", location: "Kalyani, West Bengal", fees: "₹1,628/year", rating: "⭐⭐⭐⭐", state: "Other States", cutoff: "NEET: 620+ marks" },

      // ===== INTERNATIONAL =====
      { name: "MIT (Massachusetts Institute of Technology)", location: "Cambridge, USA 🇺🇸", fees: "$55,000/year (~₹45L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "SAT: 1550+ / Full profile based" },
      { name: "Stanford University", location: "California, USA 🇺🇸", fees: "$56,000/year (~₹46L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "SAT: 1500+ / Holistic admission" },
      { name: "University of Oxford", location: "Oxford, UK 🇬🇧", fees: "£28,000-39,000/year (~₹28-39L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "A-Levels: A*A*A / IELTS: 7.0+" },
      { name: "University of Cambridge", location: "Cambridge, UK 🇬🇧", fees: "£24,000-35,000/year (~₹24-35L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "A-Levels: A*A*A / Interview based" },
      { name: "ETH Zurich", location: "Zurich, Switzerland 🇨🇭", fees: "CHF 1,460/year (~₹1.3L) 🔥", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "Entrance exam / 12th: 85%+" },
      { name: "National University of Singapore (NUS)", location: "Singapore 🇸🇬", fees: "SGD 17,500/year (~₹10L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "SAT: 1450+ / 12th: 90%+" },
      { name: "University of Toronto", location: "Toronto, Canada 🇨🇦", fees: "CAD 55,000/year (~₹33L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "12th: 85%+ / IELTS: 6.5+" },
      { name: "TU Munich", location: "Munich, Germany 🇩🇪", fees: "€250/semester (~₹22K) 🔥🔥", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "12th: 80%+ / German proficiency" },
      { name: "University of Melbourne", location: "Melbourne, Australia 🇦🇺", fees: "AUD 40,000/year (~₹22L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "12th: 80%+ / IELTS: 6.5+" },
      { name: "KAIST (Korea)", location: "Daejeon, South Korea 🇰🇷", fees: "Free for intl students! 🔥🔥🔥", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "GPA based + research profile" },
    ],
    scholarships: [
      // Bihar
      { name: "🎓 Bihar State Merit Scholarship", amount: "₹10,000 - ₹25,000/year", eligibility: "Bihar domicile, 12th mein 80%+ marks, family income < ₹2.5 lakh", deadline: "October - December", link: "https://scholarships.gov.in", category: "Bihar" },
      { name: "🏛️ BCECE Fee Waiver", amount: "Full tuition fee waiver", eligibility: "Bihar domicile, BCECE rank holder, SC/ST/EWS", deadline: "At counselling", link: "https://bceceboard.bihar.gov.in", category: "Bihar" },
      { name: "👩 Bihar Mukhyamantri Kanya Utthan Yojana", amount: "₹25,000 - ₹50,000 (one-time)", eligibility: "Bihar ki ladkiyan, graduation complete, unmarried", deadline: "Throughout year", link: "https://ekalyan.bih.nic.in", category: "Bihar" },
      { name: "📚 Bihar SC/ST Post Matric Scholarship", amount: "Full fees + ₹2,500/month", eligibility: "Bihar SC/ST student, family income < ₹2.5 lakh", deadline: "August - November", link: "https://scholarships.gov.in", category: "Bihar" },
      { name: "🎯 Bihar Combined Merit Scholarship", amount: "₹15,000 - ₹30,000/year", eligibility: "Bihar Board topper / top 10 rankers", deadline: "After results", link: "https://scholarships.gov.in", category: "Bihar" },

      // UP
      { name: "📚 UP Post Matric Scholarship", amount: "₹12,000 - ₹30,000/year", eligibility: "UP domicile, SC/ST/OBC/Minority, family income < ₹2 lakh", deadline: "July - October", link: "https://scholarship.up.gov.in", category: "UP" },
      { name: "👩‍🎓 UP Kanya Vidya Dhan Yojana", amount: "₹30,000 (one-time)", eligibility: "UP ki ladkiyan, 12th pass with 60%+", deadline: "After 12th results", link: "https://scholarship.up.gov.in", category: "UP" },
      { name: "🏛️ UP Abhyudaya Yojana (Free Coaching)", amount: "Free IIT/NEET/UPSC coaching", eligibility: "UP domicile, economically weak students", deadline: "January - March", link: "https://abhyuday.up.gov.in", category: "UP" },

      // National
      { name: "🏆 INSPIRE Scholarship (DST)", amount: "₹80,000/year (5 years!)", eligibility: "Top 1% in 12th boards, BSc/Integrated MSc", deadline: "September - November", link: "https://online-inspire.gov.in", category: "National" },
      { name: "💡 Central Sector Scheme (MHRD)", amount: "₹10,000 - ₹20,000/year", eligibility: "12th mein top 20 percentile, family income < ₹8 lakh", deadline: "October - December", link: "https://scholarships.gov.in", category: "National" },
      { name: "🌟 NMMS (National Means Merit)", amount: "₹12,000/year (Class 9-12)", eligibility: "Class 8 clear, family income < ₹3.5 lakh", deadline: "August - October", link: "https://scholarships.gov.in", category: "National" },
      { name: "🔬 KVPY Fellowship", amount: "₹5,000 - ₹7,000/month + contingency", eligibility: "Class 11/12 science, KVPY exam qualify", deadline: "July - August", link: "https://kvpy.iisc.ac.in", category: "National" },
      { name: "📱 Pragati Scholarship (AICTE) — Girls", amount: "₹50,000/year", eligibility: "Girl student, engineering/diploma, family income < ₹8 lakh", deadline: "September - November", link: "https://www.aicte-india.org", category: "National" },
      { name: "🎓 PM Yasasvi Scholarship (OBC/EBC)", amount: "₹75,000 - ₹1,25,000/year", eligibility: "OBC/EBC/DNT students, Class 9-12", deadline: "July - September", link: "https://yet.nta.ac.in", category: "National" },
      { name: "🏛️ Kishore Vaigyanik Protsahan Yojana", amount: "₹5,000-7,000/month stipend", eligibility: "Science students Class 11 to BSc", deadline: "July-August", link: "https://kvpy.iisc.ac.in", category: "National" },

      // State-specific
      { name: "🏛️ Maharashtra Post Matric Scholarship", amount: "Full fees + maintenance", eligibility: "Maharashtra domicile, SC/ST/OBC", deadline: "October - December", link: "https://mahadbt.maharashtra.gov.in", category: "Maharashtra" },
      { name: "🌴 Kerala State Merit Scholarship", amount: "₹10,000 - ₹50,000/year", eligibility: "Kerala domicile, merit based, EWS", deadline: "August - October", link: "https://dcescholarship.kerala.gov.in", category: "Kerala" },
      { name: "🏙️ Karnataka Vidyasiri Scholarship", amount: "₹15,000 - ₹25,000/year", eligibility: "Karnataka domicile, SC/ST/OBC students", deadline: "September - November", link: "https://karepass.cgg.gov.in", category: "Karnataka" },
      { name: "🏙️ Tamil Nadu Govt Scholarship", amount: "₹12,000 - ₹24,000/year", eligibility: "TN domicile, BC/MBC/SC/ST students", deadline: "October - December", link: "https://www.tn.gov.in", category: "Tamil Nadu" },
      { name: "🏛️ Rajasthan Ambedkar Scholarship", amount: "₹15,000 - ₹25,000/year", eligibility: "Rajasthan SC/ST students, 60%+ marks", deadline: "September - November", link: "https://sje.rajasthan.gov.in", category: "Rajasthan" },
      { name: "🏛️ MP Post Matric Scholarship", amount: "Full fees + ₹2,000/month", eligibility: "MP domicile, SC/ST/OBC students", deadline: "August - October", link: "https://scholarshipportal.mp.nic.in", category: "Madhya Pradesh" },
      { name: "🏙️ Gujarat MYSY Scholarship", amount: "₹50,000 - ₹2,00,000/year", eligibility: "Gujarat Board 12th with 80%+, family income < ₹6 lakh", deadline: "After 12th results", link: "https://mysy.guj.nic.in", category: "Gujarat" },
      { name: "🏛️ West Bengal Swami Vivekananda Merit", amount: "₹5,000 - ₹10,000/year", eligibility: "WB domicile, 60%+ in 12th, family income < ₹2.5 lakh", deadline: "October - December", link: "https://svmcm.wbhed.gov.in", category: "West Bengal" },
      { name: "🏛️ Telangana ePass Scholarship", amount: "Full fees + maintenance", eligibility: "Telangana SC/ST/BC/EBC/Minority students", deadline: "September - November", link: "https://telanganaepass.cgg.gov.in", category: "Telangana" },
      { name: "🏛️ Punjab Post Matric Scholarship", amount: "₹10,000 - ₹25,000/year", eligibility: "Punjab SC students, family income < ₹2.5 lakh", deadline: "August - October", link: "https://scholarships.gov.in", category: "Punjab" },
      { name: "🏛️ Haryana Consolidated Stipend", amount: "₹8,000 - ₹12,000/year", eligibility: "Haryana SC students in professional courses", deadline: "September - November", link: "https://scholarships.gov.in", category: "Haryana" },
      { name: "🏛️ Jharkhand e-Kalyan Scholarship", amount: "₹15,000 - ₹36,000/year", eligibility: "Jharkhand SC/ST/OBC students, 60%+ marks", deadline: "September - November", link: "https://ekalyan.cgg.gov.in", category: "Jharkhand" },
      { name: "🏔️ Uttarakhand Post Matric Scholarship", amount: "₹10,000 - ₹20,000/year", eligibility: "Uttarakhand SC/ST students", deadline: "August - October", link: "https://scholarships.gov.in", category: "Uttarakhand" },
      { name: "🌿 Assam Pragyan Bharati Scholarship", amount: "₹10,000 - ₹20,000/year", eligibility: "Assam domicile, HS passed with 60%+", deadline: "October - December", link: "https://scholarships.gov.in", category: "Assam" },
      { name: "🏛️ Odisha Post Matric Scholarship", amount: "Full fees + ₹1,500/month", eligibility: "Odisha SC/ST students", deadline: "September - November", link: "https://scholarships.gov.in", category: "Odisha" },
      { name: "🏛️ AP Jagan Anna Vidya Deevena", amount: "Full fee reimbursement!", eligibility: "AP domicile, family income < ₹2.5 lakh", deadline: "At admission", link: "https://jnanabhumi.ap.gov.in", category: "Andhra Pradesh" },
      { name: "🏛️ Chhattisgarh Post Matric Scholarship", amount: "Full fees + maintenance", eligibility: "CG domicile, SC/ST/OBC students", deadline: "August - October", link: "https://scholarships.gov.in", category: "Chhattisgarh" },

      // International
      { name: "🌍 Fully Funded Germany (DAAD) Scholarship", amount: "€934/month + fees + travel", eligibility: "Bachelor's complete, excellent academics", deadline: "October - November (yearly)", link: "https://www.daad.de", category: "International" },
      { name: "🇬🇧 Chevening Scholarship (UK)", amount: "Full tuition + living + travel", eligibility: "2 years work experience, Master's in UK", deadline: "August - November", link: "https://www.chevening.org", category: "International" },
      { name: "🇺🇸 Fulbright Scholarship (USA)", amount: "Full tuition + stipend + travel", eligibility: "Indian citizens, Master's/PhD in USA", deadline: "February - May", link: "https://www.usief.org.in", category: "International" },
      { name: "🇦🇺 Australia Awards Scholarship", amount: "Full tuition + living + travel", eligibility: "Developing country citizens, Master's/PhD", deadline: "February - April", link: "https://www.dfat.gov.au/people-to-people/australia-awards", category: "International" },
      { name: "🇸🇬 Singapore Govt Scholarship (SINGA)", amount: "SGD 2,000/month + fees + travel", eligibility: "Science/Engineering PhD applicants", deadline: "January & August", link: "https://www.a-star.edu.sg/Scholarships/singa-award", category: "International" },
      { name: "🇯🇵 MEXT Scholarship (Japan)", amount: "Full tuition + ¥144,000/month + travel", eligibility: "Under 24, UG in Japan, exam based", deadline: "April - May", link: "https://www.studyinjapan.go.jp", category: "International" },
      { name: "🇰🇷 Korean Govt Scholarship (KGSP)", amount: "Full tuition + ₩900,000/month + travel", eligibility: "Under 25, UG in South Korea", deadline: "February - March", link: "https://www.studyinkorea.go.kr", category: "International" },
      { name: "🇨🇭 Swiss Govt Scholarship", amount: "Full tuition + CHF 1,920/month", eligibility: "Post-graduate/PhD in Switzerland", deadline: "August - November", link: "https://www.sbfi.admin.ch", category: "International" },
    ],
    youtubeChannels: [
      "📺 Physics Wallah (PW) — JEE/NEET complete free lectures",
      "📺 Unacademy Atoms — Short concept videos",
      "📺 Mohit Tyagi — Advanced Maths for JEE",
      "📺 NEET Simplified — Biology made easy",
      "📺 Vedantu JEE — Daily practice sessions",
      "📺 Apni Kaksha (Aman Dhattarwal) — JEE/NEET motivation + tips",
      "📺 Khan Sir Patna — Science GK easy language mein",
      "📺 Etoos Education — Chemistry ke liye best",
      "📺 ABJ Sir (Maths) — JEE Advanced level maths",
      "📺 Namo Kaul (Unacademy) — Physics fun way mein",
    ],
  },
  commerce: {
    stream: "Commerce",
    emoji: "📈",
    tagline: "Future ke business tycoon hain aap! 💼",
    description:
      "Aapka mindset practical hai, aap money aur market samajhte/samajhti hain, aur planning aapki strength hai. Commerce stream aapke liye best fit hai! CA, MBA, Banking, ya apna business — aapka path clear hai. Numbers aapke dost hain aur success aapki manzil!",
    careers: [
      "📊 Chartered Accountant (CA) - ₹7-25 LPA",
      "🏦 Investment Banker - ₹10-50 LPA",
      "📱 Digital Marketing Manager - ₹5-20 LPA",
      "🏢 MBA Graduate - ₹8-30 LPA",
      "💹 Stock Market Analyst - ₹6-25 LPA",
      "🏪 Entrepreneur - Unlimited! 🚀",
      "🏛️ Bank PO / Clerk - ₹4-8 LPA",
      "📋 Company Secretary (CS) - ₹5-15 LPA",
    ],
    modernCareers: [
      { title: "Digital Marketing", salary: "₹4-20 LPA", description: "Online brand grow karo", trend: "📱 Booming" },
      { title: "Startup Founder", salary: "Unlimited 🚀", description: "Apna business banao", trend: "🦄 Dream" },
      { title: "Stock Market Analyst", salary: "₹6-30 LPA", description: "Market trends analyse karo", trend: "📊 Stable" },
      { title: "Freelancer / Consultant", salary: "₹3-25 LPA", description: "Apne terms pe kaam karo", trend: "💻 Flexible" },
    ],
    nonAcademicCareers: NON_ACADEMIC_CAREERS_ALL_STREAMS,
    examsToPrepare: [
      "📊 CA Foundation — Chartered Accountant banna hai toh (Nov & May)",
      "🏛️ CLAT — Law colleges ke liye (May-June)",
      "📋 CS Foundation — Company Secretary ke liye",
      "🏦 Bank PO / SSC — Government jobs ke liye",
      "🎓 CUET — Central universities ke liye (May)",
      "💼 IPMAT — IIM Indore integrated MBA ke liye",
      "📝 SET / NPAT — Symbiosis / NMIMS entrance",
      "🏦 RBI Grade B — Reserve Bank officer ke liye",
    ],
    roadmap: [
      { month: "Month 1-2", task: "Accounts ki basics strong karein — Journal entry, Ledger, Trial Balance samjhein. Tally software install karein aur basic entries seekhein. Business news daily padhein (Moneycontrol, Economic Times)." },
      { month: "Month 3-4", task: "CA Foundation ya CLAT prep start karein (aapke goal ke hisaab se). Economics ka micro/macro concept clear karein. Stock market basics seekhein — Zerodha Varsity free hai!" },
      { month: "Month 5-6", task: "Mock tests dena shuru karein. Group discussions practice karein friends ke saath. LinkedIn profile banayein aur professionals ko follow karein." },
      { month: "Month 7-8", task: "Internship opportunities dhundhein — local CA firm, bank, ya startup mein. Real-world experience bohot important hai. Excel/Sheets advanced seekhein." },
      { month: "Month 9-10", task: "College research karein — SRCC, Christ, Symbiosis, BHU Commerce. Entrance exam forms bharein (CUET, IPMAT). Interview prep shuru karein." },
      { month: "Month 11-12", task: "Final revision aur exam prep. Portfolio ready karein (achievements, certificates, internship proof). Application deadlines mat miss karein! 🎯" },
    ],
    colleges: [
      // ===== BIHAR =====
      { name: "Patna University (Commerce)", location: "Patna, Bihar", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "Bihar Board: 70%+ marks" },
      { name: "Chandragupt Institute of Management (CIMP)", location: "Patna, Bihar", fees: "₹4-5L/2 years", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "CAT: 80+ percentile" },
      { name: "Magadh University", location: "Bodh Gaya, Bihar", fees: "₹5-10K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Merit based: 55%+" },
      { name: "Nalanda Open University", location: "Patna, Bihar", fees: "₹3-8K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Open admission" },
      { name: "IIM Bodh Gaya", location: "Bodh Gaya, Bihar", fees: "₹12-15L/2 years", rating: "⭐⭐⭐⭐⭐", state: "Bihar", cutoff: "CAT: 90+ percentile" },
      { name: "AN College Patna", location: "Patna, Bihar", fees: "₹8-12K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Bihar Board: 65%+" },
      { name: "BN College Patna", location: "Patna, Bihar", fees: "₹5-10K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Bihar Board: 60%+", collegeType: "government", admissionType: "merit" },
      { name: "Government Commerce College", location: "Patna, Bihar", fees: "₹5-15K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Bihar Board: 55%+", collegeType: "government", courseDuration: "3 years", admissionType: "merit" },
      { name: "District Commerce College", location: "Patna, Bihar", fees: "₹4-10K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Merit: 50%+", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },

      // ===== UP =====
      { name: "BHU Commerce Faculty", location: "Varanasi, UP", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "CUET: 85-95 percentile" },
      { name: "Lucknow University", location: "Lucknow, UP", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐", state: "UP", cutoff: "CUET: 75-85 percentile" },
      { name: "AMU Commerce Dept", location: "Aligarh, UP", fees: "₹15-30K/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "AMU Entrance: 65%+" },
      { name: "Allahabad University", location: "Prayagraj, UP", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐", state: "UP", cutoff: "CUET: 70-80 percentile" },
      { name: "IIM Lucknow", location: "Lucknow, UP", fees: "₹19-22L/2 years", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "CAT: 97+ percentile", collegeType: "top", courseDuration: "2 years", admissionType: "entrance" },
      { name: "Government Commerce College", location: "Lucknow, UP", fees: "₹5-15K/year", rating: "⭐⭐⭐", state: "UP", cutoff: "UP Board merit: 55%+", collegeType: "government", courseDuration: "3 years", admissionType: "merit" },
      { name: "District Commerce College", location: "Lucknow, UP", fees: "₹4-12K/year", rating: "⭐⭐⭐", state: "UP", cutoff: "Merit: 50%+", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },

      // ===== DELHI =====
      { name: "SRCC Delhi", location: "New Delhi", fees: "₹30-40K/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "CUET: 98-99+ percentile" },
      { name: "Hindu College Delhi", location: "New Delhi", fees: "₹20-30K/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "CUET: 95-98 percentile" },
      { name: "Hansraj College Delhi", location: "New Delhi", fees: "₹20-30K/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "CUET: 93-97 percentile" },
      { name: "Lady Shri Ram College (LSR)", location: "New Delhi", fees: "₹20-30K/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "CUET: 95-98 percentile" },
      { name: "IIM Delhi (FMS)", location: "New Delhi", fees: "₹2L/2 years 🔥", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "CAT: 98+ percentile", collegeType: "top", courseDuration: "2 years", admissionType: "entrance" },
      { name: "Government Commerce College", location: "New Delhi", fees: "₹8-18K/year", rating: "⭐⭐⭐", state: "Delhi", cutoff: "Merit: 60%+ / CUET", collegeType: "government", courseDuration: "3 years", admissionType: "merit" },
      { name: "District Commerce College", location: "New Delhi", fees: "₹5-14K/year", rating: "⭐⭐⭐", state: "Delhi", cutoff: "Merit: 50%+", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },

      // ===== MAHARASHTRA =====
      { name: "St. Xavier's Mumbai", location: "Mumbai", fees: "₹15-25K/year", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "12th: 85%+ / Entrance" },
      { name: "HR College Mumbai", location: "Mumbai", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐", state: "Maharashtra", cutoff: "12th: 80%+ marks" },
      { name: "Symbiosis Pune (SIC)", location: "Pune", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐", state: "Maharashtra", cutoff: "SET: 100+ marks" },
      { name: "NMIMS Mumbai", location: "Mumbai", fees: "₹4-6L/year", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "NPAT: 100+ marks" },
      { name: "IIM Mumbai (Jamnalal Bajaj)", location: "Mumbai", fees: "₹12-15L/2 years", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "CAT: 95+ percentile", collegeType: "top", courseDuration: "2 years", admissionType: "entrance" },
      { name: "Government Commerce College", location: "Mumbai, Maharashtra", fees: "₹8-20K/year", rating: "⭐⭐⭐", state: "Maharashtra", cutoff: "12th: 55%+ merit", collegeType: "government", courseDuration: "3 years", admissionType: "merit" },
      { name: "District Commerce College", location: "Mumbai, Maharashtra", fees: "₹6-15K/year", rating: "⭐⭐⭐", state: "Maharashtra", cutoff: "Merit: 50%+", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },

      // ===== KARNATAKA =====
      { name: "Christ University Bangalore", location: "Bangalore", fees: "₹1-2L/year", rating: "⭐⭐⭐⭐⭐", state: "Karnataka", cutoff: "Christ Entrance: 60%+" },
      { name: "Jain University Bangalore", location: "Bangalore", fees: "₹1.5-3L/year", rating: "⭐⭐⭐⭐", state: "Karnataka", cutoff: "12th: 65%+ / Entrance" },
      { name: "IIM Bangalore", location: "Bangalore", fees: "₹23-25L/2 years", rating: "⭐⭐⭐⭐⭐", state: "Karnataka", cutoff: "CAT: 99+ percentile" },

      // ===== TAMIL NADU =====
      { name: "Loyola College Chennai", location: "Chennai", fees: "₹15-25K/year", rating: "⭐⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "12th: 85%+ marks" },
      { name: "Madras Christian College", location: "Chennai", fees: "₹20-40K/year", rating: "⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "12th: 75%+ marks" },
      { name: "SRM University Commerce", location: "Chennai", fees: "₹1-2L/year", rating: "⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "12th: 60%+ / Entrance" },

      // ===== WEST BENGAL =====
      { name: "St. Xavier's College Kolkata", location: "Kolkata", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "12th: 85%+ / Entrance" },
      { name: "Presidency University Kolkata", location: "Kolkata", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "Entrance exam merit" },
      { name: "IIM Calcutta", location: "Kolkata", fees: "₹27-30L/2 years", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "CAT: 99+ percentile" },

      // ===== RAJASTHAN =====
      { name: "University of Rajasthan", location: "Jaipur", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐", state: "Rajasthan", cutoff: "Merit based: 65%+" },
      { name: "IIM Udaipur", location: "Udaipur", fees: "₹16-18L/2 years", rating: "⭐⭐⭐⭐⭐", state: "Rajasthan", cutoff: "CAT: 90+ percentile" },

      // ===== OTHER STATES =====
      { name: "IIM Ahmedabad", location: "Ahmedabad, Gujarat", fees: "₹23-25L/2 years", rating: "⭐⭐⭐⭐⭐", state: "Gujarat", cutoff: "CAT: 99+ percentile" },
      { name: "XLRI Jamshedpur", location: "Jamshedpur, Jharkhand", fees: "₹25-28L/2 years", rating: "⭐⭐⭐⭐⭐", state: "Jharkhand", cutoff: "XAT: 95+ percentile" },
      { name: "Narsee Monjee (NMIMS) Hyderabad", location: "Hyderabad", fees: "₹4-6L/year", rating: "⭐⭐⭐⭐", state: "Telangana", cutoff: "NPAT: 90+ marks" },
      { name: "Osmania University Commerce", location: "Hyderabad", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐", state: "Telangana", cutoff: "TS EAMCET/Merit: 65%+" },
      { name: "Panjab University Commerce", location: "Chandigarh", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐", state: "Punjab", cutoff: "Merit: 70%+" },
      { name: "MDI Gurgaon", location: "Gurgaon, Haryana", fees: "₹22-25L/2 years", rating: "⭐⭐⭐⭐⭐", state: "Haryana", cutoff: "CAT: 95+ percentile" },

      // ===== INTERNATIONAL =====
      { name: "London School of Economics (LSE)", location: "London, UK 🇬🇧", fees: "£23,000-30,000/year (~₹23-30L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "A-Levels: A*AA / IELTS: 7.0+" },
      { name: "Harvard Business School (HBS)", location: "Boston, USA 🇺🇸", fees: "$73,000/year (~₹60L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "GMAT: 730+ / Work experience" },
      { name: "Wharton School (UPenn)", location: "Philadelphia, USA 🇺🇸", fees: "$56,000/year (~₹46L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "SAT: 1500+ / Holistic admission" },
      { name: "INSEAD", location: "Fontainebleau, France 🇫🇷", fees: "€95,000/program (~₹85L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "GMAT: 700+ / 4+ years work exp" },
      { name: "NUS Business School", location: "Singapore 🇸🇬", fees: "SGD 20,000/year (~₹12L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "SAT: 1400+ / 12th: 85%+" },
      { name: "University of Toronto (Rotman)", location: "Toronto, Canada 🇨🇦", fees: "CAD 50,000/year (~₹30L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "12th: 85%+ / IELTS: 7.0+" },
      { name: "Mannheim Business School", location: "Mannheim, Germany 🇩🇪", fees: "€500/semester (~₹45K) 🔥", rating: "⭐⭐⭐⭐", state: "International", cutoff: "12th: 80%+ / German proficiency" },
      { name: "Yonsei University", location: "Seoul, South Korea 🇰🇷", fees: "₹5-8L/year (scholarships available!)", rating: "⭐⭐⭐⭐", state: "International", cutoff: "GPA + interview based" },
    ],
    scholarships: [
      // Bihar
      { name: "🎓 Bihar State Merit Scholarship", amount: "₹10,000 - ₹25,000/year", eligibility: "Bihar domicile, 12th mein 80%+ marks, family income < ₹2.5 lakh", deadline: "October - December", link: "https://scholarships.gov.in", category: "Bihar" },
      { name: "🏛️ Bihar SC/ST Post Matric Scholarship", amount: "Full fees + ₹2,500/month", eligibility: "Bihar SC/ST student, family income < ₹2.5 lakh", deadline: "August - November", link: "https://scholarships.gov.in", category: "Bihar" },
      { name: "👩 Bihar Mukhyamantri Kanya Utthan", amount: "₹25,000 - ₹50,000 (one-time)", eligibility: "Bihar ki ladkiyan, graduation complete", deadline: "Throughout year", link: "https://ekalyan.bih.nic.in", category: "Bihar" },

      // UP
      { name: "📚 UP Post Matric Scholarship", amount: "₹12,000 - ₹30,000/year", eligibility: "UP domicile, SC/ST/OBC/Minority, family income < ₹2 lakh", deadline: "July - October", link: "https://scholarship.up.gov.in", category: "UP" },
      { name: "👩‍🎓 UP Kanya Vidya Dhan", amount: "₹30,000 (one-time)", eligibility: "UP ki ladkiyan, 12th pass with 60%+", deadline: "After 12th results", link: "https://scholarship.up.gov.in", category: "UP" },

      // National
      { name: "💼 ICAI Scholarship (CA students)", amount: "₹20,000 - ₹50,000/year", eligibility: "CA Foundation/Inter clear, merit based", deadline: "After CA results", link: "https://www.icai.org", category: "National" },
      { name: "💡 Central Sector Scheme (MHRD)", amount: "₹10,000 - ₹20,000/year", eligibility: "12th top 20 percentile, family income < ₹8 lakh", deadline: "October - December", link: "https://scholarships.gov.in", category: "National" },
      { name: "🌟 Sitaram Jindal Foundation", amount: "₹6,000 - ₹18,000/year", eligibility: "Any UG student, family income < ₹2.5 lakh, 60%+", deadline: "March - June", link: "https://www.sitaramjindalfoundation.org", category: "National" },
      { name: "📱 Pragati Scholarship (AICTE) — Girls", amount: "₹50,000/year", eligibility: "Girl student, management course, family income < ₹8 lakh", deadline: "September - November", link: "https://www.aicte-india.org", category: "National" },
      { name: "🏛️ PM Yasasvi Scholarship (OBC/EBC)", amount: "₹75,000 - ₹1,25,000/year", eligibility: "OBC/EBC/DNT students", deadline: "July - September", link: "https://yet.nta.ac.in", category: "National" },

      // State-specific
      { name: "🏙️ Maharashtra Rajarshi Shahu Scholarship", amount: "Full fees + maintenance", eligibility: "Maharashtra OBC students", deadline: "October - December", link: "https://mahadbt.maharashtra.gov.in", category: "Maharashtra" },
      { name: "🏙️ Karnataka Fee Concession", amount: "Full fee concession", eligibility: "Karnataka SC/ST/OBC students", deadline: "At admission", link: "https://karepass.cgg.gov.in", category: "Karnataka" },
      { name: "🏛️ Rajasthan Devnarayan Scholarship", amount: "₹10,000 - ₹20,000/year", eligibility: "Rajasthan OBC students, 50%+ marks", deadline: "September - November", link: "https://sje.rajasthan.gov.in", category: "Rajasthan" },
      { name: "🏙️ Gujarat MYSY Scholarship", amount: "₹50,000 - ₹2,00,000/year", eligibility: "Gujarat 12th with 80%+, family income < ₹6 lakh", deadline: "After results", link: "https://mysy.guj.nic.in", category: "Gujarat" },
      { name: "🏛️ WB Swami Vivekananda Merit", amount: "₹5,000 - ₹10,000/year", eligibility: "WB domicile, 60%+ marks", deadline: "October - December", link: "https://svmcm.wbhed.gov.in", category: "West Bengal" },
      { name: "🏛️ Telangana ePass", amount: "Full fees + maintenance", eligibility: "Telangana SC/ST/BC students", deadline: "September - November", link: "https://telanganaepass.cgg.gov.in", category: "Telangana" },

      // International
      { name: "🌍 DAAD Scholarship (Germany)", amount: "€934/month + fees + travel", eligibility: "Excellent academics, Master's/PhD", deadline: "October - November", link: "https://www.daad.de", category: "International" },
      { name: "🇬🇧 Commonwealth Scholarship (UK)", amount: "Full tuition + living + travel", eligibility: "Developing country citizens", deadline: "October - December", link: "https://cscuk.fcdo.gov.uk", category: "International" },
      { name: "🇺🇸 Fulbright Scholarship (USA)", amount: "Full tuition + stipend + travel", eligibility: "Indian citizens, Master's/PhD", deadline: "February - May", link: "https://www.usief.org.in", category: "International" },
      { name: "🇸🇬 NUS/NTU Scholarship (Singapore)", amount: "Full tuition + living allowance", eligibility: "Top 5% students, entrance exam", deadline: "January - March", link: "https://www.nus.edu.sg", category: "International" },
      { name: "🇯🇵 MEXT Scholarship (Japan)", amount: "Full tuition + ¥144,000/month", eligibility: "Under 24, UG in Japan", deadline: "April - May", link: "https://www.studyinjapan.go.jp", category: "International" },
    ],
    youtubeChannels: [
      "📺 CA Wallah by PW — CA Foundation free lectures",
      "📺 Zerodha Varsity — Stock market basics",
      "📺 Rachit Jain — CA journey tips aur motivation",
      "📺 Economics on Your Tips — Eco concepts easy mein",
      "📺 Guru Accounting — Accounts solved step by step",
      "📺 Aman Dhattarwal — Career guidance + commerce tips",
      "📺 Pranjal Kamra — Stock market investing for beginners",
      "📺 Labour Law Advisor — Business laws simple mein",
      "📺 CA Intermediate by Unacademy — Free CA prep",
      "📺 Finance With Sharan — Personal finance for students",
    ],
  },
  arts: {
    stream: "Arts",
    emoji: "🎨",
    tagline: "Creative genius spotted! 🌟",
    description:
      "Aap creative hain, out-of-the-box sochte/sochti hain, aur duniya ko apne unique perspective se dekhte/dekhti hain. Arts stream aapke liye perfect match hai! Law, Design, Journalism, ya Teaching — bohot saare amazing career paths hain. Aapki creativity aapki superpower hai!",
    careers: [
      "⚖️ Lawyer (LLB) - ₹5-30 LPA",
      "🎨 UX/UI Designer - ₹6-25 LPA",
      "📰 Journalist / Content Creator - ₹4-15 LPA",
      "🎬 Film Director / Producer - ₹5-50 LPA",
      "📖 Professor / Teacher - ₹4-12 LPA",
      "🏛️ IAS/IPS Officer - ₹8-15 LPA + perks",
      "🎭 Theatre / Performing Arts - ₹3-20 LPA",
      "📝 Civil Services (BPSC/UPPSC) - ₹6-12 LPA + perks",
    ],
    modernCareers: [
      { title: "Content Creator / YouTuber", salary: "₹2-50 LPA", description: "Audience build karo", trend: "🎬 Exploding" },
      { title: "UX/UI Designer", salary: "₹5-25 LPA", description: "Apps aur websites design karo", trend: "🎨 In demand" },
      { title: "Social Media Manager", salary: "₹3-15 LPA", description: "Brand ki online presence manage karo", trend: "📲 Growing" },
      { title: "Podcast / Audio Creator", salary: "₹2-20 LPA", description: "Voice content create karo", trend: "🎙️ New" },
    ],
    nonAcademicCareers: NON_ACADEMIC_CAREERS_ALL_STREAMS,
    examsToPrepare: [
      "⚖️ CLAT — Top law colleges ke liye (May-June)",
      "🏛️ UPSC / BPSC / UPPSC — Civil services ke liye",
      "🎨 NID / NIFT Entrance — Design colleges ke liye",
      "🎓 CUET — Central university admissions ke liye",
      "📰 IIMC Entrance — Journalism ke liye",
      "📝 UGC NET — Professor banna hai toh (June & Dec)",
      "⚖️ AILET — NLU Delhi entrance",
      "🎨 UCEED — IIT Design entrance",
    ],
    roadmap: [
      { month: "Month 1-2", task: "Apna main interest identify karein — Law, Civil Services, Design, Writing, Teaching? Ek choose karein aur uspe focus karein. Daily newspaper padhein (Dainik Jagran + The Hindu)." },
      { month: "Month 3-4", task: "CLAT/NID/NIFT prep start karein (goal ke hisaab se). GK aur current affairs strong karein. Creative portfolio banana shuru karein (writing samples, artwork, etc)." },
      { month: "Month 5-6", task: "Essay writing practice karein — har week 2-3 essays likhein. Debate competitions mein participate karein. Public speaking improve karein (school events, YouTube pe record karein)." },
      { month: "Month 7-8", task: "Internship try karein — local newspaper, NGO, design studio, law firm mein. Real experience bohot zaroori hai. Blog ya Instagram page start karein apne work ke liye." },
      { month: "Month 9-10", task: "College applications prepare karein — BHU Arts, JNU, AMU, NLU. Entrance exam forms bharein. Interview aur GD practice karein." },
      { month: "Month 11-12", task: "Final revision for entrance exams. Portfolio polish karein. Application submit karein. Backup options bhi ready rakhein. Aap kar lenge — vishwas rakhein! 🔥" },
    ],
    colleges: [
      // ===== BIHAR =====
      { name: "Patna University (Arts)", location: "Patna, Bihar", fees: "₹3-10K/year", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "Bihar Board: 65%+ marks" },
      { name: "Chanakya National Law University", location: "Patna, Bihar", fees: "₹1.5-2L/year", rating: "⭐⭐⭐⭐⭐", state: "Bihar", cutoff: "CLAT: Rank 500-2000" },
      { name: "Patna Women's College", location: "Patna, Bihar", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐", state: "Bihar", cutoff: "Merit: 60%+" },
      { name: "AN Sinha Institute", location: "Patna, Bihar", fees: "₹5-15K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Merit based" },
      { name: "Magadh University", location: "Bodh Gaya, Bihar", fees: "₹3-8K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Merit: 55%+" },
      { name: "Nalanda University", location: "Rajgir, Bihar", fees: "₹1-2L/year (scholarships available)", rating: "⭐⭐⭐⭐⭐", state: "Bihar", cutoff: "Application + Interview", collegeType: "top", courseDuration: "2-5 years", admissionType: "entrance" },
      { name: "Government Arts College", location: "Patna, Bihar", fees: "₹4-12K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Merit: 55%+", collegeType: "government", courseDuration: "3 years", admissionType: "merit" },
      { name: "District College (Arts)", location: "Patna, Bihar", fees: "₹3-8K/year", rating: "⭐⭐⭐", state: "Bihar", cutoff: "Merit: 50%+", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },

      // ===== UP =====
      { name: "BHU Arts Faculty", location: "Varanasi, UP", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "CUET: 80-90 percentile" },
      { name: "AMU (Aligarh Muslim University)", location: "Aligarh, UP", fees: "₹10-25K/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "AMU Entrance: 60%+" },
      { name: "Lucknow University", location: "Lucknow, UP", fees: "₹8-20K/year", rating: "⭐⭐⭐⭐", state: "UP", cutoff: "CUET: 70-80 percentile" },
      { name: "Allahabad University", location: "Prayagraj, UP", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐", state: "UP", cutoff: "CUET: 70-80 percentile" },
      { name: "RMLNLU Lucknow (Law)", location: "Lucknow, UP", fees: "₹1.5-2L/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "CLAT: Rank 1000-3000", collegeType: "top", courseDuration: "5 years", admissionType: "entrance" },
      { name: "Government Arts College", location: "Lucknow, UP", fees: "₹5-14K/year", rating: "⭐⭐⭐", state: "UP", cutoff: "Merit: 55%+", collegeType: "government", courseDuration: "3 years", admissionType: "merit" },
      { name: "District College (Arts)", location: "Prayagraj, UP", fees: "₹4-10K/year", rating: "⭐⭐⭐", state: "UP", cutoff: "Merit: 50%+", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },

      // ===== DELHI =====
      { name: "JNU Delhi", location: "New Delhi", fees: "₹500/year 🔥", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "CUET: 90+ percentile" },
      { name: "Delhi University (Arts)", location: "New Delhi", fees: "₹10-30K/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "CUET: 90-98 percentile" },
      { name: "NLU Delhi", location: "New Delhi", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "AILET: Top 100 rank" },
      { name: "Jamia Millia Islamia", location: "New Delhi", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "JMI Entrance: 65%+" },
      { name: "IIMC (Journalism)", location: "New Delhi", fees: "₹50-80K/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "IIMC Entrance: Top 50 rank" },
      { name: "NID Delhi (Design)", location: "New Delhi", fees: "₹3-4L/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "NID DAT: Top 200 rank", collegeType: "top", courseDuration: "4 years", admissionType: "entrance" },
      { name: "Government Arts College", location: "New Delhi", fees: "₹6-15K/year", rating: "⭐⭐⭐", state: "Delhi", cutoff: "Merit / CUET", collegeType: "government", courseDuration: "3 years", admissionType: "merit" },
      { name: "District College (Arts)", location: "New Delhi", fees: "₹5-12K/year", rating: "⭐⭐⭐", state: "Delhi", cutoff: "Merit: 55%+", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },

      // ===== MAHARASHTRA =====
      { name: "TISS Mumbai", location: "Mumbai", fees: "₹60-80K/year", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "TISSNET: Top 500 rank" },
      { name: "ILS Law College Pune", location: "Pune", fees: "₹30-50K/year", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "CLAT/MH-CET Law: Merit based" },
      { name: "Symbiosis Law School", location: "Pune", fees: "₹3-4L/year", rating: "⭐⭐⭐⭐", state: "Maharashtra", cutoff: "SLAT: Top 300 rank" },
      { name: "FTII Pune (Film)", location: "Pune", fees: "₹1-2L/year", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "FTII Entrance: Highly competitive", collegeType: "top", courseDuration: "3 years", admissionType: "entrance" },
      { name: "Government Arts College", location: "Mumbai, Maharashtra", fees: "₹7-18K/year", rating: "⭐⭐⭐", state: "Maharashtra", cutoff: "12th merit: 55%+", collegeType: "government", courseDuration: "3 years", admissionType: "merit" },
      { name: "District College (Arts)", location: "Pune, Maharashtra", fees: "₹6-14K/year", rating: "⭐⭐⭐", state: "Maharashtra", cutoff: "Merit: 50%+", collegeType: "local", courseDuration: "3 years", admissionType: "merit" },

      // ===== KARNATAKA =====
      { name: "NLSIU Bangalore (Law)", location: "Bangalore", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐⭐", state: "Karnataka", cutoff: "CLAT: Rank 1-100 (Top NLU!)" },
      { name: "Christ University (Arts)", location: "Bangalore", fees: "₹1-2L/year", rating: "⭐⭐⭐⭐⭐", state: "Karnataka", cutoff: "Christ Entrance: 60%+" },
      { name: "Srishti Manipal (Design)", location: "Bangalore", fees: "₹4-6L/year", rating: "⭐⭐⭐⭐", state: "Karnataka", cutoff: "Srishti Entrance: Portfolio based" },

      // ===== TAMIL NADU =====
      { name: "Madras University", location: "Chennai", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "Merit based: 70%+" },
      { name: "NLU Tamil Nadu (TNNLS)", location: "Tiruchirappalli", fees: "₹1.5-2L/year", rating: "⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "CLAT: Rank 1500-3000" },
      { name: "Asian College of Journalism", location: "Chennai", fees: "₹3-4L/year", rating: "⭐⭐⭐⭐⭐", state: "Tamil Nadu", cutoff: "ACJ Entrance: Competitive" },

      // ===== WEST BENGAL =====
      { name: "Jadavpur University (Arts)", location: "Kolkata", fees: "₹5-10K/year", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "WBJEE/Merit: 75%+" },
      { name: "Presidency University Kolkata", location: "Kolkata", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "Entrance exam merit" },
      { name: "NUJS Kolkata (Law)", location: "Kolkata", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "CLAT: Rank 100-500" },
      { name: "Visva-Bharati Shantiniketan", location: "Bolpur", fees: "₹3-8K/year 🔥", rating: "⭐⭐⭐⭐⭐", state: "West Bengal", cutoff: "Entrance: 60%+" },

      // ===== RAJASTHAN =====
      { name: "NLU Jodhpur", location: "Jodhpur", fees: "₹1.5-2L/year", rating: "⭐⭐⭐⭐⭐", state: "Rajasthan", cutoff: "CLAT: Rank 200-1000" },
      { name: "University of Rajasthan", location: "Jaipur", fees: "₹3-10K/year", rating: "⭐⭐⭐⭐", state: "Rajasthan", cutoff: "Merit based: 60%+" },
      { name: "NID Ahmedabad (satellite campus)", location: "Jodhpur", fees: "₹3-4L/year", rating: "⭐⭐⭐⭐⭐", state: "Rajasthan", cutoff: "NID DAT: Top 200 rank" },

      // ===== OTHER STATES =====
      { name: "Ashoka University", location: "Sonipat, Haryana", fees: "₹5-6L/year", rating: "⭐⭐⭐⭐⭐", state: "Haryana", cutoff: "Application + Interview" },
      { name: "NIFT Hyderabad (Fashion)", location: "Hyderabad", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐⭐", state: "Telangana", cutoff: "NIFT Entrance: Top 500" },
      { name: "NID Ahmedabad (Design)", location: "Ahmedabad, Gujarat", fees: "₹3-4L/year", rating: "⭐⭐⭐⭐⭐", state: "Gujarat", cutoff: "NID DAT: Top 100 rank" },
      { name: "Hyderabad Central University", location: "Hyderabad", fees: "₹5-15K/year", rating: "⭐⭐⭐⭐⭐", state: "Telangana", cutoff: "CUET: 80+ percentile" },
      { name: "NLUJA Assam", location: "Guwahati", fees: "₹1.5-2L/year", rating: "⭐⭐⭐⭐", state: "Assam", cutoff: "CLAT: Rank 1500-3000" },
      { name: "English & Foreign Languages University", location: "Hyderabad", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐⭐", state: "Telangana", cutoff: "EFLU Entrance: Merit" },

      // ===== INTERNATIONAL =====
      { name: "University of Oxford", location: "Oxford, UK 🇬🇧", fees: "£28,000-39,000/year (~₹28-39L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "A-Levels: A*A*A / Personal statement" },
      { name: "Harvard University", location: "Cambridge, USA 🇺🇸", fees: "$55,000/year (~₹45L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "SAT: 1500+ / Holistic admission" },
      { name: "Sciences Po Paris", location: "Paris, France 🇫🇷", fees: "€0-14,000/year (income-based!)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "Application + Interview" },
      { name: "Yale University", location: "New Haven, USA 🇺🇸", fees: "$59,000/year (~₹49L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "SAT: 1500+ / Need-blind admission" },
      { name: "University of Amsterdam", location: "Amsterdam, Netherlands 🇳🇱", fees: "€2,200/year (EU) / €11,000 (non-EU)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "12th: 80%+ / IELTS: 6.5+" },
      { name: "Freie Universität Berlin", location: "Berlin, Germany 🇩🇪", fees: "€300/semester (~₹27K) 🔥🔥", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "12th: 80%+ / German proficiency" },
      { name: "University of Melbourne (Arts)", location: "Melbourne, Australia 🇦🇺", fees: "AUD 35,000/year (~₹19L)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "12th: 78%+ / IELTS: 6.5+" },
      { name: "Seoul National University", location: "Seoul, South Korea 🇰🇷", fees: "₹3-5L/year (scholarships available!)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "GPA + TOPIK + Interview" },
    ],
    scholarships: [
      // Bihar
      { name: "🎓 Bihar State Merit Scholarship", amount: "₹10,000 - ₹25,000/year", eligibility: "Bihar domicile, 12th 80%+, family income < ₹2.5 lakh", deadline: "October - December", link: "https://scholarships.gov.in", category: "Bihar" },
      { name: "📝 BPSC Scholarship for SC/ST", amount: "₹15,000 - ₹25,000/year", eligibility: "Bihar SC/ST students, graduation mein enrolled", deadline: "October - December", link: "https://bceceboard.bihar.gov.in", category: "Bihar" },
      { name: "👩 Bihar Mukhyamantri Kanya Utthan Yojana", amount: "₹25,000 - ₹50,000 (one-time for graduation)", eligibility: "Bihar ki ladkiyan, graduation complete", deadline: "Throughout year", link: "https://ekalyan.bih.nic.in", category: "Bihar" },
      { name: "🏛️ Bihar SC/ST Post Matric Scholarship", amount: "Full fees + ₹2,500/month", eligibility: "Bihar SC/ST student, family income < ₹2.5 lakh", deadline: "August - November", link: "https://scholarships.gov.in", category: "Bihar" },

      // UP
      { name: "📚 UP Post Matric Scholarship", amount: "₹12,000 - ₹30,000/year", eligibility: "UP domicile, SC/ST/OBC/Minority, family income < ₹2 lakh", deadline: "July - October", link: "https://scholarship.up.gov.in", category: "UP" },
      { name: "👩‍🎓 UP Kanya Vidya Dhan", amount: "₹30,000 (one-time)", eligibility: "UP ki ladkiyan, 12th pass with 60%+", deadline: "After 12th results", link: "https://scholarship.up.gov.in", category: "UP" },

      // National
      { name: "💡 Central Sector Scheme (MHRD)", amount: "₹10,000 - ₹20,000/year", eligibility: "12th top 20 percentile, family income < ₹8 lakh", deadline: "October - December", link: "https://scholarships.gov.in", category: "National" },
      { name: "🌟 Maulana Azad National Fellowship", amount: "₹25,000 - ₹28,000/month!", eligibility: "Minority community, PG/PhD, NET qualified", deadline: "March - April", link: "https://scholarships.gov.in", category: "National" },
      { name: "⚖️ CLAT Fee Waiver", amount: "Full fee waiver at NLUs", eligibility: "SC/ST/Disabled/BPL, CLAT qualified", deadline: "At counselling", link: "https://consortiumofnlus.ac.in", category: "National" },
      { name: "📱 Begum Hazrat Mahal Scholarship (Girls)", amount: "₹5,000 - ₹6,000/year", eligibility: "Minority girl students, Class 9-12", deadline: "September - November", link: "https://bhmnsmaef.org", category: "National" },
      { name: "🏛️ PM Yasasvi Scholarship (OBC/EBC)", amount: "₹75,000 - ₹1,25,000/year", eligibility: "OBC/EBC/DNT students", deadline: "July - September", link: "https://yet.nta.ac.in", category: "National" },
      { name: "🎨 NIFT Scholarship / Fee Waiver", amount: "Full fee waiver", eligibility: "NIFT students, SC/ST/PwD category", deadline: "At admission", link: "https://nift.ac.in", category: "National" },

      // State-specific
      { name: "🏙️ Maharashtra Post Matric Scholarship", amount: "Full fees + maintenance", eligibility: "Maharashtra SC/ST/OBC students", deadline: "October - December", link: "https://mahadbt.maharashtra.gov.in", category: "Maharashtra" },
      { name: "🌴 Kerala State Merit Scholarship", amount: "₹10,000 - ₹50,000/year", eligibility: "Kerala domicile, merit based", deadline: "August - October", link: "https://dcescholarship.kerala.gov.in", category: "Kerala" },
      { name: "🏙️ Karnataka Vidyasiri Scholarship", amount: "₹15,000 - ₹25,000/year", eligibility: "Karnataka SC/ST/OBC students", deadline: "September - November", link: "https://karepass.cgg.gov.in", category: "Karnataka" },
      { name: "🏛️ Rajasthan Ambedkar Scholarship", amount: "₹15,000 - ₹25,000/year", eligibility: "Rajasthan SC/ST, 60%+ marks", deadline: "September - November", link: "https://sje.rajasthan.gov.in", category: "Rajasthan" },
      { name: "🏛️ WB Swami Vivekananda Merit", amount: "₹5,000 - ₹10,000/year", eligibility: "WB domicile, 60%+ marks", deadline: "October - December", link: "https://svmcm.wbhed.gov.in", category: "West Bengal" },
      { name: "🏛️ Telangana ePass", amount: "Full fees + maintenance", eligibility: "Telangana SC/ST/BC students", deadline: "September - November", link: "https://telanganaepass.cgg.gov.in", category: "Telangana" },
      { name: "🏛️ Gujarat Girl Student Scholarship", amount: "₹10,000 - ₹25,000/year", eligibility: "Gujarat girl students, 60%+ marks", deadline: "After results", link: "https://digitalgujarat.gov.in", category: "Gujarat" },
      { name: "🏛️ Jharkhand e-Kalyan", amount: "₹15,000 - ₹36,000/year", eligibility: "Jharkhand SC/ST/OBC, 60%+ marks", deadline: "September - November", link: "https://ekalyan.cgg.gov.in", category: "Jharkhand" },

      // International
      { name: "🌍 DAAD Scholarship (Germany)", amount: "€934/month + fees + travel", eligibility: "Excellent academics, Master's/PhD", deadline: "October - November", link: "https://www.daad.de", category: "International" },
      { name: "🇬🇧 Chevening Scholarship (UK)", amount: "Full tuition + living + travel", eligibility: "2 years work exp, Master's in UK", deadline: "August - November", link: "https://www.chevening.org", category: "International" },
      { name: "🇺🇸 Fulbright Scholarship (USA)", amount: "Full tuition + stipend + travel", eligibility: "Indian citizens, Master's/PhD", deadline: "February - May", link: "https://www.usief.org.in", category: "International" },
      { name: "🇫🇷 Eiffel Scholarship (France)", amount: "€1,181/month + travel", eligibility: "Master's/PhD in France, non-French citizens", deadline: "October - January", link: "https://www.campusfrance.org", category: "International" },
      { name: "🇯🇵 MEXT Scholarship (Japan)", amount: "Full tuition + ¥144,000/month", eligibility: "Under 24, UG in Japan", deadline: "April - May", link: "https://www.studyinjapan.go.jp", category: "International" },
      { name: "🇰🇷 Korean Govt Scholarship (KGSP)", amount: "Full tuition + ₩900,000/month", eligibility: "Under 25, UG in South Korea", deadline: "February - March", link: "https://www.studyinkorea.go.kr", category: "International" },
    ],
    youtubeChannels: [
      "📺 Drishti IAS — UPSC/BPSC complete prep free mein",
      "📺 StudyIQ — Current affairs daily updates",
      "📺 Unacademy CLAT — Law entrance prep",
      "📺 Khan Sir Patna — GK aur reasoning easy language mein",
      "📺 The Lallantop — Current affairs in Hindi",
      "📺 Sleepy Classes — UPSC optional subjects free",
      "📺 Dhyeya IAS — Hindi medium UPSC prep",
      "📺 Adda247 — SSC/Banking/State exams prep",
      "📺 Aman Dhattarwal — Career guidance for arts students",
      "📺 Art Side of Life — Drawing aur creative skills",
    ],
  },

  // ─── NON-TRADITIONAL STREAMS ───────────────────────────────────────────
  sports: {
    stream: "Sports",
    emoji: "🏆",
    tagline: "Champion ka dil hai tumhara! 🏅",
    description: "Tumhara energy aur passion physical world ke liye hai! Sports field mein sirf player hi nahi — coach, manager, journalist, physiotherapist, analyst — 15+ amazing careers hain. India mein sports industry boom kar raha hai!",
    careers: [
      "🏋️ Fitness Trainer / Coach - ₹3-15 LPA",
      "🎙️ Sports Journalist - ₹4-15 LPA",
      "📊 Sports Analyst - ₹8-25 LPA",
      "🧠 Sports Psychologist - ₹5-18 LPA",
      "🏥 Physiotherapist - ₹4-12 LPA",
      "🏆 Sports Manager / Agent - ₹5-20 LPA",
      "🎓 Physical Education Teacher - ₹3-10 LPA",
      "⚔️ Defense Services - ₹6-20 LPA",
    ],
    modernCareers: [
      { title: "Sports Data Analyst", salary: "₹8-25 LPA", description: "IPL/ISL teams hire analysts", trend: "📊 Booming" },
      { title: "E-Sports Player/Manager", salary: "₹3-20 LPA", description: "Gaming as career", trend: "🎮 Exploding" },
      { title: "Sports Content Creator", salary: "₹2-30 LPA", description: "YouTube/Instagram sports niche", trend: "📱 Growing" },
      { title: "Sports Tech Startup", salary: "₹unlimited", description: "Fitness apps, wearables", trend: "🚀 Future" },
    ],
    nonAcademicCareers: [],
    examsToPrepare: [
      "🏃 BPEd Entrance — Physical Education degree ke liye",
      "🎖️ NDA — Defence ke liye (12th ke baad)",
      "🏅 SAI Recruitment — Sports Authority of India",
      "🧬 NEET — Physiotherapy / Sports Medicine ke liye",
      "📊 CMAT — Sports Management MBA ke liye",
      "🎓 NIS Patiala — National Institute of Sports coaching",
    ],
    roadmap: [
      { month: "Month 1-2", task: "Apna main sport identify karo. District level mein participate karo. Physical fitness routine start karo — daily 2-3 hours practice." },
      { month: "Month 3-4", task: "NIS Patiala ya state sports academy ka pata karo. BPEd ya Sports Management course research karo. SAI training centers join karo." },
      { month: "Month 5-6", task: "State level competition mein participate karo. Sports journalism/management mein interest hai toh content create karo. Certificates collect karo." },
      { month: "Month 7-8", task: "Scholarship apply karo — Khelo India, state sports scholarship. Coach ya mentor dhundho. Video portfolio banao apne performance ka." },
      { month: "Month 9-10", task: "College admission ke liye sports quota apply karo. Sabhi major colleges mein sports quota seats hoti hain. Physical + Academic dono balance karo." },
      { month: "Month 11-12", task: "Career decide karo — player, coach, manager, analyst, journalist? Accordingly degree ya certification select karo. Network build karo sports community mein!" },
    ],
    colleges: [
      { name: "NIS Patiala", location: "Patiala, Punjab", fees: "₹20-50K/year", rating: "⭐⭐⭐⭐⭐", state: "Punjab", cutoff: "Entrance + physical test", collegeType: "top" },
      { name: "LNIPE Gwalior", location: "Gwalior, MP", fees: "₹15-30K/year", rating: "⭐⭐⭐⭐⭐", state: "Madhya Pradesh", cutoff: "BPEd entrance", collegeType: "government" },
      { name: "BHU Physical Education", location: "Varanasi, UP", fees: "₹10-20K/year", rating: "⭐⭐⭐⭐⭐", state: "UP", cutoff: "CUET + physical" },
      { name: "SAI Training Centers", location: "All India", fees: "Free! 🎉", rating: "⭐⭐⭐⭐⭐", state: "Other States", cutoff: "Selection trial" },
    ],
    scholarships: [
      { name: "🏅 Khelo India Scholarship", amount: "₹5 lakh/year", eligibility: "Selected national level players", deadline: "Year round", link: "https://kheloindia.gov.in", category: "National" },
      { name: "🎖️ SAI Scholarship", amount: "Full support + stipend", eligibility: "SAI center trainees", deadline: "At admission", link: "https://sai.gov.in", category: "National" },
      { name: "🏆 State Sports Scholarship", amount: "₹10,000-50,000/year", eligibility: "State-level players", deadline: "After selection", link: "https://scholarships.gov.in", category: "National" },
    ],
    youtubeChannels: [
      "📺 Khelo India — Official sports development content",
      "📺 Sports Tak — Hindi sports news",
      "📺 Cricket Next — Cricket analysis",
      "📺 The Field — Sports journalism",
      "📺 Sportskeeda — Multi-sport coverage",
    ],
  },

  creative: {
    stream: "Creative",
    emoji: "🎨",
    tagline: "Creator aur innovator hain aap! ✨",
    description: "Aapki creativity aur imagination aapki superpower hai! Design, film, animation, music, fashion — India ka creative industry ₹1 lakh crore se upar hai. NID, NIFT, FTII — world-class education milti hai. Global companies Indian designers hire karte hain!",
    careers: [
      "🎨 Graphic/UX Designer - ₹6-25 LPA",
      "🎬 Filmmaker / Animator - ₹5-30 LPA",
      "📸 Photographer / Videographer - ₹3-15 LPA",
      "👗 Fashion Designer - ₹4-20 LPA",
      "🏠 Interior Designer - ₹4-18 LPA",
      "🎮 Game Designer - ₹6-25 LPA",
      "🎵 Music Producer - ₹4-20 LPA",
      "📱 Content Creator / Influencer - ₹2-50 LPA",
    ],
    modernCareers: [
      { title: "UI/UX Designer (Tech)", salary: "₹8-30 LPA", description: "App/web design — highest demand", trend: "🔥 Hottest" },
      { title: "3D Animator / VFX Artist", salary: "₹6-25 LPA", description: "Bollywood, OTT, Gaming", trend: "📈 Growing" },
      { title: "Brand Identity Designer", salary: "₹8-30 LPA", description: "Logo, brand, marketing", trend: "💼 Stable" },
      { title: "AI Art / Prompt Engineer", salary: "₹5-20 LPA", description: "New field, huge opportunity", trend: "🚀 Emerging" },
    ],
    nonAcademicCareers: [],
    examsToPrepare: [
      "🎨 NID DAT — National Institute of Design (India ka #1)",
      "👗 NIFT Entrance — Fashion & Textile Design",
      "🏗️ UCEED — IIT Design entrance",
      "🎬 FTII Entrance — Film & Television Institute",
      "🎓 CEED — M.Des IIT entrance",
      "📐 Srishti / MIT Design entrance",
    ],
    roadmap: [
      { month: "Month 1-2", task: "Portfolio banana shuru karo — sketchbook, digital art, photography. Adobe tools seekho — Photoshop, Illustrator (free trial available). YouTube tutorials se shuru karo." },
      { month: "Month 3-4", task: "NID/NIFT previous year papers practice karo — creative thinking + drawing tests. Behance profile banao. Daily 1 creative project banao." },
      { month: "Month 5-6", task: "Mock tests aur portfolio reviews karo. Internship ya freelance projects start karo — even unpaid experience matters. Creative competitions participate karo." },
      { month: "Month 7-8", task: "Entrance exam applications fill karo. NID April/May mein hota hai, NIFT January mein. Strong portfolio ready karo — 15-20 best works." },
      { month: "Month 9-10", task: "Design workshops attend karo. Behance, Instagram pe portfolio share karo. Industry professionals se connect karo LinkedIn pe." },
      { month: "Month 11-12", task: "Final exam prep. Interview practice — creative colleges interview bhi lete hain. Backup as freelancing start karo toh income bhi aayegi!" },
    ],
    colleges: [
      { name: "NID Ahmedabad", location: "Ahmedabad, Gujarat", fees: "₹3-4L/year", rating: "⭐⭐⭐⭐⭐", state: "Gujarat", cutoff: "NID DAT: Top 100 rank", collegeType: "top" },
      { name: "NIFT Delhi", location: "New Delhi", fees: "₹2-3L/year", rating: "⭐⭐⭐⭐⭐", state: "Delhi", cutoff: "NIFT Entrance: Top 500", collegeType: "top" },
      { name: "FTII Pune", location: "Pune, Maharashtra", fees: "₹1-2L/year 🔥", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "FTII Entrance: Very competitive", collegeType: "top" },
      { name: "IIT Bombay (IDC)", location: "Mumbai", fees: "₹2-2.5L/year", rating: "⭐⭐⭐⭐⭐", state: "Maharashtra", cutoff: "UCEED: Top 100 rank", collegeType: "top" },
    ],
    scholarships: [
      { name: "🎨 NID Scholarship", amount: "Merit + need based", eligibility: "NID students", deadline: "At admission", link: "https://nid.edu", category: "National" },
      { name: "👗 NIFT Fee Waiver", amount: "Full fee waiver", eligibility: "SC/ST/PwD students", deadline: "At admission", link: "https://nift.ac.in", category: "National" },
      { name: "💡 Central Sector Scheme", amount: "₹10,000-20,000/year", eligibility: "Top 20 percentile, <₹8L income", deadline: "Oct-Dec", link: "https://scholarships.gov.in", category: "National" },
    ],
    youtubeChannels: [
      "📺 The Futur — Design career guidance (English)",
      "📺 Satori Graphics — Graphic design tutorials",
      "📺 NID entrance preparation — NID/NIFT prep",
      "📺 Ranveer on Branding — Indian design perspective",
      "📺 Film Riot — Filmmaking tutorials",
    ],
  },

  skills: {
    stream: "Skills",
    emoji: "💻",
    tagline: "Digital world ka expert banne wale ho! 🚀",
    description: "Degree se zyada aaj skills matter karti hain! Coding, design, digital marketing, video editing — 3-6 mahine ki skill se ₹20-50K/month kama sakte ho. Freelancing se ghar baith ke world ke clients ke saath kaam karo. India ka tech industry fastest growing hai!",
    careers: [
      "💻 Full Stack Developer - ₹5-30 LPA",
      "📱 App Developer (Android/iOS) - ₹6-30 LPA",
      "📊 Data Analyst - ₹5-25 LPA",
      "🔒 Cybersecurity Analyst - ₹8-30 LPA",
      "📢 Digital Marketer - ₹4-20 LPA",
      "🎬 Video Editor / Creator - ₹4-20 LPA",
      "🤖 AI/ML Engineer - ₹12-50 LPA",
      "🌐 Freelancer (multi-skill) - ₹2-50 LPA",
    ],
    modernCareers: [
      { title: "AI Prompt Engineer", salary: "₹8-30 LPA", description: "AI tools master karo", trend: "🔥 Newest" },
      { title: "No-Code Developer", salary: "₹5-20 LPA", description: "Bubble, Webflow se apps banao", trend: "📈 Growing" },
      { title: "Freelance Developer", salary: "₹3-50 LPA", description: "Upwork, Fiverr pe work", trend: "💻 Flexible" },
      { title: "Tech YouTuber", salary: "₹2-30 LPA", description: "Tech reviews, tutorials", trend: "📱 Booming" },
    ],
    nonAcademicCareers: [],
    examsToPrepare: [
      "💻 Google IT Certifications — FREE, globally accepted",
      "☁️ AWS/Azure Cloud Certifications — ₹20-50K/year jobs",
      "🔒 CEH (Cybersecurity) — Ethical hacking",
      "📊 Google Analytics / Meta Blueprint — Digital marketing",
      "🏛️ NIELIT O/A/B Level — Govt IT certification",
      "🎓 CompTIA A+/Network+ — IT fundamentals",
    ],
    roadmap: [
      { month: "Month 1-2", task: "Ek skill choose karo — Web Dev ya Digital Marketing ya Data Analysis. YouTube se free sikho (CS50, FreeCodeCamp, W3Schools). Daily 2-3 hours practice." },
      { month: "Month 3-4", task: "Ek real project banao — website, app, or campaign. GitHub pe upload karo. Google ya Meta ka free certification lo. Portfolio ready karo." },
      { month: "Month 5-6", task: "Fiverr ya Upwork pe profile banao. Pehle ₹500-1000 gig se start karo. Local businesses ke liye free projects karo — experience ke liye." },
      { month: "Month 7-8", task: "Income start hogi — ₹5,000-15,000/month. Skills upgrade karo. Reviews aur ratings build karo. LinkedIn professional profile optimize karo." },
      { month: "Month 9-10", task: "Full-time freelancing ya job apply karo. TCS, Infosys, startups — sabhi hire karte hain portfolio wale candidates. Salary negotiation seekho." },
      { month: "Month 11-12", task: "Specialization choose karo — React Dev, AI/ML, SEO specialist. Advanced courses karo. Passive income sources build karo (courses, templates)." },
    ],
    colleges: [
      { name: "Masai School", location: "Online / Bangalore", fees: "Pay after placement!", rating: "⭐⭐⭐⭐⭐", state: "Karnataka", cutoff: "Aptitude test", collegeType: "private" },
      { name: "Newton School of Technology", location: "Online", fees: "Pay after placement!", rating: "⭐⭐⭐⭐⭐", state: "Other States", cutoff: "Online test", collegeType: "private" },
      { name: "IIT (Free Online via NPTEL)", location: "Online", fees: "FREE! 🎉", rating: "⭐⭐⭐⭐⭐", state: "Other States", cutoff: "No cutoff — open access" },
      { name: "Google Career Certificates", location: "Online (Coursera)", fees: "₹1,800/month (financial aid available)", rating: "⭐⭐⭐⭐⭐", state: "International", cutoff: "No cutoff" },
    ],
    scholarships: [
      { name: "💻 Google Career Certificate Aid", amount: "Full financial aid", eligibility: "Low income students", deadline: "Apply anytime", link: "https://coursera.org", category: "International" },
      { name: "🌐 Microsoft Learn Free", amount: "Free learning + certifications", eligibility: "Everyone", deadline: "Always open", link: "https://learn.microsoft.com", category: "International" },
      { name: "📦 GitHub Student Pack", amount: "₹50,000+ worth free tools", eligibility: ".edu email ya student ID", deadline: "Any time", link: "https://education.github.com", category: "International" },
    ],
    youtubeChannels: [
      "📺 FreeCodeCamp — Web development complete free",
      "📺 Apna College — Hindi mein coding",
      "📺 CodeWithHarry — Hindi tech tutorials",
      "📺 Hitesh Choudhary — Full stack development",
      "📺 Ishan Sharma — Digital marketing + freelancing",
    ],
  },
};

export interface QuizProfile {
  stream: string;
  scores: { science: number; commerce: number; arts: number };
  confidence: number; // 0-100 how clearly one stream dominates
  interests: string[];
  strengths: string[];
  personality: string;
  selectedClass?: string;
  selectedInterest?: string;
  dreamGoal?: string;
  situation?: string[];
  /** Optional per-question reflections from the quiz (mentor-style notes). */
  mentorNotes?: string[];
}

export function calculateStream(answers: number[][]): string {
  const profile = buildQuizProfile(answers);
  return profile.stream;
}

export function buildQuizProfile(answers: number[][]): QuizProfile {
  const totals = { science: 0, commerce: 0, arts: 0 };
  const interestSignals: string[] = [];
  const strengthSignals: string[] = [];

  // Advanced questions (16-20) carry higher weight
  answers.forEach((questionAnswers, qIndex) => {
    const weight = qIndex >= 15 ? 1.5 : 1;
    questionAnswers.forEach((optionIndex) => {
      const option = quizQuestions[qIndex]?.options[optionIndex];
      if (option) {
        totals.science += option.scores.science * weight;
        totals.commerce += option.scores.commerce * weight;
        totals.arts += option.scores.arts * weight;
      }
    });
  });

  // Derive interests from key questions
  const interestMap: Record<number, string[]> = {
    0: ["academics", "subject-preference"],
    1: ["hobbies", "free-time"],
    2: ["career-aspiration"],
    10: ["technology", "coding"],
    18: ["youtube-content"],
  };
  answers.forEach((sel, qi) => {
    if (interestMap[qi] && sel.length > 0) {
      const optText = quizQuestions[qi]?.options[sel[0]]?.text || "";
      interestSignals.push(optText.slice(0, 60));
    }
  });

  // Derive strengths from Q4 (problem-solving), Q6 (group role), Q15 (superpower), Q17 (stress)
  [3, 5, 14, 16].forEach((qi) => {
    if (answers[qi]?.length > 0) {
      const optText = quizQuestions[qi]?.options[answers[qi][0]]?.text || "";
      strengthSignals.push(optText.slice(0, 60));
    }
  });

  // Calculate confidence
  const max = Math.max(totals.science, totals.commerce, totals.arts);
  const total = totals.science + totals.commerce + totals.arts;
  const confidence = total > 0 ? Math.round((max / total) * 100) : 33;

  // Personality type
  let personality = "Explorer";
  if (confidence > 70) personality = "Focused Achiever";
  else if (confidence > 50) personality = "Clear Thinker";
  else personality = "Versatile Explorer";

  let stream = "arts";
  if (totals.science >= totals.commerce && totals.science >= totals.arts) stream = "science";
  else if (totals.commerce >= totals.science && totals.commerce >= totals.arts) stream = "commerce";

  // Check for non-traditional path hints from quiz notes
  try {
    const notes = JSON.parse(localStorage.getItem("quizUserNotes") || "{}");
    const notesText = Object.values(notes).join(" ").toLowerCase();
    if (
      notesText.includes("sports") || notesText.includes("cricket") ||
      notesText.includes("football") || notesText.includes("khelna")
    ) {
      stream = "sports";
    } else if (
      notesText.includes("design") || notesText.includes("drawing") ||
      notesText.includes("film") || notesText.includes("music") ||
      notesText.includes("creative") || notesText.includes("animation")
    ) {
      stream = "creative";
    } else if (
      notesText.includes("coding") || notesText.includes("app") ||
      notesText.includes("youtube") || notesText.includes("freelance") ||
      notesText.includes("digital") || notesText.includes("skills")
    ) {
      stream = "skills";
    }
  } catch {}

  return {
    stream,
    scores: {
      science: Math.round(totals.science),
      commerce: Math.round(totals.commerce),
      arts: Math.round(totals.arts),
    },
    confidence,
    interests: interestSignals,
    strengths: strengthSignals,
    personality,
  };
}
