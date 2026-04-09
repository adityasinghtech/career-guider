import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, MapPin, Clock, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const faqs = [
  { q: "Kya PathFinder free hai?", a: "Ji haan! 100% free hai students ke liye. Koi hidden charges nahi. Quiz dijiye, results dekhein, PDF download karein — sab free!" },
  { q: "Kya ye quiz accurate hai?", a: "Humara quiz research-based hai — career counseling principles pe built hai. Ye aapke interests aur strengths ke basis pe recommendation deta hai. Lekin final decision hamesha aapka hai!" },
  { q: "Kya parents bhi use kar sakte hain?", a: "Bilkul! Parents apne bachche ke saath baith ke quiz karwa sakte hain. Results PDF download karke discuss bhi kar sakte hain." },
  { q: "School ke liye batch testing kaise karein?", a: "WhatsApp pe contact karein — hum free batch testing setup kar denge aapke school ke liye. 50-500 students tak handle kar sakte hain!" },
  { q: "Kya data safe hai?", a: "Ji haan! Hum sirf basic info lete hain (name, phone, email) follow-up ke liye. Koi data third party ke saath share nahi hota." },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", type: "student" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("contact_messages").insert({
      name: formData.name,
      email: formData.email || "",
      phone: formData.phone || "",
      message: formData.message,
      sender_type: formData.type,
    });
    if (error) {
      toast({ title: "Message bhej nahi paaya 😔", description: "Kripya dubara koshish karein", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Message bhej diya gaya! ✅", description: "Hum jaldi reply karenge 🙏" });
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
            Madad Chahiye? Sampark Karein! 🤝
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
                  <h3 className="font-display font-bold text-foreground">WhatsApp (Sabse Tez!) 💬</h3>
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
                  <h3 className="font-display font-bold text-foreground">Email 📧</h3>
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
                  <h3 className="font-display font-bold text-foreground">Phone 📞</h3>
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
                  <h3 className="font-display font-bold text-foreground">Reply Time ⏰</h3>
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
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">Message Bhej Diya Gaya!</h3>
                <p className="text-muted-foreground">Hum jaldi se jaldi reply karenge. Tab tak quiz try kar lijiye! 😄</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display font-bold text-lg text-foreground mb-2">Message Bhejein ✍️</h3>

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
                        {type === "student" ? "Student 👨‍🎓" : type === "parent" ? "Parent 👨‍👩‍👦" : type === "school" ? "School 🏫" : "Other"}
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
                  <Send className="w-4 h-4" /> Message Bhejein 🚀
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
            <HelpCircle className="w-6 h-6 text-primary" /> Aksar Poochhe Jaane Wale Sawaal (FAQ) ❓
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-muted/50 rounded-xl">
                <summary className="p-4 cursor-pointer font-display font-semibold text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
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
