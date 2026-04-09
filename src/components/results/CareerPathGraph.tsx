import { useState } from "react";
import { motion } from "framer-motion";
import type { StreamResult } from "@/data/quizData";

type Stream = "Science" | "Commerce" | "Arts";

const GRAPH_DATA: Record<Stream, { paths: { label: string; careers: string[] }[] }> = {
  Science: {
    paths: [
      { label: "JEE / Engineering", careers: ["Software Engineer", "AI/ML Engineer"] },
      { label: "NEET / Medical", careers: ["Doctor", "Surgeon"] },
      { label: "Pure Science", careers: ["Researcher", "Professor"] },
      { label: "Tech / CS", careers: ["Data Scientist", "Cybersecurity"] },
    ],
  },
  Commerce: {
    paths: [
      { label: "CA / Finance", careers: ["Chartered Accountant", "CFO"] },
      { label: "MBA / Business", careers: ["CEO", "Startup Founder"] },
      { label: "Economics", careers: ["Economist", "Analyst"] },
      { label: "Banking", careers: ["Bank PO", "RBI Officer"] },
    ],
  },
  Arts: {
    paths: [
      { label: "UPSC / Civil", careers: ["IAS / IPS", "Diplomat"] },
      { label: "Law / CLAT", careers: ["Lawyer", "Judge"] },
      { label: "Media / Design", careers: ["Journalist", "Director"] },
      { label: "Teaching", careers: ["Professor", "Counselor"] },
    ],
  },
};

const streamStyles: Record<
  Stream,
  {
    root: string;
    borderLine: string;
    pathBox: string;
    activeBtn: string;
  }
> = {
  Science: {
    root: "bg-green-100 border-green-600 text-green-900",
    borderLine: "bg-green-600/30",
    pathBox: "bg-gray-100 border-gray-400 text-gray-700",
    activeBtn: "bg-green-100 border-green-600 text-green-900",
  },
  Commerce: {
    root: "bg-blue-100 border-blue-600 text-blue-900",
    borderLine: "bg-blue-600/30",
    pathBox: "bg-gray-100 border-gray-400 text-gray-700",
    activeBtn: "bg-blue-100 border-blue-600 text-blue-900",
  },
  Arts: {
    root: "bg-purple-100 border-purple-600 text-purple-900",
    borderLine: "bg-purple-600/30",
    pathBox: "bg-gray-100 border-gray-400 text-gray-700",
    activeBtn: "bg-purple-100 border-purple-600 text-purple-900",
  },
};

const CareerPathGraph = ({ result }: { result: StreamResult }) => {
  const [activeCareer, setActiveCareer] = useState<string | null>(null);
  const stream = result.stream as Stream;
  const data = GRAPH_DATA[stream] ?? GRAPH_DATA["Science"];
  const styles = streamStyles[stream];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-bold text-xl text-foreground mb-1">
        Career Path Explorer
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Apne stream se career tak ka raasta dekho
      </p>

      <div className="flex flex-col items-center">
        {/* Root */}
        <div className={`px-6 py-3 rounded-xl border-2 font-bold text-sm ${styles.root}`}>
          {stream} Stream
        </div>

        {/* Line */}
        <div className={`w-0.5 h-6 ${styles.borderLine}`} />

        {/* Horizontal line */}
        <div className="relative w-full flex justify-center">
          <div className={`absolute top-0 left-[12%] right-[12%] h-0.5 ${styles.borderLine}`} />
        </div>

        {/* Paths */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          {data.paths.map((path, i) => (
            <div key={i} className="flex flex-col items-center">
              
              <div className={`w-0.5 h-5 ${styles.borderLine}`} />

              <div className={`w-full px-3 py-2.5 rounded-lg border text-xs text-center font-semibold ${styles.pathBox}`}>
                {path.label}
              </div>

              <div className="w-0.5 h-4 bg-gray-300" />

              <div className="flex flex-col gap-1.5 w-full">
                {path.careers.map((career) => (
                  <button
                    key={career}
                    onClick={() =>
                      setActiveCareer(activeCareer === career ? null : career)
                    }
                    className={`w-full px-2 py-2 rounded-lg border text-xs text-left transition-all ${
                      activeCareer === career
                        ? styles.activeBtn
                        : "bg-gray-50 border-gray-300 text-gray-600"
                    }`}
                  >
                    {career}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active */}
      {activeCareer && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 p-4 rounded-xl border ${styles.root}`}
        >
          <p className="text-sm font-bold">{activeCareer}</p>
          <p className="text-xs mt-1 text-gray-600">
            Yeh career {stream} stream ke students ke liye ek promising path hai.
            Roadmap aur top colleges neeche dekho!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CareerPathGraph;