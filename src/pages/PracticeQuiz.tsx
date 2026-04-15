import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle, XCircle, RefreshCw, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  conceptBridge: string;
}

type StreamKey = "science" | "commerce" | "arts";
type Difficulty = "easy" | "medium" | "hard";

const subjectMap: Record<StreamKey, string[]> = {
  science: ["Physics", "Chemistry", "Biology", "Mathematics"],
  commerce: ["Economics", "Accountancy", "Business Studies", "Mathematics"],
  arts: ["History", "Geography", "Political Science", "Hindi Literature", "English Literature"],
};

export default function PracticeQuiz() {
  const [stream, setStream] = useState<StreamKey>("science");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("pathfinder_quiz_profile") || "{}");
      if (p.stream && ["science", "commerce", "arts"].includes(p.stream)) {
        setStream(p.stream as StreamKey);
      }
    } catch {/* ignore */ }
  }, []);

  useEffect(() => {
    setSubject(subjectMap[stream][0]);
  }, [stream]);

  const score = questions.reduce(
    (acc, q, i) => (userAnswers[i] === q.correct ? acc + 1 : acc),
    0
  );

  async function generateQuestions() {
    if (!topic.trim()) { setError("Topic likhna zaroori hai!"); return; }
    setLoading(true); setError(""); setQuestions([]); setQuizDone(false);
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('practice-quiz-generate', {
        body: { stream, subject, topic, difficulty, numQuestions }
      });

      if (fnError) throw new Error(fnError.message);
      if (fnData?.error) throw new Error(fnData.error);
      if (!fnData?.questions) throw new Error("Questions generate nahi huye");

      setQuestions(fnData.questions);
      setCurrentIdx(0);
      setUserAnswers({});
      setShowExplanation(false);
    } catch (err: any) {
      setError(err.message || "Questions generate nahi ho sake. Topic dobara try karo ya thodi der baad koshish karo.");
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setQuestions([]);
    setCurrentIdx(0);
    setUserAnswers({});
    setShowExplanation(false);
    setQuizDone(false);
    setTopic("");
    setError("");
  }

  const currentQ = questions[currentIdx];
  const currentAnswer = userAnswers[currentIdx];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-6xl mb-3">🧠</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">AI Practice Quiz</h1>
          <p className="text-muted-foreground font-body">AI se personalized practice questions generate karo!</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Setup Screen */}
          {questions.length === 0 && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <Card>
                <CardHeader><CardTitle className="font-display">1️⃣ Stream chuno</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {(["science", "commerce", "arts"] as StreamKey[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStream(s)}
                        className={`flex-1 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${
                          stream === s ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {s === "science" ? (
                          "🔬"
                        ) : s === "commerce" ? (
                          "📈"
                        ) : (
                          "🎨"
                        )}{" "}
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="font-display">2️⃣ Subject chuno</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {subjectMap[stream].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSubject(s)}
                        className={`px-4 py-2 rounded-xl border-2 font-display font-semibold text-sm transition-all ${
                          subject === s ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="font-display">3️⃣ Topic likho</CardTitle></CardHeader>
                <CardContent>
                  <input
                    type="text"
                    placeholder={
                      stream === "science" ? "jaise: Newton's Laws, Photosynthesis, Quadratic Equations" :
                      stream === "commerce" ? "jaise: Journal Entries, Supply and Demand, Balance Sheet" :
                      "jaise: Mughal Empire, Indian Constitution, Tragedy in English Lit"
                    }
                    value={topic}
                    onChange={(e) => { setTopic(e.target.value); setError(""); }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                  />
                  {error && <p className="text-destructive text-sm mt-2 font-body">{error}</p>}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="font-display text-base">4️⃣ Difficulty</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`flex-1 py-2 rounded-xl font-display font-semibold text-sm transition-all capitalize ${
                            difficulty === d ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {d === "easy" ? (
                            "😊"
                          ) : d === "medium" ? (
                            "🤔"
                          ) : (
                            "🔥"
                          )}{" "}
                          {d}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="font-display text-base">5️⃣ Questions</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {[3, 5, 10].map((n) => (
                        <button
                          key={n}
                          onClick={() => setNumQuestions(n)}
                          className={`flex-1 py-2 rounded-xl font-display font-semibold text-sm transition-all ${
                            numQuestions === n ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div >

    <Button
      onClick={generateQuestions}
      disabled={loading || !topic.trim()}
      className="w-full gradient-hero text-primary-foreground font-display font-bold text-lg py-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
    >
      {loading ? (
        <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Questions generate ho rahe hain...</span>
      ) : (
        <>
          Questions Generate Karo ✨
        </>
      )}
              </Button >
            </motion.div >
          )
}

{/* Quiz Screen */ }
{
  questions.length > 0 && !quizDone && currentQ && (
    <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm font-display text-muted-foreground mb-1.5">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Object.keys(userAnswers).length} answered</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-hero rounded-full"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="border-2">
        <CardContent className="pt-5 space-y-5">
          <Badge variant="secondary" className="font-body text-xs">{currentQ.conceptBridge}</Badge>
          <p className="font-display font-bold text-lg text-foreground leading-snug">{currentQ.question}</p>

          <div className="space-y-2">
            {currentQ.options.map((opt, i) => {
              const isSelected = currentAnswer === opt;
              const isCorrect = opt === currentQ.correct;
              const showResult = showExplanation;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!currentAnswer) {
                      setUserAnswers((prev) => ({ ...prev, [currentIdx]: opt }));
                    }
                  }}
                  disabled={!!currentAnswer}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-body text-sm transition-all ${!currentAnswer
                      ? "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
                      : showResult && isCorrect
                        ? "border-green-400 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-200"
                        : showResult && isSelected && !isCorrect
                          ? "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200"
                          : isSelected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-card text-muted-foreground"
                    }`}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                </button>
              );
            })}
          </div>

          {currentAnswer && !showExplanation && (
            <Button onClick={() => setShowExplanation(true)} variant="outline" className="w-full font-display">
              💡 Explanation dekho
            </Button>
          )}

          {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={`rounded-xl p-4 ${currentAnswer === currentQ.correct ? "bg-green-50 dark:bg-green-950/30 border border-green-300" : "bg-red-50 dark:bg-red-950/30 border border-red-300"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {currentAnswer === currentQ.correct
                          ? <CheckCircle className="w-5 h-5 text-green-600" />
                          : <XCircle className="w-5 h-5 text-red-600" />}
                        <span className="font-display font-bold text-sm">
                          {currentAnswer === currentQ.correct ? (
                            <>
                              Sahi jawab! 🎉
                            </>
                          ) : (
                            `Galat — Sahi hai: ${currentQ.correct}`
                          )}
                        </span>
                      </div>
                      <p className="font-body text-sm text-foreground">{currentQ.explanation}</p>
                    </motion.div>
                  )}
      </CardContent>
    </Card>

              {/* Navigation */ }
  <div className="flex items-center gap-3">
    <Button
      variant="outline"
      onClick={() => { setCurrentIdx((p) => Math.max(0, p - 1)); setShowExplanation(false); }}
      disabled={currentIdx === 0}
      className="font-display"
    >
      ← Peeche
    </Button>
    <span className="flex-1 text-center font-display text-sm text-muted-foreground">
      {currentIdx + 1} / {questions.length}
    </span>
    {currentIdx < questions.length - 1 ? (
      <Button
        onClick={() => { setCurrentIdx((p) => p + 1); setShowExplanation(false); }}
        className="gradient-hero text-primary-foreground font-display"
      >
        Aage →
      </Button>
    ) : (
      <Button
        onClick={() => setQuizDone(true)}
        className="gradient-hero text-primary-foreground font-display"
        disabled={Object.keys(userAnswers).length < questions.length}
      >
        Submit 🏁
      </Button>
    )}
  </div>
            </motion.div >
          )
}

{/* Results Screen */ }
{
  quizDone && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <Card className="text-center border-2 border-primary/30">
                <CardContent className="pt-8 pb-6">
                  <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4">
                    <span className="font-display font-bold text-3xl text-primary-foreground">{score}/{questions.length}</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-foreground mb-1">
                    {score === questions.length ? (
                      <>
                        Perfect! 🎉
                      </>
                    ) : score >= questions.length * 0.7 ? (
                      <>
                        Bahut accha! 👍
                      </>
                    ) : (
                      <>
                        Practice karo! 💪
                      </>
                    )}
                  </h2>
                  <p className="text-muted-foreground font-body">
                    {score} sahi jawab out of {questions.length}
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-2">
                {questions.map((q, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${userAnswers[i] === q.correct ? "border-green-300 bg-green-50 dark:bg-green-950/20" : "border-red-300 bg-red-50 dark:bg-red-950/20"}`}>
                    {userAnswers[i] === q.correct
                      ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      : <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-body text-sm text-foreground font-semibold">{q.question.slice(0, 80)}...</p>
                      {userAnswers[i] !== q.correct && (
                        <p className="font-body text-xs text-green-700 dark:text-green-400 mt-0.5">✓ Sahi: {q.correct}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={resetAll} variant="outline" className="flex-1 font-display">
                  <RefreshCw className="w-4 h-4 mr-1" /> Naya topic
                </Button>
                <Button
                  onClick={() => { setCurrentIdx(0); setShowExplanation(false); setQuizDone(false); setUserAnswers({}); }}
                  className="flex-1 gradient-hero text-primary-foreground font-display"
                >
                  <Brain className="w-4 h-4 mr-1" /> Dobara khelo
                </Button>
              </div>
            </motion.div >
          )
}
        </AnimatePresence >
      </div >
    </div >
  );
}

