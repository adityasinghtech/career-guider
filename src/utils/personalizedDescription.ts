import type { QuizProfile, StreamResult } from "@/data/quizData";

/**
 * Personalized result copy from quiz profile + current result card stream.
 * Falls back to `result.description` when profile is missing or no rule matches.
 */
export function generatePersonalizedText(
  quizProfile: QuizProfile | null,
  result: Pick<StreamResult, "stream" | "description">,
): string {
  if (!quizProfile) return result.description;

  const stream = result.stream.toLowerCase();
  const selectedInterest = quizProfile.selectedInterest || "";
  const confidence = quizProfile.confidence ?? 0;

  if (confidence < 50) {
    return `Tumhare quiz answers mixed hain — jo perfectly normal hai! Matlab tum ek versatile learner ho jise multiple fields interesting lagte hain. ${result.stream} stream tumhare liye primary recommendation hai, but explore karna bilkul theek hai. Apne subjects, hobbies aur daily activities observe karo — clarity khud aayegi! 💡`;
  }

  if (stream === "science") {
    if (selectedInterest === "tech" && confidence > 70) {
      return `Tumhare quiz answers clearly dikhate hain — tum ek natural problem-solver ho! Technology aur Science mein tumhari deep interest hai. PCM stream tumhare liye perfect fit hai. Aage Software Engineering, AI/ML, ya Research mein kamaal career ban sakta hai. Abhi se coding aur Maths pe extra focus karo! 🔬`;
    }
    return `Quiz mein tumhara scientific thinking clearly strong hai! Science stream open karti hai bahut saare doors — Engineering se Medical tak, Research se Defense tak. Abhi worry mat karo — Class 11 mein subjects choose karne ke baad clarity automatically aayegi. PCM ya PCB dono solid options hain! 🎯`;
  }

  if (stream === "commerce") {
    if (selectedInterest === "business") {
      return `Tumhara practical mindset aur business sense quiz mein clearly dikh raha hai! Commerce stream tumhare liye ek strong match hai. CA, MBA, ya apna startup — teeno powerful options hain. Numbers aur market trends samajhna tumhari natural strength hai. Tally aur Excel abhi se seekhna shuru karo! 📈`;
    }
    return result.description;
  }

  if (stream === "arts") {
    if (selectedInterest === "creative") {
      return `Tumhari creativity aur out-of-the-box thinking clearly show ho rahi hai! Arts/Humanities stream mein amazing careers hain — Law, UPSC, Design, Journalism. Tumhari communication skills aur creative thinking real-world mein bahut valuable hai. Daily newspaper padhna aur essay writing abhi se shuru karo! 🎨`;
    }
    return `Arts stream sirf creativity ke liye nahi — UPSC top officers, Supreme Court lawyers, aur top designers sab Arts background se aaye hain! Tumhare quiz answers dikhate hain ki tumhara analytical aur expressive thinking strong hai. Ye stream tumhare liye bahut possibilities kholta hai! 🌟`;
  }

  return result.description;
}
