import { motion } from "framer-motion";
import {
  Sprout,
  ChevronRight,
} from "lucide-react";

type LearningsCardProps = {
  visualType?:
    | "growingBranch"
    | "knowledgeConstellation"
    | "insightNodes"
    | "expansionRings"
    | "knowledgeBloom";

  learningMoments?: number;
  skillsImproved?: number;
  growthLevel?: number;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function LearningsCard({
  visualType = "growingBranch",
  learningMoments = 12,
  skillsImproved = 4,
  growthLevel = 82,
  insight = "Você parece estar acumulando aprendizados que fortalecem sua capacidade de compreender e agir em diferentes situações.",
  badgeLabel = "crescimento ativo",
  onClick,
}: LearningsCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="
        w-full
        text-left
        rounded-sheet
        border
        border-[#D8E4D4]
        bg-[#FCFDFB]
        shadow-[0_2px_20px_rgba(110,140,100,0.05)]
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#EDF4EA]">
            <Sprout size={18} className="text-[#65835D]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#33412F]">
              Aprendizados
            </h3>
            <ChevronRight size={16} className="text-[#97A28F]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#6C7768]">
            Conhecimentos adquiridos, habilidades desenvolvidas e novas perspectivas incorporadas.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#4A5645]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#EDF4EA] px-3 py-1.5">
              <span className="text-caption font-medium text-[#65835D]">
                {badgeLabel}
              </span>
            </div>
            <div className="rounded-full bg-[#F5F8F3] px-3 py-1.5 text-caption text-[#768170]">
              {learningMoments} aprendizados
            </div>
            <div className="rounded-full bg-[#F5F8F3] px-3 py-1.5 text-caption text-[#768170]">
              {skillsImproved} habilidades
            </div>
          </div>

          <div className="mt-3">
            <p className="text-micro uppercase tracking-wide text-[#9AA692]">
              expansão percebida
            </p>
            <p className="mt-1 text-caption font-medium text-[#51604C]">
              {growthLevel}% crescimento
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <LearningsVisual type={visualType} learningMoments={learningMoments} growthLevel={growthLevel} />
        </div>
      </div>
    </motion.button>
  );
}

function LearningsVisual({
  type,
  learningMoments,
  growthLevel,
}: {
  type: LearningsCardProps["visualType"];
  learningMoments: number;
  growthLevel: number;
}) {
  switch (type) {
    case "knowledgeConstellation":
      return <KnowledgeConstellation learningMoments={learningMoments} />;
    case "insightNodes":
      return <InsightNodes learningMoments={learningMoments} />;
    case "expansionRings":
      return <ExpansionRings growthLevel={growthLevel} />;
    case "knowledgeBloom":
      return <KnowledgeBloom growthLevel={growthLevel} />;
    default:
      return <GrowingBranch growthLevel={growthLevel} />;
  }
}

function GrowingBranch({ growthLevel }: { growthLevel: number }) {
  const branches = growthLevel > 80 ? 5 : growthLevel > 50 ? 4 : 3;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.path d="M60 100 L60 25" stroke="#6E8D63" strokeWidth="4" strokeLinecap="round" fill="none" />
      {[...Array(branches)].map((_, i) => {
        const y = 80 - i * 14;
        const direction = i % 2 === 0 ? 1 : -1;
        return (
          <motion.g
            key={i}
            animate={{ rotate: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 4, delay: i * 0.2 }}
            style={{ transformOrigin: `60px ${y}px` }}
          >
            <path
              d={`M60 ${y} Q ${60 + direction * 12} ${y - 6} ${60 + direction * 22} ${y - 14}`}
              stroke="#7FA171" strokeWidth="3" fill="none" strokeLinecap="round"
            />
            <circle cx={60 + direction * 22} cy={y - 14} r="4" fill="#A6C09C" />
          </motion.g>
        );
      })}
    </svg>
  );
}

function KnowledgeConstellation({ learningMoments }: { learningMoments: number }) {
  const nodes = Math.min(Math.max(learningMoments, 5), 10);
  const positions = [[25, 30], [55, 20], [90, 30], [35, 55], [80, 55], [25, 85], [55, 95], [90, 85], [60, 60], [100, 60]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {positions.slice(0, nodes - 1).map((pos, i) => (
        <line key={i} x1={pos[0]} y1={pos[1]} x2={positions[i + 1][0]} y2={positions[i + 1][1]} stroke="#C8D7C2" strokeWidth="2" />
      ))}
      {positions.slice(0, nodes).map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="4" fill="#739268"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.12 }}
        />
      ))}
    </svg>
  );
}

function InsightNodes({ learningMoments }: { learningMoments: number }) {
  const active = Math.min(Math.max(learningMoments, 4), 8);
  const nodes = [[25, 60], [50, 40], [75, 60], [50, 85], [95, 40], [95, 80], [25, 25], [25, 95]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {nodes.slice(0, active).map(([x, y], i) => (
        <g key={i}>
          {i > 0 && <line x1={nodes[i - 1][0]} y1={nodes[i - 1][1]} x2={x} y2={y} stroke="#D2DDCD" strokeWidth="2" />}
          <motion.circle
            cx={x} cy={y} r="4.5" fill="#719066"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.15 }}
          />
        </g>
      ))}
    </svg>
  );
}

function ExpansionRings({ growthLevel }: { growthLevel: number }) {
  const rings = growthLevel > 80 ? 5 : growthLevel > 50 ? 4 : 3;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(rings)].map((_, i) => (
        <motion.circle
          key={i} cx="60" cy="60" r={12 + i * 10} fill="none" stroke="#7B9970" strokeWidth="2" opacity={1 - i * 0.15}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

function KnowledgeBloom({ growthLevel }: { growthLevel: number }) {
  const petals = growthLevel > 80 ? 8 : growthLevel > 50 ? 6 : 4;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(petals)].map((_, i) => {
        const angle = (i / petals) * Math.PI * 2;
        const x = 60 + Math.cos(angle) * 24;
        const y = 60 + Math.sin(angle) * 24;
        return (
          <motion.circle
            key={i} cx={x} cy={y} r="10" fill="#DCE8D8"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.1 }}
          />
        );
      })}
      <circle cx="60" cy="60" r="10" fill="#76956C" />
    </svg>
  );
}
