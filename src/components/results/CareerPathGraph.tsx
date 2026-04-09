import { useState } from "react";
import { motion } from "framer-motion";
import type { StreamResult } from "@/data/quizData";

interface PathNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "start" | "mid" | "end";
}

interface PathEdge {
  from: string;
  to: string;
}

function buildCareerGraph(result: StreamResult): { nodes: PathNode[]; edges: PathEdge[] } {
  const stream = result.stream;
  const nodes: PathNode[] = [];
  const edges: PathEdge[] = [];

  // Start node
  nodes.push({ id: "start", label: `${stream} Stream`, x: 50, y: 50, type: "start" });

  // Mid-tier nodes (exams/paths)
  const midLabels = stream === "Science"
    ? ["JEE/Engineering", "NEET/Medical", "Pure Science", "Tech/CS"]
    : stream === "Commerce"
    ? ["CA/Finance", "MBA/Business", "Economics", "Banking"]
    : ["UPSC/Civil", "Law/CLAT", "Media/Design", "Teaching"];

  midLabels.forEach((label, i) => {
    const id = `mid-${i}`;
    nodes.push({ id, label, x: 25 + i * 25, y: 45, type: "mid" });
    edges.push({ from: "start", to: id });
  });

  // End nodes (careers) - 2 per mid
  const careerGroups = stream === "Science"
    ? [["Software Eng", "AI/ML Eng"], ["Doctor", "Surgeon"], ["Researcher", "Professor"], ["Data Scientist", "Cybersecurity"]]
    : stream === "Commerce"
    ? [["CA", "CFO"], ["CEO", "Startup"], ["Economist", "Analyst"], ["Bank PO", "RBI Officer"]]
    : [["IAS/IPS", "Diplomat"], ["Lawyer", "Judge"], ["Journalist", "Director"], ["Professor", "Counselor"]];

  careerGroups.forEach((group, gi) => {
    group.forEach((career, ci) => {
      const id = `end-${gi}-${ci}`;
      nodes.push({ id, label: career, x: 15 + gi * 25 + ci * 12, y: 20 + ci * 15, type: "end" });
      edges.push({ from: `mid-${gi}`, to: id });
    });
  });

  return { nodes, edges };
}

const CareerPathGraph = ({ result }: { result: StreamResult }) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const { nodes, edges } = buildCareerGraph(result);

  const svgWidth = 600;
  const svgHeight = 320;

  const getNodePos = (node: PathNode) => ({
    cx: (node.x / 100) * svgWidth,
    cy: svgHeight - (node.y / 100) * svgHeight,
  });

  const colorMap = { start: "hsl(var(--primary))", mid: "hsl(var(--accent))", end: "hsl(var(--secondary))" };
  const radiusMap = { start: 28, mid: 22, end: 16 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <h2 className="font-display font-bold text-xl text-foreground mb-4">
        Career Path Explorer 🗺️
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Tap karke explore karein — har raasta aapke liye open hai!
      </p>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[500px] h-auto"
        >
          {/* Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from)!;
            const toNode = nodes.find((n) => n.id === edge.to)!;
            const from = getNodePos(fromNode);
            const to = getNodePos(toNode);
            const isActive = activeNode === edge.from || activeNode === edge.to;
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.cx} y1={from.cy}
                x2={to.cx} y2={to.cy}
                stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.2)"}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={isActive ? "none" : "4 4"}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map((node) => {
            const pos = getNodePos(node);
            const isActive = activeNode === node.id;
            return (
              <g
                key={node.id}
                onClick={() => setActiveNode(isActive ? null : node.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={pos.cx} cy={pos.cy}
                  r={radiusMap[node.type]}
                  fill={isActive ? "hsl(var(--primary))" : colorMap[node.type]}
                  opacity={isActive ? 1 : 0.85}
                  stroke={isActive ? "hsl(var(--primary))" : "transparent"}
                  strokeWidth={2}
                />
                <text
                  x={pos.cx} y={pos.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={node.type === "start" || isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                  fontSize={node.type === "start" ? 11 : node.type === "mid" ? 9 : 7}
                  fontWeight={node.type === "start" ? "bold" : "600"}
                  className="pointer-events-none select-none"
                >
                  {node.label.length > 12 ? node.label.slice(0, 11) + "…" : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {activeNode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 p-3 bg-muted rounded-xl text-sm text-foreground"
        >
          <strong>{nodes.find((n) => n.id === activeNode)?.label}</strong>
          {" — "}
          {nodes.find((n) => n.id === activeNode)?.type === "end"
            ? "Yeh career aapke liye possible hai! Roadmap follow karein. 🚀"
            : "Is path pe aage badhne ke liye neeche ke nodes explore karein."}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CareerPathGraph;
