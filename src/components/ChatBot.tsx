import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type QuizProfile = any;
type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-chat`;

const quickQuestions = [
  "Science mein kya scope hai?",
  "Commerce ke best colleges?",
  "Arts mein kitni salary milti hai?",
  "Scholarships kaise milti hain?",
  "JEE ki tayyari kaise karein?",
];

function getQuizProfile(): QuizProfile | null {
  try {
    const raw = localStorage.getItem("pathfinder_quiz_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! 👋 Main **PathFinder AI** hoon — aapka career guidance assistant!\n\nStream, colleges, scholarships, exams — kuch bhi poochhein! 🎯",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const quizProfile = useMemo(() => getQuizProfile(), [isOpen]);

  const personalizedQuickQuestions = useMemo(() => {
    if (!quizProfile) return quickQuestions;
    const stream = quizProfile.stream;
    return [
      `Mera ${stream} stream ke liye best career kaunsa hai?`,
      `${stream} mein top colleges bataayein`,
      `Mere liye personalized roadmap banaayein`,
      "Scholarships kaise milti hain?",
      "Kya meri stream sahi hai?",
    ];
  }, [quizProfile]);

  // ✅ FIXED sendMessage — simple JSON fetch, correct auth header
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
          // ✅ Fixed: use ANON key, not PUBLISHABLE key
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          quizProfile: quizProfile || undefined,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "AI se connect nahi ho paaya");
      }

      // ✅ Fixed: simple JSON response (not streaming)
      const data = await resp.json();
      const reply = data.reply || "Koi response nahi mila";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Maaf kijiye, kuch gadbad ho gayi 😔\n\n${
            err.message || "Kripya dubara koshish karein."
          }`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

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
                    PathFinder AI 🤖
                  </h3>
                  <p className="text-primary-foreground/70 text-[10px]">
                    Career guidance assistant
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close chatbot">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
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

              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full gradient-hero flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-xl px-3 py-2 rounded-tl-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-thin">
                {personalizedQuickQuestions.map((q) => (
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
                  placeholder="Apna sawaal poochhein..."
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