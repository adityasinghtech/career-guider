import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, SkipForward, Mic, MicOff, Volume2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { quizQuestions, buildQuizProfile } from "@/data/quizData";
import StudentRegistrationForm from "@/components/quiz/StudentRegistrationForm";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useVoiceControl } from "@/hooks/useVoiceControl";

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
  const [statusMessage, setStatusMessage] = useState('');

  const { speak, stop, isSpeaking, supported: ttsSupported } = useTextToSpeech();

  const question = quizQuestions[current];
  const progress = showForm ? 100 : ((current + 1) / quizQuestions.length) * 100;
  const hasAnswer = answers[current].length > 0 || skipped[current];
  const mentorLine = MENTOR_LINES[current % MENTOR_LINES.length];

  // Auto-speak question when it changes
  useEffect(() => {
    if (!showForm && ttsSupported) {
      speak(`Sawaal ${current + 1}: ${question.question}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, showForm]);

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
    const optionText = question.options[optionIndex]?.text ?? '';
    // Screen reader live region
    setStatusMessage(`Option ${optionIndex + 1} select hua: ${optionText}`);
    // TTS announce
    if (ttsSupported && optionText) speak(`Select kiya: ${optionText}`);
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
    setStatusMessage(`Sawaal ${current + 1} skip kiya. Agle sawaal pe ja rahe hain.`);
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
      setStatusMessage(`Sawaal ${current + 2} pe aa gaye. ${quizQuestions.length - current - 1} sawaal baaki hain.`);
    } else {
      setShowForm(true);
      setStatusMessage('Quiz khatam! Apni details bhariye.');
    }
  };

  const goBack = () => {
    if (showForm) {
      setShowForm(false);
      setStatusMessage('Quiz pe wapis aa gaye.');
    } else if (current > 0) {
      setCurrent(current - 1);
      setStatusMessage(`Sawaal ${current} pe wapis aa gaye.`);
    }
  };

  // Voice commands
  const { isListening, startListening, stopListening, supported: voiceSupported } = useVoiceControl([
    {
      pattern: ['option ek', 'pehla', 'number one', 'ek'],
      action: () => selectOption(0),
      description: 'Pehla option select karo',
    },
    {
      pattern: ['option do', 'doosra', 'number two', 'do'],
      action: () => selectOption(1),
      description: 'Doosra option select karo',
    },
    {
      pattern: ['option teen', 'teesra', 'number three', 'teen'],
      action: () => selectOption(2),
      description: 'Teesra option select karo',
    },
    {
      pattern: ['option chaar', 'chautha', 'number four', 'chaar'],
      action: () => selectOption(3),
      description: 'Chautha option select karo',
    },
    {
      pattern: ['agle', 'next', 'aage', 'agla'],
      action: () => goNext(),
      description: 'Agle sawaal pe jao',
    },
    {
      pattern: ['wapis', 'peeche', 'back'],
      action: () => goBack(),
      description: 'Pichle sawaal pe jao',
    },
    {
      pattern: ['dobara suno', 'repeat', 'phir suno', 'sawaal sunao'],
      action: () => speak(`Sawaal ${current + 1}: ${question.question}`),
      description: 'Sawaal dobara suno',
    },
    {
      pattern: ['skip', 'chodo', 'agla'],
      action: () => skipQuestion(),
      description: 'Sawaal skip karo',
    },
  ]);

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
      {/* Visually hidden live region — screen readers announce every action */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>

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
          <div
            role="progressbar"
            aria-valuenow={showForm ? quizQuestions.length : current + 1}
            aria-valuemin={1}
            aria-valuemax={quizQuestions.length}
            aria-label={`Quiz progress: Sawaal ${showForm ? quizQuestions.length : current + 1} of ${quizQuestions.length}`}
            className="h-3 bg-muted rounded-full overflow-hidden"
          >
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
              {/* Voice & TTS Controls */}
              {(voiceSupported || ttsSupported) && (
                <div className="flex items-center gap-2 mb-4">
                  {ttsSupported && (
                    <button
                      type="button"
                      onClick={() =>
                        isSpeaking
                          ? stop()
                          : speak(`Sawaal ${current + 1}: ${question.question}`)
                      }
                      aria-label={isSpeaking ? 'Bolna band karo' : 'Sawaal bol ke sunao'}
                      title={isSpeaking ? 'Bolna band karo' : 'Sawaal bol ke sunao'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold border transition-all ${
                        isSpeaking
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {isSpeaking ? 'Bol raha hai...' : 'Sawaal Suno'}
                    </button>
                  )}
                  {voiceSupported && (
                    <button
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      aria-label={isListening ? 'Voice control band karo' : 'Voice se jawab do'}
                      title={isListening ? 'Voice control band karo' : 'Voice se jawab do'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold border transition-all ${
                        isListening
                          ? 'border-red-500 bg-red-500/10 text-red-500 animate-pulse'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {isListening ? 'Sun raha hai...' : 'Voice'}
                    </button>
                  )}
                </div>
              )}

              <p className="font-body text-sm text-muted-foreground mb-4 italic border-l-2 border-primary/50 pl-3">
                {mentorLine}
              </p>

              <h2
                className="font-display font-bold text-2xl md:text-3xl text-foreground mb-8"
                aria-live="polite"
                aria-label={`Sawaal ${current + 1}: ${question.question}`}
              >
                {question.question}
              </h2>

              <div
                role="radiogroup"
                aria-label={`Sawaal ${current + 1} ke options`}
                className="space-y-3"
              >
                {question.options.map((option, idx) => {
                  const isSelected = answers[current].includes(idx);
                  const optionLabels = ['Pehla', 'Doosra', 'Teesra', 'Chautha'];
                  return (
                    <motion.button
                      key={idx}
                      role="radio"
                      aria-checked={isSelected}
                      aria-pressed={isSelected}
                      aria-label={`Option ${idx + 1}: ${option.text}${
                        isSelected ? ' — selected' : ''
                      }. Bolne ke liye kahein: "${optionLabels[idx] ?? `option ${idx + 1}`}"`}
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
                  aria-label="Pichle sawaal pe jao"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-30 font-display font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Peeche
                </button>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={skipQuestion}
                    aria-label="Yeh sawaal skip karo, score nahi milega"
                    className="flex items-center justify-center gap-2 font-display font-semibold px-5 py-3 rounded-xl border-2 border-border bg-card text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <SkipForward className="w-4 h-4" /> Skip — score nahi
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!hasAnswer}
                    aria-label={current === quizQuestions.length - 1 ? 'Quiz submit karo' : 'Agle sawaal pe jao'}
                    className={`flex items-center justify-center gap-2 font-display font-bold px-6 py-3 rounded-xl transition-all ${
                      hasAnswer
                        ? "gradient-hero text-primary-foreground hover:opacity-90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {current === quizQuestions.length - 1 ? "Lagbhag Ho Gaya! <span aria-hidden="true">✨</span>" : "Aage"}
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
