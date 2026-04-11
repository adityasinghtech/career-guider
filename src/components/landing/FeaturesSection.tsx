import { motion } from "framer-motion";
import { Compass, BookOpen, GraduationCap, TrendingUp, Clock, Download, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Sirf 5 Minute ⏱️",
    desc: "15 fun questions, aur aapka career path crystal clear!",
  },
  {
    icon: Compass,
    title: "AI Smart Recommendation 🧠",
    desc: "Science, Commerce, ya Arts — kya best hai aapke liye + match percentage",
  },
  {
    icon: BookOpen,
    title: "15-Year Roadmap 🗺️",
    desc: "2026 se 2040 tak ka complete plan — kya karna hai, kab karna hai",
  },
  {
    icon: GraduationCap,
    title: "All India Colleges 🎓",
    desc: "IIT, AIIMS, NLU se lekar state colleges tak — fees aur cutoffs ke saath",
  },
  {
    icon: Download,
    title: "Parents PDF Report 📥",
    desc: "Download karein, parents ko dikhayein — unhe bhi samajh aayega",
  },
  {
    icon: TrendingUp,
    title: "Career Paths + Salary 💰",
    desc: "₹5 LPA se ₹50 LPA tak — kaunsa career kitna paisa dega",
  },
  {
    icon: Shield,
    title: "FREE Government Courses 🆓",
    desc: "SWAYAM, NPTEL, Google — ₹2 Lakh ki value ke courses bilkul free!",
  },
  {
    icon: Smartphone,
    title: "WhatsApp Share 📱",
    desc: "Ek click mein friends ko share karein — sabko test karwayein!",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const FeaturesSection = () => (
  <section id="features" className="py-20 px-4 relative overflow-hidden">
    <div className="absolute inset-0 gradient-hero-subtle pointer-events-none" />

    <div className="max-w-6xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="inline-block text-sm font-display font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4 border border-primary/15">
          ✨ Premium Features
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4">
          Aapko Kya Milega? 🎁
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          ₹5,000+ ki value — bilkul <strong className="text-foreground">FREE!</strong> Koi hidden charges nahi!
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={cardVariants}
            className="group bg-card rounded-2xl p-6 border border-border/50 border-l-4 border-l-primary/30 hover:border-l-primary transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="absolute inset-0 gradient-hero-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2 text-[15px]">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
