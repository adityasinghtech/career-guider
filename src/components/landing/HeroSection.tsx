import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Sparkles, Zap, ArrowRight, Rocket } from "lucide-react";

const stats = [
  { number: "10K+", label: "Students Guided", emoji: "🎓" },
  { number: "500+", label: "Schools Connected", emoji: "🏫" },
  { number: "95%", label: "Accuracy Rate", emoji: "🎯" },
  { number: "3 min", label: "Quiz Duration", emoji: "⚡" },
];

const floatingBadges = [
  { text: "AI Engineer 🤖", x: "10%", y: "20%", delay: 0 },
  { text: "Doctor 👨‍⚕️", x: "85%", y: "15%", delay: 0.5 },
  { text: "CA ₹50L 💰", x: "5%", y: "70%", delay: 1 },
  { text: "IIT Topper 🏆", x: "88%", y: "65%", delay: 1.5 },
];

const HeroSection = () => (
  <section className="pt-28 pb-20 px-4 relative overflow-hidden">
    {/* Animated background blobs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] animate-float" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary-glow/5 blur-[100px] animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/5 animate-rotate-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-accent/5 animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
    </div>

    {/* Floating career badges - hidden on mobile */}
    {floatingBadges.map((badge, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: badge.delay + 0.8, duration: 0.5 }}
        className="hidden lg:block absolute text-xs font-display font-semibold bg-card/80 backdrop-blur-sm border border-border/50 px-3 py-1.5 rounded-full shadow-card animate-float"
        style={{ left: badge.x, top: badge.y, animationDelay: `${badge.delay}s` }}
      >
        {badge.text}
      </motion.div>
    ))}

    <div className="max-w-5xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 gradient-hero-subtle border border-primary/20 text-primary font-display font-semibold px-5 py-2.5 rounded-full text-sm mb-8"
        >
          <Sparkles className="w-4 h-4" /> 🇮🇳 India ka #1 FREE Career Guidance Platform
        </motion.div>

        {/* Main heading */}
        <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-8 tracking-tight">
          Sapne Dekho,{" "}
          <span className="text-gradient-hero">
            Raasta Hum Dikhayenge
          </span>
          <br className="hidden sm:block" />
          <span className="text-3xl md:text-5xl lg:text-6xl"> — Aapka Future, Aapki Choice! 🚀</span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 font-body leading-relaxed"
        >
          15 sawaal ka <strong className="text-foreground">FREE quiz</strong> dijiye aur jaaniye — Science, Commerce ya Arts — aapke liye kaunsa stream{" "}
          <strong className="text-foreground">perfect</strong> hai.
          Saath mein milega <strong className="text-foreground">15-year career roadmap</strong>, top colleges, scholarships aur free courses! 🎯
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-primary font-display font-semibold mb-10 flex items-center justify-center gap-1"
        >
          <Zap className="w-4 h-4" /> 10,000+ students ne apna career clear kiya — ab aapki baari! ⚡
        </motion.p>

        {/* CTA Buttons */}
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
            Pehle Dekho Lein 👀
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-muted-foreground font-body"
        >
          {["100% Free", "Instant Results", "Parents PDF Report", "15-Year Roadmap"].map((badge) => (
            <span key={badge} className="flex items-center gap-1 bg-muted/60 px-3 py-1.5 rounded-full border border-border/30">
              ✅ {badge}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 shadow-card border border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all cursor-default"
          >
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="font-display font-bold text-2xl md:text-3xl text-gradient-hero">{stat.number}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;