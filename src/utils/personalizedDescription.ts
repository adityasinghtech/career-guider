import type { QuizProfile } from "@/data/quizData";

type ConfidenceBand = "high" | "medium" | "low";

function band(confidence: number): ConfidenceBand {
  if (confidence >= 70) return "high";
  if (confidence >= 50) return "medium";
  return "low";
}

function classClosing(selectedClass?: string): string {
  if (!selectedClass) return "";
  if (selectedClass === "Class 8" || selectedClass === "Class 9") {
    return " Abhi tumhare paas naye subjects explore karne ka time hai — fundamentals pe focus rakho.";
  }
  if (selectedClass === "Class 10") {
    return " Board ke baad stream choose karte waqt apni interest aur marks dono ko balance karna helpful hoga.";
  }
  if (selectedClass === "Class 11" || selectedClass === "Class 12") {
    return " Entrance syllabus aur consistency ab tumhari priority honi chahiye — chhota daily plan badi help karta hai.";
  }
  if (selectedClass === "12th Pass") {
    return " Abhi tum entrance, admissions, ya skill courses par focus karke apna next step tez kar sakte ho.";
  }
  return "";
}

/**
 * Personalized result copy from quiz profile; falls back to stream description if profile is missing.
 */
export function generatePersonalizedDescription(
  profile: QuizProfile | null,
  fallbackDescription: string,
): string {
  if (!profile) return fallbackDescription;

  const { stream, confidence, personality, selectedInterest = "undecided", selectedClass } = profile;
  const b = band(confidence);
  const tail = classClosing(selectedClass);

  if (stream === "science") {
    if (selectedInterest === "tech" && b === "high") {
      return `Tumhare answers se clearly pata chalta hai ki tum ek natural problem-solver ho! Technology aur Science mein tumhari deep interest hai. PCM (Physics, Chemistry, Maths) stream tumhare liye best fit hai — aage jaake Software Engineering, AI/ML, ya Research mein amazing career ban sakta hai. Abhi se coding aur Maths pe focus karo! Tumhara ${personality} style is direction mein aur bhi strong lagta hai.${tail}`;
    }
    if (selectedInterest === "tech") {
      return `Tumhara result Science stream ko strongly suggest karta hai, aur technology mein tumhara lean clear hai. Engineering, IT, data, ya research — in sab mein tum apna fit dhoondh sakte ho. Problem-solving aur logical thinking ko regular practice se polish rakho.${tail}`;
    }
    if (selectedInterest === "business") {
      return `Science background ke saath bhi tumhara practical bent answers mein dikh raha hai — tech product roles, analytics, ya science + management combinations (MBA later) sab possible hain. Quant skills aur communication dono build karna smart move hoga.${tail}`;
    }
    if (selectedInterest === "creative") {
      return `Science stream ke saath creativity combine karke UX, game design, scientific communication, ya design-tech roles explore kar sakte ho. Tumhara ${personality} profile unique angles dhoondhne mein help karega.${tail}`;
    }
    if (selectedInterest === "sports") {
      return `Sports ke shauk ke saath Science tumhe sports science, physiotherapy, nutrition, ya performance analytics jaise modern fields ki taraf le ja sakta hai. Discipline aur data dono yahan matter karte hain.${tail}`;
    }
    if (b === "high") {
      return `Tumhare scores se Science stream clearly dominant hai — lab thinking, logic, aur structured learning tumhari strength lagti hai. Medical, Engineering, ya pure sciences — tum systematically prepare karke strong outcomes le sakte ho.${tail}`;
    }
    return `Science stream tumhare answers ke saath accha align karta hai; confidence ${confidence}% hai, isliye ${personality} profile ke hisaab se thoda aur explore karke apni final specialization choose karna wise hoga. Core subjects strong rakho aur mentors se connect karte raho.${tail}`;
  }

  if (stream === "commerce") {
    if (selectedInterest === "business" && (b === "medium" || b === "high")) {
      return `Tumhara practical mindset aur business sense clearly dikh raha hai answers mein. Commerce stream tumhare liye ek strong choice hai. CA, MBA, ya apna startup — teeno options tumhare liye open hain. Numbers aur market trends samajhna tumhari natural strength hai!${tail}`;
    }
    if (selectedInterest === "business") {
      return `Commerce tumhare interest ke saath match karta hai — finance, strategy, aur real-world decision making yahan central hain. CA, banking, management, ya entrepreneurship — direction gradually clear hoti jayegi with exposure.${tail}`;
    }
    if (selectedInterest === "tech") {
      return `Commerce + digital tools ka combination aaj powerful hai: FinTech, analytics, aur automation roles tumhare liye relevant ho sakte hain. Excel, data literacy, aur business fundamentals par grip banaye rakhna.${tail}`;
    }
    if (selectedInterest === "creative") {
      return `Commerce ke saath branding, marketing, content, aur media roles natural fit ho sakte hain — numbers + story dono chahiye. Tumhara ${personality} style yahan alag angles try karne mein help karega.${tail}`;
    }
    if (b === "high") {
      return `Commerce stream tumhare answers mein clearly lead kar raha hai — accounting, economics, aur strategy tumhari comfort zone lagti hai. Professional courses aur internships se clarity aur badhegi.${tail}`;
    }
    return `Commerce tumhare profile ke paas hai; ${confidence}% confidence ke saath tum abhi electives, competitions, aur mentorship se apna path refine kar sakte ho. ${personality} learners ko variety of roles suit karti hai — exposure badhate raho.${tail}`;
  }

  if (stream === "arts") {
    if (selectedInterest === "creative") {
      return `Tumhari creativity aur out-of-the-box thinking clearly show ho rahi hai! Arts/Humanities stream tumhare liye perfect match hai. Law, Design, Journalism, UPSC — bahut saare powerful career options hain. Tumhari communication skills aur creative thinking real-world mein bahut valuable hai!${tail}`;
    }
    if (selectedInterest === "business") {
      return `Humanities ke saath policy, law, management, ya social enterprise jaise paths combine kiye ja sakte hain — leadership aur ethics yahan matter karti hai. Reading habit aur structured writing tumhe age le jayegi.${tail}`;
    }
    if (selectedInterest === "sports") {
      return `Arts background ke saath sports journalism, management, psychology, ya public roles explore kiye ja sakte hain — storytelling + people skills yahan kaam aati hain.${tail}`;
    }
    if (b === "high") {
      return `Arts/Humanities tumhare answers ke strongest fit hain — analysis, expression, aur perspective tumhari strength lagti hai. Law, civil services, design, media — inmein se apni calling dhoondh sakte ho.${tail}`;
    }
    return `Arts stream tumhare responses ke saath align karta hai; ${personality} profile diverse fields try karne ke liye accha base deta hai. Confidence ${confidence}% hai — internships, debates, aur portfolio projects se clarity badhayein.${tail}`;
  }

  return `${fallbackDescription}\n\n(Profile: ${personality}, stream confidence ~${confidence}%)`;
}
