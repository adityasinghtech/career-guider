import { motion } from "framer-motion";
import { Compass, Target, Users, Heart, BookOpen, Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const values = [
  { icon: Target, title: "Mission 🎯", desc: "Har Indian student ko sahi career guidance milni chahiye — chahe woh village se hon ya city se. Humara goal hai ki koi bhi student confusion mein na rahe." },
  { icon: Users, title: "For Students 👨‍🎓", desc: "Class 9-12 ke students jo stream selection mein confused hain — unke liye humne ye platform banaya hai. Simple, free, aur effective." },
  { icon: Heart, title: "Free Forever 💚", desc: "PathFinder hamesha free rahega students ke liye. Koi hidden charges nahi, koi premium wall nahi. Education guidance sabka adhikaar hai." },
  { icon: BookOpen, title: "Data-Driven 📊", desc: "Humara quiz research-based hai — psychology aur career counseling ke principles pe based. Generic nahi, personalized results milte hain." },
  { icon: Lightbulb, title: "Bihar & UP Focus 🏛️", desc: "Specifically Bihar aur UP ke students ke liye — local colleges, state scholarships, aur region-specific guidance sab included hai." },
];

const team = [
  { name: "PathFinder Team", role: "Founders & Developers", desc: "Ek passionate team jo believe karti hai ki har student ka future bright ho sakta hai — bas sahi direction chahiye!" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
            <Compass className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-display font-900 text-4xl md:text-5xl text-foreground mb-4">
            PathFinder ke baare mein 🧭
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hum ek student-first career guidance platform hain jo Bihar aur UP ke Class 9-12 students ko sahi stream choose karne mein madad karta hai — bilkul free!
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-card mb-8"
        >
          <h2 className="font-display font-bold text-2xl text-foreground mb-4">Humari Kahani 📖</h2>
          <div className="space-y-4 text-muted-foreground font-body">
            <p>
              Bahut saare students Class 10 ke baad confuse ho jaate hain — Science lein ya Commerce? Arts mein scope hai ya nahi? Parents kehte hain kuch aur, dost kehte hain kuch aur. Aur sahi guidance milti hi nahi.
            </p>
            <p>
              <strong className="text-foreground">PathFinder isliye banaya gaya</strong> — taaki har student apne interests, strengths, aur goals ke basis pe informed decision le sake. Koi biased advice nahi, koi forced stream nahi — sirf aapka data, aapki choice.
            </p>
            <p>
              Humne research kiya, career counselors se baat ki, aur ek smart quiz banaya jo 3 minute mein aapko batata hai ki aapke liye kaunsa path best hai. Saath mein milta hai roadmap, colleges, scholarships, aur free courses ki list!
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">Hum Kya Believe Karte Hain 💪</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-card rounded-2xl p-5 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                    <v.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-card mb-8"
        >
          <h2 className="font-display font-bold text-2xl text-foreground mb-4 text-center">Humari Team 👥</h2>
          {team.map((t) => (
            <div key={t.name} className="text-center">
              <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">{t.name}</h3>
              <p className="text-primary font-semibold text-sm">{t.role}</p>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">{t.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="font-display font-bold text-2xl text-foreground mb-3">Kya aap taiyar hain apna future discover karne ke liye? 🚀</h2>
          <p className="text-muted-foreground mb-6">Sirf 3 minute mein pata chal jaayega!</p>
          <Link
            to="/quiz"
            className="inline-block gradient-hero text-primary-foreground font-display font-bold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
          >
            Abhi Quiz Shuru Karein 🚀
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
