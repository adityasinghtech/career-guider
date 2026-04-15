import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, Clock, HelpCircle, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ContactIssueTypeId = "quiz" | "login" | "result" | "career" | "other";

const CONTACT_ISSUE_MESSAGE_PREFIX: Record<ContactIssueTypeId, string> = {
  quiz: "[QUIZ ISSUE] ",
  login: "[LOGIN ISSUE] ",
  result: "[RESULT ISSUE] ",
  career: "[CAREER GUIDANCE] ",
  other: "[OTHER] ",
};

/** Replace with your WhatsApp number (digits only, country code without +) */
const PLACEHOLDER_WHATSAPP_NUMBER = "919315861151";

const issueTypeOptions: {
  id: ContactIssueTypeId;
  title: string;
  description: string;
}[] = [
  { id: "quiz", title: "<span aria-hidden='true'>🎯</span> Quiz Issue", description: "Quiz se related problem" },
  { id: "login", title: "<span aria-hidden='true'>🔐</span> Login Issue", description: "Login ya signup mein dikkat" },
  { id: "result", title: "<span aria-hidden='true'>📊</span> Result Issue", description: "Result ya recommendation se problem" },
  { id: "career", title: "<span aria-hidden='true'>💬</span> Career Guidance", description: "Career advice chahiye" },
  { id: "other", title: "<span aria-hidden='true'>❓</span> Other", description: "Kuch aur" },
];

