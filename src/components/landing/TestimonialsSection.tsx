import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Kumari",
    location: "Patna, Bihar",
    class: "Class 11 — Science",
    text: "Mujhe pata hi nahi tha ki mera interest Science mein hai! PathFinder ne 3 minute mein clear kar diya. Ab IIT ki taiyari kar rahi hoon 💪",
    rating: 5,
    emoji: "👩‍🔬",
  },
  {
    name: "Rohit Sharma",
    location: "Lucknow, UP",
    class: "Class 10 — Confused tha!",
    text: "Papa bolte the Science lo, dost bolte the Commerce. PathFinder ne meri strength dekhi aur Commerce suggest kiya. Ab CA ki taiyari kar raha hoon! 📊",
    rating: 5,
    emoji: "👨‍💼",
  },
  {
    name: "Sneha Gupta",
    location: "Varanasi, UP",
    class: "Class 12 — Arts",
    text: "Sabne bola Arts mein kya scope hai. PathFinder ne dikhaya ki Law mein kitna scope hai — CLAT crack karke NLU mein admission mil gaya! ⚖️",
    rating: 5,
    emoji: "👩‍⚖️",
  },
  {
    name: "Aman Kumar",
    location: "Muzaffarpur, Bihar",
    class: "Class 9 — Early Explorer",
    text: "9th mein hi pata chal gaya ki mujhe Data Science mein jaana hai. Roadmap follow kar raha hoon — Python bhi seekh liya! 🤖",
    rating: 5,
    emoji: "👨‍💻",
  },
  {
    name: "Anjali Devi",
    location: "Jaunpur, UP",
    class: "Class 10 — Village se",
    text: "Hamare village mein koi career counselor nahi hai. PathFinder ne free mein itna accha guidance diya — PDF parents ko dikhayi toh bohot khush hue! 🎉",
    rating: 5,
    emoji: "👩‍🎓",
  },
  {
    name: "Ravi Ranjan",
    location: "Gaya, Bihar",
    class: "Class 11 — Commerce",
    text: "Free courses ki list mili — Zerodha Varsity se stock market seekh raha hoon. Sab kuch free mein! PathFinder is a game changer 🔥",
    rating: 5,
    emoji: "📈",
  },
];

const TestimonialsSection = () => (
  <section className="py-20 px-4 relative overflow-hidden">
    {/* Decorative bg */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="inline-block text-sm font-display font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4 border border-primary/15">
          ❤️ Real Stories
        </span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4">
          Students Kya Keh Rahe Hain? 💬
        </h2>
        <p className="text-muted-foreground text-lg">Real students, real results — koi actor nahi! 😄</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:border-primary/25 hover:shadow-elevated transition-all relative overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/3 rounded-full blur-3xl group-hover:bg-primary/8 transition-colors duration-500" />

            <Quote className="w-10 h-10 text-primary/10 absolute top-5 right-5" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center text-2xl shadow-lg">
                  {t.emoji}
                </div>
                <div>
                  <h4 className="font-display font-bold text-foreground">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                  <p className="text-xs text-primary font-display font-semibold">{t.class}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-body mb-4 leading-relaxed italic">"{t.text}"</p>
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
