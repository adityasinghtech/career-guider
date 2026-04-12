import type { QuizProfile, StreamResult } from "@/data/quizData";

function combinedVoice(profile: QuizProfile): string {
  const notes = (profile.mentorNotes || []).join(" ");
  const goal = profile.dreamGoal || "";
  return `${notes} ${goal}`.toLowerCase();
}

/**
 * Opening mentor-style copy from quiz + registration profile + optional notes.
 * Complements generateGuidance() on the results page.
 */
export function generatePersonalizedText(
  quizProfile: QuizProfile | null,
  result: Pick<StreamResult, "stream" | "description">,
): string {
  if (!quizProfile) return result.description;

  const stream = result.stream.toLowerCase();
  const selectedInterest = quizProfile.selectedInterest || "";
  const confidence = quizProfile.confidence ?? 0;
  const situations = quizProfile.situation || [];
  const voice = combinedVoice(quizProfile);

  const sportsy =
    selectedInterest === "sports" ||
    /\b(cricket|football|badminton|hockey|kabaddi|sport|sports|khiladi|athlete|team|coach|ipl)\b/i.test(voice);

  const studyStruggle =
    situations.some((s) => s.includes("Padhai boring") || s.includes("focus nahi")) ||
    /\b(padhai|study|boring|man nahi|focus|nahi pasand|exam se dar)\b/i.test(voice);

  if (sportsy) {
    const bridge: Record<string, string> = {
      science: `${result.stream} stream ke saath tumhara sports passion clash nahi — Sports Science, Physiotherapy, Nutrition, ya Sports Tech (wearables, performance data) mein direct link hai. Pro athlete path rare + tough hai, lekin coaching, SAI schemes, aur university sports quota bhi explore karo. `,
      commerce: `${result.stream} + sports = Sports Management, sponsorships, team operations, aur sports marketing — IPL/industry mein real jobs hain. CA/MBA ke saath sports brand roles possible hain. `,
      arts: `${result.stream} + sports = Sports journalism, commentary, content, sports law/psychology — storytelling + game dono use hote hain. `,
    };
    const tail =
      "Quiz ne stream direction di hai; tumhara game + academics dono ko plan mein jagah do — ek timetable mein practice slot fix rakho.";
    return `${bridge[stream] || bridge.arts}${tail}`;
  }

  if (studyStruggle) {
    const base =
      "Tumne jo share kiya usse lagta hai padhai/focus abhi heavy lag raha hai — yeh bahut students ke saath hota hai. Stream suggest hona = tumhari thinking style; daily effort thoda-thoda build karna = skill. ";
    const streamHint =
      stream === "science"
        ? "Science mein concepts ko animation/video se samajhna + weekly small tests se pressure kam karo. "
        : stream === "commerce"
          ? "Commerce mein real examples (news, brands) se padhna interesting ban sakta hai. "
          : "Arts mein writing/debate practice ko game jaisa treat karo — roz 20 minute enough hai shuru ke liye. ";
    return `${base}${streamHint}${confidence < 55 ? "Quiz scores close hain — tum abhi multi-talented phase mein ho, explore karte raho. " : ""}${result.description}`;
  }

  if (confidence < 50) {
    return `Tumhare quiz answers mixed hain — jo perfectly normal hai! Matlab tum versatile ho aur multiple fields interesting lagte hain. ${result.stream} stream primary recommendation hai, lekin ${selectedInterest === "sports" ? "sports + academics balance " : ""}explore karna healthy hai. Apne subjects, hobbies aur notes (jo tumne likhe) ko 2 weeks observe karo — patterns clear honge. 💡`;
  }

  if (stream === "science") {
    if (selectedInterest === "tech" && confidence > 70) {
      return `Tumhare answers clearly dikhate hain — tum natural problem-solver ho! Technology aur Science mein deep interest hai. PCM + coding focus se Software/AI/Research strong ban sakta hai. Abhi se logical puzzles + ek beginner-friendly coding course try karo. 🔬`;
    }
    return `Quiz mein tumhara scientific thinking strong dikh raha hai! Science stream Engineering, Medical, Research, Defense — bahut doors kholti hai. PCM vs PCB choice goals se aayegi — tension mat lo, abhi explore karte raho. 🎯`;
  }

  if (stream === "commerce") {
    if (selectedInterest === "business") {
      return `Practical mindset + numbers/commerce angle quiz mein clear hai. CA, MBA, Banking, Startup — sab aligned paths hain. Excel/Tally + business news daily = chhota habit, bada farq. 📈`;
    }
    return result.description;
  }

  if (stream === "arts") {
    if (selectedInterest === "creative") {
      return `Creativity + expression tumhari strength lag rahi hai. Law, Design, UPSC, Journalism, Content — sab viable. Roz thoda likho ya sketch karo; portfolio slowly banega. 🎨`;
    }
    return `Arts stream sirf "easy" nahi — top lawyers, officers, designers isi side se bhi aate hain. Tumhare answers mein analytical + expressive mix dikh raha hai; isse careers mein translate kiya ja sakta hai. 🌟`;
  }

  return result.description;
}
