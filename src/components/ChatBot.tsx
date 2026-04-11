import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-chat`;
const STORAGE_KEY = "pathfinder_chat_history";

// ─────────────────────────────────────────────
// QUIZ PROFILE HELPERS
// ─────────────────────────────────────────────
function getQuizProfile() {
  try {
    const raw = localStorage.getItem("pathfinder_quiz_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStreamEmoji(stream: string) {
  if (!stream) return "🎯";
  const s = stream.toLowerCase();
  if (s === "science") return "🔬";
  if (s === "commerce") return "📈";
  if (s === "arts") return "🎨";
  return "🎯";
}

// ─────────────────────────────────────────────
// PERSONALIZED GREETING based on quiz result
// ─────────────────────────────────────────────
function buildInitialMessage(profile: any): Message {
  if (!profile) {
    return {
      role: "assistant",
      content:
        "Namaste! 👋 Main **PathFinder AI** hoon — aapka career guidance assistant!\n\nStream, colleges, scholarships, exams — kuch bhi poochhein! 🎯\n\n💡 *Tip: Pehle quiz dein toh main aapko personalized advice de sakta hoon!*",
    };
  }

  const stream = profile.stream || "Unknown";
  const emoji = getStreamEmoji(stream);
  const personality = profile.personality || "Explorer";
  const confidence = profile.confidence || 0;
  const careers = (profile.suggestedCareers || []).slice(0, 2).join(", ");

  let confidenceMsg = "";
  if (confidence > 70) {
    confidenceMsg = `Aapka **${stream} stream** bilkul clear hai — ${confidence}% match! 💪`;
  } else if (confidence > 50) {
    confidenceMsg = `**${stream} stream** aapke liye best fit hai — ${confidence}% match! Thoda aur explore karein.`;
  } else {
    confidenceMsg = `Quiz se pata chala ki aap ek **${personality}** hain — multiple streams explore karo! 🌟`;
  }

  return {
    role: "assistant",
    content: `Namaste! 👋 Maine aapka quiz result dekh liya! ${emoji}\n\n${confidenceMsg}\n\nAb seedha poochhein:\n- 🎓 Kaunse colleges best hain?\n- 📝 Kaunse exams dene chahiye?\n- 💰 Scholarships kaise milegi?\n- 🗺️ Career roadmap kya hoga?\n\nKuch bhi poochhein — main aapke **${stream} stream** ke hisaab se specifically bataunga! 🚀`,
  };
}

// ─────────────────────────────────────────────
// QUICK QUESTIONS based on stream
// ─────────────────────────────────────────────
function getQuickQuestions(profile: any): string[] {
  if (!profile) {
    return [
      "Science mein kya scope hai?",
      "Commerce ke best colleges?",
      "Arts mein kitni salary milti hai?",
      "Scholarships kaise milti hain?",
      "Career confusion hai, help karo",
    ];
  }

  const stream = (profile.stream || "").toLowerCase();

  if (stream === "science") {
    return [
      "JEE ya NEET — kaunsa better hai mere liye?",
      "IIT ke liye kya preparation chahiye?",
      "Science mein best salary wala career?",
      "KVPY scholarship kaise milti hai?",
      "Mere liye roadmap banao",
    ];
  }

  if (stream === "commerce") {
    return [
      "CA banna chahiye ya MBA?",
      "IIM ke liye kya karna padega?",
      "Commerce mein sabse high salary career?",
      "CA Foundation kaise start karein?",
      "Mere liye roadmap banao",
    ];
  }

  if (stream === "arts") {
    return [
      "UPSC ya Law — kaunsa better hai?",
      "NLU Delhi mein admission kaise hoga?",
      "Arts mein ₹10 LPA+ salary wala career?",
      "CLAT preparation kaise karein?",
      "Mere liye roadmap banao",
    ];
  }

  return [
    "Mere stream ke best colleges?",
    "Kaunse exams dene chahiye?",
    "Scholarships kaise milti hain?",
    "Career roadmap banao mere liye",
    "Salary comparison — kaunsa career best?",
  ];
}

// ─────────────────────────────────────────────
// CHAT HISTORY (localStorage)
// ─────────────────────────────────────────────
function loadChatHistory(profile: any): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [buildInitialMessage(profile)];
}

function saveChatHistory(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
  } catch {}
}

// ─────────────────────────────────────────────
// CHATBOT COMPONENT
// ─────────────────────────────────────────────
const ChatBot = () => {
  const quizProfile = useMemo(() => getQuizProfile(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => loadChatHistory(quizProfile));
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = useMemo(() => getQuickQuestions(quizProfile), [quizProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  const clearChat = () => {
    const fresh = [buildInitialMessage(quizProfile)];
    setMessages(fresh);
    localStorage.removeItem(STORAGE_KEY);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          quizProfile: quizProfile || undefined,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "AI se connect nahi ho paaya");
      }

      const data = await resp.json();
      const reply = data.reply || "Koi response nahi mila";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Maaf kijiye, kuch gadbad ho gayi 😔\n\n**${err.message || "Kripya dubara koshish karein."}**`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const showQuickQuestions = messages.length <= 1;
  const hasProfile = !!quizProfile;
  const streamEmoji = getStreamEmoji(quizProfile?.stream);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-hero shadow-elevated flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="Chat kholein"
          >
            {messages.length > 1 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            )}
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] bg-card border-2 border-border rounded-2xl shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-hero p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-primary-foreground text-sm">
                    PathFinder AI {streamEmoji}
                  </h3>
                  <p className="text-primary-foreground/70 text-[10px]">
                    {hasProfile
                      ? `${quizProfile.stream} stream • ${quizProfile.personality || "Personalized"}`
                      : "Career guidance assistant"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  title="Chat saaf karein"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Clear chat"
                >
                  <Trash2 className="w-4 h-4 text-primary-foreground" />
                </button>
                <button onClick={() => setIsOpen(false)} aria-label="Close chatbot">
                  <X className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.role === "user" ? "bg-primary" : "gradient-hero"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3 h-3 text-primary-foreground" />
                    ) : (
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1 [&>ul]:mb-1 [&>ol]:mb-1 [&>h1]:text-sm [&>h2]:text-sm [&>h3]:text-xs">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full gradient-hero flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-xl px-3 py-2 rounded-tl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions — stream-specific */}
            {showQuickQuestions && (
              <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-thin">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="flex-shrink-0 text-[10px] bg-primary/10 text-primary font-display font-semibold px-2.5 py-1.5 rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    hasProfile
                      ? `${quizProfile.stream} ke baare mein poochhein...`
                      : "Apna sawaal poochhein..."
                  }
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-body outline-none focus:border-primary transition-colors"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 text-primary-foreground" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
