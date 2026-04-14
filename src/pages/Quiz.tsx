import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, SkipForward } from "lucide-react";
import Navbar from "@/components/Navbar";
import { quizQuestions, buildQuizProfile } from "@/data/quizData";
import StudentRegistrationForm from "@/components/quiz/StudentRegistrationForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

  const question = quizQuestions[current];
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

              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-8">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const isSelected = answers[current].includes(idx);
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all font-body ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-card"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
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
                    className={`flex items-center justify-center gap-2 font-display font-bold px-6 py-3 rounded-xl transition-all ${
                      hasAnswer
                        ? "gradient-hero text-primary-foreground hover:opacity-90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {current === quizQuestions.length - 1 ? "Lagbhag Ho Gaya! ✨" : "Aage"}
                    <ArrowRight className="w-4 h-4" />
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
