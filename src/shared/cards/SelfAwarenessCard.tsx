import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
} from "lucide-react";

type SelfAwarenessCardProps = {
  visualType?:
    | "patternDiscovery"
    | "innerMirror"
    | "layersOfSelf"
    | "insightFragments"
    | "lighthouse";

  patternsIdentified?: number;
  newInsights?: number;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function SelfAwarenessCard({
  visualType = "patternDiscovery",
  patternsIdentified = 12,
  newInsights = 3,
  insight = "Seus registros e experiências recentes indicam maior clareza sobre situações que afetam seu bem-estar, energia e motivação.",
  badgeLabel = "novos padrões percebidos",
  onClick,
}: SelfAwarenessCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="
        w-full
        rounded-[32px]
        border
        border-[#D8E4E7]
        bg-[#F8FBFB]
        p-5
        text-left
        shadow-[0_2px_20px_rgba(80,120,120,0.04)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF4F4]">
            <Search size={18} className="text-[#5E7D81]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#233437]">
              Autoconhecimento
            </h3>
            <ChevronRight size={16} className="text-[#89A1A5]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#6B8085]">
            Padrões pessoais,
            aprendizados e compreensão
            sobre si mesmo.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#42575C]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#EAF4F4] px-3 py-1.5">
              <span className="text-caption font-medium text-[#58757A]">
                {badgeLabel}
              </span>
            </div>
            <div className="rounded-full bg-[#F1F7F7] px-3 py-1.5 text-caption text-[#667E82]">
              {patternsIdentified} padrões
            </div>
            <div className="rounded-full bg-[#F1F7F7] px-3 py-1.5 text-caption text-[#667E82]">
              {newInsights} insights
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <SelfAwarenessVisual type={visualType} />
        </div>
      </div>
    </motion.button>
  );
}

function SelfAwarenessVisual({ type }: { type: SelfAwarenessCardProps["visualType"] }) {
  switch (type) {
    case "innerMirror": return <InnerMirror />;
    case "layersOfSelf": return <LayersOfSelf />;
    case "insightFragments": return <InsightFragments />;
    case "lighthouse": return <Lighthouse />;
    default: return <PatternDiscovery />;
  }
}

function PatternDiscovery() {
  const nodes = [[25, 35], [95, 35], [60, 60], [25, 90], [95, 90]];
  const connections = [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 4]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {connections.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="#C8D9DB" strokeWidth="1.8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: i * 0.15 }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="6" fill="#5E7D81"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.3 }}
        />
      ))}
    </svg>
  );
}

function InnerMirror() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.circle cx="60" cy="35" r="14" fill="#6B8C91"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
      <line x1="60" y1="50" x2="60" y2="70" stroke="#C5D8DB" strokeWidth="2" />
      <motion.circle cx="60" cy="85" r="14" fill="#D7E8EA"
        animate={{ scale: [1.05, 1, 1.05] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
    </svg>
  );
}

function LayersOfSelf() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[40, 28, 16].map((radius, i) => (
        <motion.circle
          key={radius}
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={i === 0 ? "#D8E7E9" : i === 1 ? "#AFC8CB" : "#6C8D92"}
          strokeWidth="3"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 4, delay: i * 0.4 }}
        />
      ))}
    </svg>
  );
}

function InsightFragments() {
  const fragments = [{ x: 25, y: 25 }, { x: 55, y: 45 }, { x: 85, y: 65 }];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {fragments.map((f, i) => (
        <motion.rect
          key={i} x={f.x} y={f.y} width="14" height="14" rx="4" fill="#AFC8CB"
          animate={{ y: [f.y, f.y - 4, f.y] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.25 }}
        />
      ))}
      <motion.circle cx="95" cy="95" r="12" fill="#5E7D81"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
    </svg>
  );
}

function Lighthouse() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.circle cx="60" cy="65" r="12" fill="#5D7C81"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <motion.path d="M60 25 L48 50" stroke="#D4E3E5" strokeWidth="3" strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
      <motion.path d="M60 25 L72 50" stroke="#D4E3E5" strokeWidth="3" strokeLinecap="round"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
      <motion.path d="M60 25 L60 48" stroke="#BFD4D7" strokeWidth="3" strokeLinecap="round"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
    </svg>
  );
}