const faqs = [
  { q: "Kya PathFinder free hai?", a: "Ji haan! 100% free hai students ke liye. Koi hidden charges nahi. Quiz dijiye, results dekhein, PDF download karein — sab free!" },
  { q: "Kya ye quiz accurate hai?", a: "Humara quiz research-based hai — career counseling principles pe built hai. Ye aapke interests aur strengths ke basis pe recommendation deta hai. Lekin final decision hamesha aapka hai!" },
  { q: "Kya parents bhi use kar sakte hain?", a: "Bilkul! Parents apne bachche ke saath baith ke quiz karwa sakte hain. Results PDF download karke discuss bhi kar sakte hain." },
  { q: "School ke liye batch testing kaise karein?", a: "WhatsApp pe contact karein — hum free batch testing setup kar denge aapke school ke liye. 50-500 students tak handle kar sakte hain!" },
  { q: "Kya data safe hai?", a: "Ji haan! Hum sirf basic info lete hain (name, phone, email) follow-up ke liye. Koi data third party ke saath share nahi hota." },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    type: "student",
    issueType: "career" as ContactIssueTypeId,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseRow = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      sender_type: formData.type,
    };

    try {
      const withColumn = await supabase.from("contact_messages").insert({
        ...baseRow,
        message: formData.message,
        issue_type: formData.issueType,
      });

      if (!withColumn.error) {
        setSubmitted(true);
        toast.success("Message bhej diya! <span aria-hidden='true'>✅</span>", { description: "Hum jald hi reply karenge" });
        return;
      }

      const msg = withColumn.error.message || "";
      const likelyMissingColumn =
        /issue_type|column|schema|42703|PGRST204/i.test(msg) || withColumn.error.code === "PGRST204";

      if (!likelyMissingColumn) {
        toast.error("Message bhej nahi paaya <span aria-hidden='true'>😔</span>", { description: "Kripya dubara koshish karein" });
        return;
      }

      const prefixedMessage = CONTACT_ISSUE_MESSAGE_PREFIX[formData.issueType] + formData.message;
      const fallback = await supabase.from("contact_messages").insert({
        ...baseRow,
        message: prefixedMessage,
      });

      if (fallback.error) {
        toast.error("Message bhej nahi paaya <span aria-hidden='true'>😔</span>", { description: "Kripya dubara koshish karein" });
        return;
      }

      setSubmitted(true);
      toast.success("Message bhej diya! <span aria-hidden='true'>✅</span>", { description: "Hum jald hi reply karenge" });
    } catch {
      const prefixedMessage = CONTACT_ISSUE_MESSAGE_PREFIX[formData.issueType] + formData.message;
      const fallback = await supabase.from("contact_messages").insert({
        ...baseRow,
        message: prefixedMessage,
      });
      if (fallback.error) {
        toast.error("Message bhej nahi paaya <span aria-hidden='true'>😔</span>", { description: "Kripya dubara koshish karein" });
        return;
      }
      setSubmitted(true);
      toast.success("Message bhej diya! <span aria-hidden='true'>✅</span>", { description: "Hum jald hi reply karenge" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display font-900 text-4xl md:text-5xl text-foreground mb-4">
            Madad Chahiye? Sampark Karein! <span aria-hidden="true">🤝</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Koi bhi sawaal ho — career guidance, quiz, colleges, ya scholarships — hum aapki madad ke liye hamesha taiyar hain!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">WhatsApp (Sabse Tez!) <span aria-hidden="true">💬</span></h3>
                  <p className="text-sm text-muted-foreground">Direct message karein — 2 ghante mein reply</p>
                </div>
              </div>
              <a
                href="https://wa.me/919315861151?text=Namaste%20PathFinder!%20Mujhe%20career%20guidance%20chahiye"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 gradient-hero text-primary-foreground font-display font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                WhatsApp pe Message Karein →
              </a>
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">Email <span aria-hidden="true">📧</span></h3>
                  <p className="text-sm text-primary font-medium">help@pathfinder.app</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">Phone <span aria-hidden="true">📞</span></h3>
                  <p className="text-sm text-primary font-medium"> +91 9315861151</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">Reply Time <span aria-hidden="true">⏰</span></h3>
                  <p className="text-sm text-muted-foreground">WhatsApp: 2 hours • Email: 24 hours</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-6 shadow-card"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10 px-2"
              >
                <div className="text-5xl mb-4"><span aria-hidden="true">✅</span></div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">Message bhej diya! <span aria-hidden="true">✅</span></h3>
                <p className="text-muted-foreground font-body mb-6">Hum jald hi reply karenge</p>
                <a
                  href={`https://wa.me/${PLACEHOLDER_WHATSAPP_NUMBER}?text=${encodeURIComponent("Namaste PathFinder! Mujhe madad chahiye.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 gradient-hero text-primary-foreground font-display font-semibold px-5 py-3 rounded-xl shadow-card hover:opacity-90 transition-opacity text-sm w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp pe bhi contact karein
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display font-bold text-lg text-foreground mb-2">Message Bhejein <span aria-hidden="true">✍️</span></h3>

                <div>
                  <label className="text-sm font-display font-semibold text-foreground block mb-1">Aap kaun hain?</label>
                  <div className="flex gap-2">
                    {["student", "parent", "school", "other"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, type }))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-display font-semibold transition-colors ${
                          formData.type === type
                            ? "gradient-hero text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {type === "student" ? "Student <span aria-hidden='true'>👨</span>‍<span aria-hidden='true'>🎓</span>" : type === "parent" ? "Parent <span aria-hidden='true'>👨</span>‍<span aria-hidden='true'>👩</span>‍<span aria-hidden='true'>👦</span>" : type === "school" ? "School <span aria-hidden='true'>🏫</span>" : "Other"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-display font-semibold text-foreground block mb-1">Naam *</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground font-body focus:border-primary focus:outline-none"
                    placeholder="Apna naam likhein"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-display font-semibold text-foreground block mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground font-body focus:border-primary focus:outline-none"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-display font-semibold text-foreground block mb-1">Phone</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground font-body focus:border-primary focus:outline-none"
                      placeholder="9315861151"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-display font-semibold text-foreground block mb-2">Issue Type *</label>
                  <div className="space-y-2">
                    {issueTypeOptions.map((opt) => {
                      const selected = formData.issueType === opt.id;
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData((p) => ({ ...p, issueType: opt.id }))}
                          className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all font-body ${
                            selected
                              ? "border-primary bg-primary/10 shadow-card"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selected ? "border-primary bg-primary" : "border-muted-foreground/30"
                              }`}
                            >
                              {selected && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                            </div>
                            <div>
                              <span
                                className={`font-display font-semibold text-sm block ${selected ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {opt.title}
                              </span>
                              <span className="text-xs text-muted-foreground">{opt.description}</span>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-display font-semibold text-foreground block mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground font-body focus:border-primary focus:outline-none resize-none"
                    placeholder="Apna sawaal ya message yahan likhein..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gradient-hero text-primary-foreground font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Message Bhejein <span aria-hidden="true">🚀</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
        >
          <h2 className="font-display font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" /> Aksar Poochhe Jaane Wale Sawaal (FAQ) <span aria-hidden="true">❓</span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-muted/50 rounded-xl">
                <summary className="p-4 cursor-pointer font-display font-semibold text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-primary group-open:rotate-180 transition-transform"><span aria-hidden="true">▼</span></span>
                </summary>
                <p className="px-4 pb-4 text-muted-foreground text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
