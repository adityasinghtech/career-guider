import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Play, Clock, Users, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { streamResults } from "@/data/quizData";

type StreamTab = "all" | "science" | "commerce" | "arts" | "sports" | "skills" | "creative";

// ─── SWAYAM Academic Courses ───────────────────────────────────────────────
const swayamCourses = [
  { title: "Physics Fundamentals (Class 11 & 12)", provider: "SWAYAM", stream: "science", duration: "12 weeks", students: "50,000+", highlights: ["JEE Preparation", "Core Physics Concepts", "Interactive Videos"], link: "https://swayam.gov.in", cert: true, emoji: "⚛️" },
  { title: "Mathematics for Engineering Entrance", provider: "SWAYAM", stream: "science", duration: "14 weeks", students: "75,000+", highlights: ["JEE Main Coverage", "Problem Solving", "Mock Tests"], link: "https://swayam.gov.in", cert: true, emoji: "📐" },
  { title: "Chemistry Essentials", provider: "IIT Bombay via SWAYAM", stream: "science", duration: "10 weeks", students: "40,000+", highlights: ["Organic & Inorganic", "Lab Simulations", "NEET Prep"], link: "https://swayam.gov.in", cert: true, emoji: "🧪" },
  { title: "Biology for NEET", provider: "SWAYAM", stream: "science", duration: "16 weeks", students: "80,000+", highlights: ["NEET Syllabus", "Concept Clarity", "Previous Year Qs"], link: "https://swayam.gov.in", cert: true, emoji: "🧬" },
  { title: "Accounting Basics (Class 11 & 12)", provider: "IIT BHU via SWAYAM", stream: "commerce", duration: "12 weeks", students: "30,000+", highlights: ["Journal & Ledger", "CA Foundation Ready", "Trial Balance"], link: "https://swayam.gov.in", cert: true, emoji: "📊" },
  { title: "Business Studies Essentials", provider: "SWAYAM", stream: "commerce", duration: "10 weeks", students: "25,000+", highlights: ["Entrepreneurship", "Business Environment", "Ethics"], link: "https://swayam.gov.in", cert: true, emoji: "🏢" },
  { title: "Economics for Commerce Students", provider: "Delhi University via SWAYAM", stream: "commerce", duration: "14 weeks", students: "45,000+", highlights: ["Microeconomics", "Macroeconomics", "Real Applications"], link: "https://swayam.gov.in", cert: true, emoji: "📈" },
  { title: "Indian History: Ancient to Modern", provider: "SWAYAM", stream: "arts", duration: "15 weeks", students: "35,000+", highlights: ["Complete Timeline", "UPSC Preparation", "Interactive Maps"], link: "https://swayam.gov.in", cert: true, emoji: "🏛️" },
  { title: "Political Science Fundamentals", provider: "JNU via SWAYAM", stream: "arts", duration: "12 weeks", students: "28,000+", highlights: ["Indian Constitution", "Political Systems", "Civic Concepts"], link: "https://swayam.gov.in", cert: true, emoji: "⚖️" },
  { title: "English Literature (Class 11 & 12)", provider: "SWAYAM", stream: "arts", duration: "13 weeks", students: "32,000+", highlights: ["Poetry Analysis", "Grammar", "Composition"], link: "https://swayam.gov.in", cert: true, emoji: "📖" },
  { title: "Geography: Physical & Human", provider: "SWAYAM", stream: "arts", duration: "12 weeks", students: "26,000+", highlights: ["Map Reading", "Climate Studies", "Population"], link: "https://swayam.gov.in", cert: true, emoji: "🌍" },
  { title: "Effective Communication Skills", provider: "IIT Madras via SWAYAM", stream: "all", duration: "8 weeks", students: "1,00,000+", highlights: ["Speaking Skills", "Writing Practice", "Presentations"], link: "https://swayam.gov.in", cert: true, emoji: "🗣️" },
  { title: "Critical Thinking & Problem Solving", provider: "SWAYAM", stream: "all", duration: "6 weeks", students: "55,000+", highlights: ["Logic Building", "Analytical Skills", "Real Applications"], link: "https://swayam.gov.in", cert: true, emoji: "🧠" },
];

// ─── Skill / Sports / Creative Courses ────────────────────────────────────
const skillCourses = [
  // Coding / Tech
  { title: "Python Programming (Zero to Hero)", provider: "FreeCodeCamp (YouTube)", stream: "skills", duration: "8 weeks", students: "5M+", highlights: ["Free, no signup", "Hindi + English both available", "Project-based learning"], link: "https://www.youtube.com/c/freecodecamp", cert: false, emoji: "🐍" },
  { title: "Web Development Bootcamp", provider: "Apna College (YouTube)", stream: "skills", duration: "10 weeks", students: "3M+", highlights: ["HTML, CSS, JavaScript, React", "Hindi mein", "Industry projects"], link: "https://youtube.com/@ApnaCollegeOfficial", cert: false, emoji: "🌐" },
  { title: "Google Digital Marketing Certificate", provider: "Google (Coursera)", stream: "skills", duration: "6 months", students: "1M+", highlights: ["Google certified", "Free financial aid available", "Job ready"], link: "https://coursera.org/google-certificates", cert: true, emoji: "📢" },
  { title: "Data Analytics with Excel & Python", provider: "Google (Coursera)", stream: "skills", duration: "5 months", students: "800K+", highlights: ["Google certified", "Hands-on projects", "₹5-15 LPA jobs"], link: "https://coursera.org/google-data-analytics", cert: true, emoji: "📊" },
  { title: "AWS Cloud Practitioner (Free)", provider: "AWS Training (Official)", stream: "skills", duration: "6 hours", students: "2M+", highlights: ["Free official AWS course", "Globally recognized cert", "Cloud jobs ₹8-30 LPA"], link: "https://aws.training", cert: true, emoji: "☁️" },
  { title: "Freelancing: Start Earning from Day 1", provider: "Ishan Sharma (YouTube)", stream: "skills", duration: "3 weeks", students: "800K+", highlights: ["Hinglish", "Fiverr/Upwork complete guide", "Real earnings proof"], link: "https://youtube.com/@IshanSharma7390", cert: false, emoji: "💰" },
  // Creative
  { title: "Graphic Design Fundamentals", provider: "Canva Design School (Free)", stream: "creative", duration: "4 weeks", students: "500K+", highlights: ["Completely free", "Certificate included", "Canva tools mastery"], link: "https://www.canva.com/designschool/", cert: true, emoji: "🎨" },
  { title: "Video Editing with DaVinci Resolve", provider: "YouTube (Blackmagic)", stream: "creative", duration: "6 weeks", students: "2M+", highlights: ["Professional software free", "Hollywood level editing", "Job-ready skills"], link: "https://youtube.com/DaVinciResolve", cert: false, emoji: "🎬" },
  { title: "UI/UX Design Basics", provider: "Google (Coursera)", stream: "creative", duration: "6 months", students: "600K+", highlights: ["Google UX Certificate", "Figma tools", "₹8-25 LPA scope"], link: "https://coursera.org/google-ux-design", cert: true, emoji: "🖌️" },
  // Sports
  { title: "Sports Coaching Fundamentals", provider: "SAI NCOE (SWAYAM)", stream: "sports", duration: "8 weeks", students: "50K+", highlights: ["Official SAI material", "Coaching certificate", "All sports covered"], link: "https://swayam.gov.in", cert: true, emoji: "🏆" },
  { title: "Sports Nutrition & Fitness", provider: "IGNOU via SWAYAM", stream: "sports", duration: "10 weeks", students: "30K+", highlights: ["Science-based", "Diet planning", "Injury prevention"], link: "https://swayam.gov.in", cert: true, emoji: "🥗" },
  { title: "Physical Education & Sports Science", provider: "LNIPE via YouTube", stream: "sports", duration: "8 weeks", students: "100K+", highlights: ["BPEd syllabus", "Exercise physiology", "Kinesiology basics"], link: "https://youtube.com", cert: false, emoji: "🏋️" },
];

const allCourses = [...swayamCourses, ...skillCourses];

const tabs: { key: StreamTab; label: string }[] = [
  { key: "all", label: "All 📚" },
  { key: "science", label: "Science 🔬" },
  { key: "commerce", label: "Commerce 📈" },
  { key: "arts", label: "Arts 🎨" },
  { key: "sports", label: "Sports 🏆" },
  { key: "skills", label: "Skills 💻" },
  { key: "creative", label: "Creative 🎭" },
];

const ALL_STREAMS = ["science", "commerce", "arts", "sports", "skills", "creative"];

export default function LearningResources() {
  const [activeStream, setActiveStream] = useState<StreamTab>("all");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("pathfinder_quiz_profile") || "{}");
      if (p.stream && ALL_STREAMS.includes(p.stream)) {
        setActiveStream(p.stream as StreamTab);
      }
    } catch {/* ignore */ }
  }, []);

  const filteredCourses = activeStream === "all"
    ? allCourses
    : allCourses.filter((c) => c.stream === activeStream || c.stream === "all");

  const youtubeChannels = activeStream !== "all"
    ? (streamResults[activeStream]?.youtubeChannels ?? [])
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">Free Learning Resources</h1>
          <p className="text-muted-foreground font-body text-lg">SWAYAM + YouTube + Google — sabhi FREE! Sirf seekho aur grow karo 🚀</p>
        </motion.div>

        {/* Quick Start Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <a
            href="https://youtube.com/@ApnaCollegeOfficial"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-colors group"
          >
            <div className="text-2xl mb-2">▶️</div>
            <p className="font-display font-bold text-foreground group-hover:text-red-600 transition-colors">Coding Seekho (Free)</p>
            <p className="text-xs text-muted-foreground">Apna College — 3M+ students</p>
          </a>
          <a
            href="https://coursera.org/google-certificates"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl hover:bg-blue-500/20 transition-colors group"
          >
            <div className="text-2xl mb-2">🎓</div>
            <p className="font-display font-bold text-foreground group-hover:text-blue-600 transition-colors">Google Certifications</p>
            <p className="text-xs text-muted-foreground">Free financial aid available</p>
          </a>
          <a
            href="https://swayam.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl hover:bg-green-500/20 transition-colors group"
          >
            <div className="text-2xl mb-2">🏛️</div>
            <p className="font-display font-bold text-foreground group-hover:text-green-600 transition-colors">SWAYAM (Govt Free)</p>
            <p className="text-xs text-muted-foreground">IIT/IIM professors ke lectures</p>
          </a>
        </motion.div>

        {/* Stream Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveStream(tab.key)}
              className={`px-4 py-2 rounded-xl font-display font-semibold text-sm transition-all ${activeStream === tab.key
                  ? "gradient-hero text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Free Courses
            <Badge variant="secondary" className="ml-2">{filteredCourses.length} courses</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        {(course as { emoji?: string }).emoji && (
                          <span className="text-xl shrink-0 mt-0.5">{(course as { emoji?: string }).emoji}</span>
                        )}
                        <CardTitle className="font-display text-base leading-snug">{course.title}</CardTitle>
                      </div>
                      {course.cert && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-xs shrink-0">Free Cert ✓</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-body">{course.provider}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students}</span>
                    </div>
                    <ul className="space-y-1">
                      {course.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-foreground font-body flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{h}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => window.open(course.link, "_blank")}
                      className="w-full gradient-hero text-primary-foreground font-display font-semibold text-sm py-2"
                    >
                      Enroll Free <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* YouTube Channels for active stream */}
        {activeStream !== "all" && youtubeChannels.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
              <Play className="w-6 h-6 text-red-500" /> Best YouTube Channels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {youtubeChannels.map((ch, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-muted/60 rounded-xl px-4 py-3 font-body text-sm text-foreground border border-border hover:border-primary/40 transition-colors"
                >
                  {ch}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6"
        >
          <h3 className="font-display font-bold text-lg text-blue-900 dark:text-blue-200 mb-2">🏛️ SWAYAM kya hai?</h3>
          <p className="font-body text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
            <strong>SWAYAM</strong> (Study Webs of Active–Learning for Young Aspiring Minds) India Government ki free online education platform hai.
            Isme IITs, IIMs, aur top universities ke professors top-quality courses dete hain — bilkul free mein!
            Course complete karne pe <strong>verified certificate</strong> bhi milta hai jo resume mein add kar sakte ho.
            swayam.gov.in pe jaake register karo — no fees, no catch! 🎓
          </p>
          <Button
            onClick={() => window.open("https://swayam.gov.in", "_blank")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-display font-semibold"
          >
            SWAYAM pe jaao <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>

      </div>
    </div>
  );
}

