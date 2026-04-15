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
    { name: "Physics (Class 11-12)", platform: "<span aria-hidden='true'>🎓</span> SWAYAM / NPTEL", link: "https://swayam.gov.in", description: "IIT professors se free mein Physics padhein — JEE level content!" },
    { name: "Mathematics for Engineers", platform: "<span aria-hidden='true'>🎓</span> NPTEL", link: "https://nptel.ac.in", description: "Advanced maths — calculus, algebra sab covered hai" },
    { name: "Biology Complete Course", platform: "<span aria-hidden='true'>🎓</span> SWAYAM", link: "https://swayam.gov.in", description: "NEET prep ke liye biology ka full course — free!" },
    { name: "Introduction to Programming (Python)", platform: "<span aria-hidden='true'>🎓</span> NPTEL", link: "https://nptel.ac.in", description: "Coding seekhna hai toh ye best hai — IIT Madras ka course" },
    { name: "Chemistry (CBSE/JEE)", platform: "<span aria-hidden='true'>📺</span> Khan Academy India", link: "https://www.khanacademy.org/science/chemistry", description: "Chemistry basics se advanced tak — Hindi mein bhi available hai" },
    { name: "CS50 (Harvard)", platform: "<span aria-hidden='true'>🌐</span> edX", link: "https://www.edx.org/course/cs50s-introduction-to-computer-science", description: "World famous free CS course — coding career shuru karna hai toh zaroor karein" },
    { name: "Science & Technology (UPSC)", platform: "<span aria-hidden='true'>🎓</span> SWAYAM", link: "https://swayam.gov.in", description: "Science ka general knowledge — competitive exams ke liye" },
    { name: "Digital India (Free Certifications)", platform: "<span aria-hidden='true'>🏛️</span> DigiLocker + NASSCOM", link: "https://www.futureskillsprime.in", description: "Free IT certifications — resume mein add karein!" },
  ],
  Commerce: [
    { name: "Accounting & Finance Basics", platform: "<span aria-hidden='true'>🎓</span> SWAYAM", link: "https://swayam.gov.in", description: "Accounts ki basics — Tally, Journal Entry, Ledger sab seekhein free mein" },
    { name: "Financial Markets (IIMB)", platform: "<span aria-hidden='true'>🎓</span> NPTEL", link: "https://nptel.ac.in", description: "IIM Bangalore ke professor se stock market samjhein" },
    { name: "GST & Taxation", platform: "<span aria-hidden='true'>🎓</span> SWAYAM", link: "https://swayam.gov.in", description: "Tax system samajhna hai toh ye course best hai — CA prep ke liye helpful" },
    { name: "Business Communication", platform: "<span aria-hidden='true'>🎓</span> NPTEL", link: "https://nptel.ac.in", description: "Professional communication skills — interview aur job ke liye zaroori hai" },
    { name: "Digital Marketing", platform: "<span aria-hidden='true'>🌐</span> Google Digital Garage", link: "https://learndigital.withgoogle.com/digitalgarage", description: "Google ka FREE digital marketing course with certificate! Zaroor karein <span aria-hidden='true'>🔥</span>" },
    { name: "Entrepreneurship (EDX)", platform: "<span aria-hidden='true'>🌐</span> edX", link: "https://www.edx.org", description: "Business start karna hai? Is course se basics seekhein" },
    { name: "Zerodha Varsity", platform: "<span aria-hidden='true'>📈</span> Zerodha", link: "https://zerodha.com/varsity/", description: "Stock market, mutual funds, trading — sab free mein seekhein" },
    { name: "Tally Prime Course", platform: "<span aria-hidden='true'>🏛️</span> Tally Education", link: "https://tallysolutions.com/learning-hub/", description: "Tally software seekhein — har accountant ke liye zaroori hai" },
  ],
  Arts: [
    { name: "Indian History (Complete)", platform: "<span aria-hidden='true'>🎓</span> SWAYAM", link: "https://swayam.gov.in", description: "Ancient to Modern India — UPSC/BPSC ke liye perfect hai" },
    { name: "Political Science Basics", platform: "<span aria-hidden='true'>🎓</span> SWAYAM", link: "https://swayam.gov.in", description: "Indian polity samajhna hai toh ye course best hai" },
    { name: "Creative Writing", platform: "<span aria-hidden='true'>🌐</span> Coursera", link: "https://www.coursera.org", description: "Writing skills improve karein — journalism ya content creation ke liye" },
    { name: "Introduction to Psychology", platform: "<span aria-hidden='true'>🎓</span> NPTEL", link: "https://nptel.ac.in", description: "Psychology seekhna hai? IIT professors se free mein padhein" },
    { name: "Graphic Design (Canva)", platform: "<span aria-hidden='true'>🌐</span> Canva Design School", link: "https://www.canva.com/designschool/", description: "Design seekhna hai toh Canva se shuru karein — free tools + courses" },
    { name: "Photography Basics", platform: "<span aria-hidden='true'>🌐</span> Coursera", link: "https://www.coursera.org", description: "Photography ka professional course — free mein audit kar sakte hain" },
    { name: "Indian Culture & Heritage", platform: "<span aria-hidden='true'>🎓</span> SWAYAM", link: "https://swayam.gov.in", description: "Art, culture, heritage — GK ke liye bhi helpful hai" },
    { name: "UPSC/BPSC Complete Prep", platform: "<span aria-hidden='true'>🎓</span> iGOT Karmayogi", link: "https://igot.gov.in", description: "Government ki official learning platform — civil services prep ke liye" },
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
        <BookOpen className="w-5 h-5 text-primary" /> Free Government Courses <span aria-hidden='true'>🆓</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        SWAYAM, NPTEL, Google — sab free hai! Certificate bhi milega <span aria-hidden='true'>📜</span>
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
  aria-label={`Open ${course.name} course`}
  className="flex-shrink-0 w-9 h-9 rounded-lg gradient-hero flex items-center justify-center hover:opacity-90 transition-opacity"
>
  <ExternalLink className="w-4 h-4 text-primary-foreground" />
  <span className="sr-only">Open course</span>
</a>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultFreeCourses;
