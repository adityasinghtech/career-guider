import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Zap, ArrowRight, Rocket } from "lucide-react";

const stats = [
  { number: "10K+", label: "Students Guided", emoji: "<span aria-hidden='true'>🎓</span>" },
  { number: "500+", label: "Schools Connected", emoji: "<span aria-hidden='true'>🏫</span>" },
  { number: "95%", label: "Accuracy Rate", emoji: "<span aria-hidden='true'>🎯</span>" },
  { number: "3 min", label: "Quiz Duration", emoji: "<span aria-hidden='true'>⚡</span>" },
];

const careerBadges = [
  "AI Engineer <span aria-hidden='true'>🤖</span>",
  "Doctor <span aria-hidden='true'>👨</span>‍<span aria-hidden='true'>⚕️</span>",
  "CA ₹50L <span aria-hidden='true'>💰</span>",
  "IIT Topper <span aria-hidden='true'>🏆</span>",
];

const HeroSection = () => (
  <section className="pt-28 pb-20 px-4 relative overflow-hidden">
    {/* Depth: animated gradient orbs + subtle rings */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-1 -top-32 -right-32 md:right-0" />
      <div className="orb orb-2 -bottom-24 -left-24 md:left-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,800px)] h-[min(90vw,800px)] rounded-full border border-primary/5 animate-rotate-slow" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(70vw,600px)] h-[min(70vw,600px)] rounded-full border border-accent/5 animate-rotate-slow"
        style={{ animationDirection: "reverse", animationDuration: "30s" }}
      />
    </div>

    <div className="max-w-5xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Glass morphism panel — headline + intro copy */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl px-5 py-8 md:px-10 md:py-10 mb-8 md:mb-10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 gradient-hero-subtle border border-primary/20 text-primary font-display font-semibold px-5 py-2.5 rounded-full text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" /> <span aria-hidden="true">🇮🇳</span> India ka #1 FREE Career Guidance Platform
          </motion.div>

          <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-8 tracking-tight">
            Sapne Dekho,{" "}
            <span className="text-gradient-hero">
              Raasta Hum Dikhayenge
            </span>
            <br className="hidden sm:block" />
            <span className="text-3xl md:text-5xl lg:text-6xl"> — Aapka Future, Aapki Choice! <span aria-hidden="true">🚀</span></span>
          </h1>

          {/* Clean Horizontal Badges Row */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-8"
          >
            {careerBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (i * 0.1), duration: 0.4 }}
                className="bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400 font-display font-medium px-4 py-2 rounded-full text-sm shadow-sm transition-colors cursor-default border border-transparent hover:border-orange-200 dark:hover:border-orange-500/30"
              >
                {badge}
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 font-body leading-relaxed"
          >
            15 sawaal ka <strong className="text-foreground">FREE quiz</strong> dijiye aur jaaniye — Science, Commerce ya Arts — aapke liye kaunsa stream{" "}
            <strong className="text-foreground">perfect</strong> hai.
            Saath mein milega <strong className="text-foreground">15-year career roadmap</strong>, top colleges, scholarships aur free courses! <span aria-hidden="true">🎯</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-primary font-display font-semibold mb-0 flex items-center justify-center gap-1"
          >
            <Zap className="w-4 h-4" /> 10,000+ students ne apna career clear kiya — ab aapki baari! <span aria-hidden="true">⚡</span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/quiz"
            className="group gradient-hero text-primary-foreground font-display font-bold px-10 py-5 rounded-2xl text-xl hover:opacity-90 transition-all shadow-elevated animate-pulse-glow flex items-center gap-3"
          >
            <Rocket className="w-5 h-5" /> FREE Test Start Karein
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="border-2 border-border text-foreground font-display font-semibold px-8 py-4 rounded-xl text-lg hover:bg-muted hover:border-primary/20 transition-all"
          >
            Pehle Dekho Lein <span aria-hidden="true">👀</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-muted-foreground font-body"
        >
          {["100% Free", "Instant Results", "Parents PDF Report", "15-Year Roadmap"].map((badge) => (
            <span key={badge} className="flex items-center gap-1 bg-muted/60 px-3 py-1.5 rounded-full border border-border/30">
              <span aria-hidden="true">✅</span> {badge}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{ transformStyle: "preserve-3d" }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 shadow-card border border-border/50 hover:border-primary/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-300 cursor-default"
          >
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="font-display font-bold text-2xl md:text-3xl text-gradient-hero">{stat.number}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
