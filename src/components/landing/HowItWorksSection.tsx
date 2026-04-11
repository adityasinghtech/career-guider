import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

const steps = [
  { step: "1", title: "Quiz Dijiye 📝", desc: "15 fun sawaal answer karein — sirf 5 minute lagenge. Emoji wale mazedaar options!" },
  { step: "2", title: "Result Dekhein 📊", desc: "Turant pata chalega kaunsa stream best hai — match percentage ke saath!" },
  { step: "3", title: "Roadmap Follow Karein 🗺️", desc: "15-year plan milega — colleges, careers, courses, scholarships sab ek jagah" },
  { step: "4", title: "Share & Discuss 📱", desc: "PDF download karein, parents ko dikhayein, WhatsApp pe friends ko bhejein!" },
];

const HowItWorksSection = () => (
  <section className="py-20 px-4 relative overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 gradient-hero-subtle pointer-events-none" />

    <div className="max-w-5xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-block text-sm font-display font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4 border border-primary/15">
          🔄 Simple Process
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-14">
          Kaise Kaam Karta Hai? 🤔
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6 relative">
        {/* Connecting line (desktop) */}
        <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary-glow/20" />

        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="relative group"
          >
            <div
              className="w-12 h-12 rounded-full gradient-hero text-primary-foreground font-display font-bold text-xl flex items-center justify-center mx-auto mb-5 relative z-10 shadow-[0_8px_24px_rgba(var(--primary-rgb),0.4)] ring-4 ring-primary/20 group-hover:scale-105 transition-transform duration-300"
            >
              {s.step}
            </div>
            <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 group-hover:border-primary/25 group-hover:shadow-elevated transition-all">
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <Link
          to="/quiz"
          className="group inline-flex items-center gap-3 mt-14 gradient-hero text-primary-foreground font-display font-bold px-10 py-5 rounded-2xl text-xl hover:opacity-90 transition-all shadow-elevated animate-pulse-glow"
        >
          <Rocket className="w-5 h-5" /> Chaliye Shuru Karte Hain!
          <span className="group-hover:translate-x-1 transition-transform">💪</span>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection;