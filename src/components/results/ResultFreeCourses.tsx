import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import type { StreamResult } from "@/data/quizData";

export interface FreeCourse {
  name: string;
  platform: string;
  link: string;
  description: string;
}

const coursesByStream: Record<string, FreeCourse[]> = {
  Science: [
    { name: "Physics (Class 11-12)", platform: "🎓 SWAYAM / NPTEL", link: "https://swayam.gov.in", description: "IIT professors se free mein Physics padhein — JEE level content!" },
    { name: "Mathematics for Engineers", platform: "🎓 NPTEL", link: "https://nptel.ac.in", description: "Advanced maths — calculus, algebra sab covered hai" },
    { name: "Biology Complete Course", platform: "🎓 SWAYAM", link: "https://swayam.gov.in", description: "NEET prep ke liye biology ka full course — free!" },
    { name: "Introduction to Programming (Python)", platform: "🎓 NPTEL", link: "https://nptel.ac.in", description: "Coding seekhna hai toh ye best hai — IIT Madras ka course" },
    { name: "Chemistry (CBSE/JEE)", platform: "📺 Khan Academy India", link: "https://www.khanacademy.org/science/chemistry", description: "Chemistry basics se advanced tak — Hindi mein bhi available hai" },
    { name: "CS50 (Harvard)", platform: "🌐 edX", link: "https://www.edx.org/course/cs50s-introduction-to-computer-science", description: "World famous free CS course — coding career shuru karna hai toh zaroor karein" },
    { name: "Science & Technology (UPSC)", platform: "🎓 SWAYAM", link: "https://swayam.gov.in", description: "Science ka general knowledge — competitive exams ke liye" },
    { name: "Digital India (Free Certifications)", platform: "🏛️ DigiLocker + NASSCOM", link: "https://www.futureskillsprime.in", description: "Free IT certifications — resume mein add karein!" },
  ],
  Commerce: [
    { name: "Accounting & Finance Basics", platform: "🎓 SWAYAM", link: "https://swayam.gov.in", description: "Accounts ki basics — Tally, Journal Entry, Ledger sab seekhein free mein" },
    { name: "Financial Markets (IIMB)", platform: "🎓 NPTEL", link: "https://nptel.ac.in", description: "IIM Bangalore ke professor se stock market samjhein" },
    { name: "GST & Taxation", platform: "🎓 SWAYAM", link: "https://swayam.gov.in", description: "Tax system samajhna hai toh ye course best hai — CA prep ke liye helpful" },
    { name: "Business Communication", platform: "🎓 NPTEL", link: "https://nptel.ac.in", description: "Professional communication skills — interview aur job ke liye zaroori hai" },
    { name: "Digital Marketing", platform: "🌐 Google Digital Garage", link: "https://learndigital.withgoogle.com/digitalgarage", description: "Google ka FREE digital marketing course with certificate! Zaroor karein 🔥" },
    { name: "Entrepreneurship (EDX)", platform: "🌐 edX", link: "https://www.edx.org", description: "Business start karna hai? Is course se basics seekhein" },
    { name: "Zerodha Varsity", platform: "📈 Zerodha", link: "https://zerodha.com/varsity/", description: "Stock market, mutual funds, trading — sab free mein seekhein" },
    { name: "Tally Prime Course", platform: "🏛️ Tally Education", link: "https://tallysolutions.com/learning-hub/", description: "Tally software seekhein — har accountant ke liye zaroori hai" },
  ],
  Arts: [
    { name: "Indian History (Complete)", platform: "🎓 SWAYAM", link: "https://swayam.gov.in", description: "Ancient to Modern India — UPSC/BPSC ke liye perfect hai" },
    { name: "Political Science Basics", platform: "🎓 SWAYAM", link: "https://swayam.gov.in", description: "Indian polity samajhna hai toh ye course best hai" },
    { name: "Creative Writing", platform: "🌐 Coursera", link: "https://www.coursera.org", description: "Writing skills improve karein — journalism ya content creation ke liye" },
    { name: "Introduction to Psychology", platform: "🎓 NPTEL", link: "https://nptel.ac.in", description: "Psychology seekhna hai? IIT professors se free mein padhein" },
    { name: "Graphic Design (Canva)", platform: "🌐 Canva Design School", link: "https://www.canva.com/designschool/", description: "Design seekhna hai toh Canva se shuru karein — free tools + courses" },
    { name: "Photography Basics", platform: "🌐 Coursera", link: "https://www.coursera.org", description: "Photography ka professional course — free mein audit kar sakte hain" },
    { name: "Indian Culture & Heritage", platform: "🎓 SWAYAM", link: "https://swayam.gov.in", description: "Art, culture, heritage — GK ke liye bhi helpful hai" },
    { name: "UPSC/BPSC Complete Prep", platform: "🎓 iGOT Karmayogi", link: "https://igot.gov.in", description: "Government ki official learning platform — civil services prep ke liye" },
  ],
};

const ResultFreeCourses = ({ result }: { result: StreamResult }) => {
  const courses = coursesByStream[result.stream] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-bold text-xl text-foreground mb-2 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" /> Free Government Courses 🆓
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        SWAYAM, NPTEL, Google — sab free hai! Certificate bhi milega 📜
      </p>
      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course.name} className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-display font-bold text-foreground text-sm">{course.name}</h3>
                <p className="text-xs text-primary font-semibold mt-0.5">{course.platform}</p>
                <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
              </div>
              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-9 h-9 rounded-lg gradient-hero flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4 text-primary-foreground" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultFreeCourses;
