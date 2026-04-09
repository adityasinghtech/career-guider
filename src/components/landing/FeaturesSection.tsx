import { motion } from "framer-motion";
import { Compass, BookOpen, GraduationCap, TrendingUp, Clock, Download, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Sirf 5 Minute ⏱️",
    desc: "15 fun questions, aur aapka career path crystal clear!",
    color: "from-primary to-primary-glow",
  },
  {
    icon: Compass,
    title: "AI Smart Recommendation 🧠",
    desc: "Science, Commerce, ya Arts — kya best hai aapke liye + match percentage",
    color: "from-accent to-accent/80",
  },
  {
    icon: BookOpen,
    title: "15-Year Roadmap 🗺️",
    desc: "2026 se 2040 tak ka complete plan — kya karna hai, kab karna hai",
    color: "from-primary-glow to-primary",
  },
  {
    icon: GraduationCap,
    title: "All India Colleges 🎓",
    desc: "IIT, AIIMS, NLU se lekar state colleges tak — fees aur cutoffs ke saath",
    color: "from-secondary to-secondary/80",
  },
  {
    icon: Download,
    title: "Parents PDF Report 📥",
    desc: "Download karein, parents ko dikhayein — unhe bhi samajh aayega",
    color: "from-accent to-primary",
  },
  {
    icon: TrendingUp,
    title: "Career Paths + Salary 💰",
    desc: "₹5 LPA se ₹50 LPA tak — kaunsa career kitna paisa dega",
    color: "from-primary to-accent",
  },
  {
    icon: Shield,
    title: "FREE Government Courses 🆓",
    desc: "SWAYAM, NPTEL, Google — ₹2 Lakh ki value ke courses bilkul free!",
    color: "from-accent/80 to-accent",
  },
  {
    icon: Smartphone,
    title: "WhatsApp Share 📱",
    desc: "Ek click mein friends ko share karein — sabko test karwayein!",
    color: "from-primary to-primary-glow",
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
    {/* Background accent */}
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
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all border border-border/50 hover:border-primary/25 relative overflow-hidden"
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 gradient-hero-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-5 h-5 text-primary-foreground" />
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