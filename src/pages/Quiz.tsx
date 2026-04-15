import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, SkipForward, Volume2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { quizQuestions, buildQuizProfile } from "@/data/quizData";
import StudentRegistrationForm from "@/components/quiz/StudentRegistrationForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import { ScreenReaderOnly, Emoji } from "@/components/a11y/A11yUtils";

const MENTOR_LINES = [
  "Aram se socho — galat jawab nahi hota, bas pattern dikh raha hai.",
  "Jo mann mein aaye woh neeche likh bhi sakte ho — mentor waali feel ke liye.",
  "Skip dabate hi agla sawaal aa jayega — score add nahi hoga.",
  "Doubt ho toh apna point likh do — result page pe use karenge.",
  "Yeh quiz tumhari story samajhne ke liye hai, marksheet nahi.",
];

const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [answers, setAnswers] = useState<number[][]>(
    Array(quizQuestions.length).fill([]).map(() => [])
  );
  const [skipped, setSkipped] = useState<boolean[]>(() => quizQuestions.map(() => false));
  const [questionNotes, setQuestionNotes] = useState<string[]>(() => quizQuestions.map(() => ""));

  const { autoSpeak, voiceOn } = useAccessibility();
  const { speak, stop: stopSpeaking, initVoice, supported: ttsSupported, voiceCount, testSound } = useTextToSpeech();
  const [voiceInitialized, setVoiceInitialized] = useState(false);

  const question = quizQuestions[current];

  // Voice commands logic
  const commands = [
    { pattern: ["next", "aage", "chalo"], action: () => goNext(), description: "Agle sawaal pe jayein" },
    { pattern: ["back", "piche"], action: () => goBack(), description: "Pichle sawaal pe jayein" },
    { pattern: ["skip"], action: () => skipQuestion(), description: "Sawaal skip karein" },
  ];

  useVoiceControl(voiceOn ? commands : []);

  // autoSpeak: Speak question when it changes
  useEffect(() => {
    console.log(`🧐 Quiz Effect: showForm=${showForm}, autoSpeak=${autoSpeak}, voiceInitialized=${voiceInitialized}`);
    if (!showForm && ttsSupported && autoSpeak && question && voiceInitialized) {
      const textToRead = `${question.question}. Options are: ${question.options.map(o => o.text).join(", ")}`;
      
      // ✅ Reduced delay now that engine is stable
      const timer = setTimeout(() => {
        speak(textToRead);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [current, showForm, autoSpeak, ttsSupported, speak, question, voiceInitialized]);

  const handleStartVoice = () => {
    console.log("👆 'Start Voice Guide' clicked and unlocking audio...");
    const firstQuestionText = `Sawaal number ek: ${question.question}. Options are: ${question.options.map(o => o.text).join(", ")}`;
    initVoice(firstQuestionText);
    setVoiceInitialized(true);
  };

  const progress = showForm ? 100 : ((current + 1) / quizQuestions.length) * 100;
  const hasAnswer = answers[current].length > 0 || skipped[current];
  const mentorLine = MENTOR_LINES[current % MENTOR_LINES.length];

  const selectOption = (optionIndex: number) => {
    setSkipped((prev) => {
      const next = [...prev];
      next[current] = false;
      return next;
    });
    setAnswers((prev) => {
      const updated = [...prev];
      updated[current] = [optionIndex];
      return updated;
    });
    
    // ✅ Fix: Voice feedback for selection
    const optionText = quizQuestions[current].options[optionIndex].text;
    if (ttsSupported && optionText && autoSpeak) {
      speak(`Select kiya: ${optionText}`);
    }
  };

  const skipQuestion = () => {
    setSkipped((prev) => {
      const next = [...prev];
      next[current] = true;
      return next;
    });
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = [];
      return next;
    });
    // Auto advance to next question or form
    goNext();
  };

  const updateNote = (text: string) => {
    setQuestionNotes((prev) => {
      const next = [...prev];
      next[current] = text;
      return next;
    });
  };

  const goNext = () => {
    if (current < quizQuestions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowForm(true);
    }
  };

  const goBack = () => {
    if (showForm) {
      setShowForm(false);
    } else if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleFormSubmit = async () => {
    const profile = buildQuizProfile(answers);
    const selectedClass = localStorage.getItem("selectedClass") || "";
    const selectedInterest = localStorage.getItem("selectedInterest") || "";
    const dreamGoal = localStorage.getItem("dreamGoal") || "";
    let situation: string[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem("situation") || "[]");
      situation = Array.isArray(parsed) ? parsed : [];
    } catch {
      situation = [];
    }
    let stream = profile.stream;
    if (selectedInterest === "sports" || selectedInterest === "vocational") {
      stream = selectedInterest;
    }

    // Store quiz profile for chatbot personalization
    const mentorNotes = questionNotes.map((n) => n.trim()).filter(Boolean);

    try {
      localStorage.setItem("pathfinder_quiz_profile", JSON.stringify({
        ...profile,
        selectedClass,
        selectedInterest,
        dreamGoal,
        situation,
        mentorNotes,
      }));
    } catch { /* silently fail */ }

    if (user) {
      await supabase.from("quiz_results").insert({
        user_id: user.id,
        stream,
        answers: answers,
        scores: profile.scores,
      });

      await supabase.from("profiles").update(
        {
          stream,
          updated_at: new Date().toISOString(),
        }
      ).eq("id", user.id);
    }

    navigate(`/results/${stream}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ✅ Voice Status Indicator */}
      <AnimatePresence>
        {autoSpeak && voiceInitialized && (
          <motion.button 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md shadow-xl border-2 transition-all hover:scale-105 active:scale-95 ${
              voiceCount > 0 
                ? "bg-green-500/20 border-green-500/50 cursor-pointer shadow-green-500/20" 
                : "bg-red-500/20 border-red-500/50 font-bold"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              console.log("👆 Force testing sound...");
              speak("System test successful. Voice is active.");
            }}
          >
            <Volume2 className={`w-5 h-5 ${voiceCount > 0 ? "text-green-600 animate-pulse" : "text-red-600"}`} />
            <span className={`text-sm font-display font-black uppercase tracking-widest ${
              voiceCount > 0 ? "text-green-700" : "text-red-700"
            }`}>
              {voiceCount > 0 ? "Tap to Test Sound" : "Voices Blocked"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ✅ Voice Initialization Overlay for Blind Mode */}
      <AnimatePresence>
        {autoSpeak && !voiceInitialized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
              <Volume2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-4 text-foreground">Aapne Blind Mode select kiya hai</h2>
            <p className="text-muted-foreground mb-8 max-w-sm font-body">Mentor ki awaz sunne aur quiz shuru karne ke liye, neeche ke button par click karein.</p>
            <button
              onClick={handleStartVoice}
              className="w-full max-w-xs py-6 rounded-2xl min-h-[80px] gradient-hero text-white font-display font-extrabold text-xl shadow-elevated transition-transform active:scale-95 flex items-center justify-center gap-3"
              aria-label="Awaz shuru karein"
            >
              Start Voice Guide <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground font-display">
              {showForm ? "Aakhri Step!" : `Sawaal ${current + 1}/${quizQuestions.length}`}
            </span>
            <span className="text-sm font-bold text-primary font-display">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-hero rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showForm ? (
            <StudentRegistrationForm
              key="form"
              onSubmit={handleFormSubmit}
              onBack={goBack}
            />
          ) : (
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-body text-sm text-muted-foreground mb-4 italic border-l-2 border-primary/50 pl-3">
                {mentorLine}
              </p>

              <div className="flex items-start gap-3 mb-8">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground flex-1" role="timer" aria-live="polite">
                  <ScreenReaderOnly>Sawaal Number {current + 1}: </ScreenReaderOnly>
                  {question.question}
                </h2>
                {autoSpeak && (
                  <button
                    onClick={() => speak(`${question.question}. Options are: ${question.options.map(o => o.text).join(", ")}`)}
                    className="p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-all active:scale-95 flex-shrink-0"
                    title="Dubaara Sunein"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const isSelected = answers[current].includes(idx);
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all font-body ${isSelected
                          ? "border-primary bg-primary/10 shadow-card"
                          : "border-border bg-card hover:border-primary/40"
                        }`}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Option ${idx + 1}: ${option.text}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                            }`}
                        >
                          {isSelected && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                        </div>
                        <span className={`${isSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {option.text}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-8 rounded-xl border border-border bg-card/80 p-4 shadow-sm">
                <Label htmlFor={`quiz-note-${current}`} className="font-display text-sm text-foreground mb-2 block">
                  Apna point (optional) — jo mann mein ho likh do
                </Label>
                <Textarea
                  id={`quiz-note-${current}`}
                  value={questionNotes[current]}
                  onChange={(e) => updateNote(e.target.value)}
                  placeholder="Jaise: mujhe cricket zyada pasand hai, ya boards se thoda dar lagta hai..."
                  className="min-h-[88px] font-body resize-y border-border bg-background"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-2 font-body">
                  {questionNotes[current].length}/500 — yeh sirf tumhare result ko personal banane ke liye use hoga
                </p>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={current === 0}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-30 font-display font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Peeche
                </button>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={skipQuestion}
                    className="flex items-center justify-center gap-2 font-display font-semibold px-5 py-3 rounded-xl border-2 border-border bg-card text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <SkipForward className="w-4 h-4" /> Skip — score nahi
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!hasAnswer}
                    className={`flex items-center justify-center gap-2 font-display font-bold px-6 py-3 rounded-xl transition-all ${hasAnswer
                        ? "gradient-hero text-primary-foreground hover:opacity-90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                  >
                    {current === quizQuestions.length - 1 ? "Lagbhag Ho Gaya! ✨" : "Aage"}
                    <Emoji symbol="🚀" label="forward arrow" />
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;

