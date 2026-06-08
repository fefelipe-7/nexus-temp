import { motion } from "framer-motion";
import {
  GitBranch,
  ChevronRight,
} from "lucide-react";

type DecisionsCardProps = {
  visualType?:
    | "decisionPaths"
    | "choiceNodes"
    | "decisionCompass"
    | "satisfactionBalance"
    | "decisionTree";

  decisionCount?: number;
  satisfactionScore?: number;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function DecisionsCard({
  visualType = "decisionPaths",
  decisionCount = 18,
  satisfactionScore = 78,
  insight = "As decisões recentes parecem refletir suas prioridades atuais, com boa percepção de satisfação sobre os caminhos escolhidos.",
  badgeLabel = "escolhas consistentes",
  onClick,
}: DecisionsCardProps) {
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
        border-[#DCE3EC]
        bg-[#FCFDFE]
        shadow-[0_2px_20px_rgba(80,100,120,0.05)]
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF3F8]">
            <GitBranch size={18} className="text-[#5D748D]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#2E3A47]">Decisões</h3>
            <ChevronRight size={16} className="text-[#96A4B3]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#6E7A87]">
            Escolhas realizadas, caminhos tomados e percepção sobre os resultados obtidos.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#4E5D6C]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#EEF3F8] px-3 py-1.5">
              <span className="text-caption font-medium text-[#5D748D]">
                {badgeLabel}
              </span>
            </div>
            <div className="rounded-full bg-[#F7F9FB] px-3 py-1.5 text-caption text-[#748190]">
              {decisionCount} decisões
            </div>
            <div className="rounded-full bg-[#F7F9FB] px-3 py-1.5 text-caption text-[#748190]">
              {satisfactionScore}% satisfação
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <DecisionVisual type={visualType} decisionCount={decisionCount} satisfactionScore={satisfactionScore} />
        </div>
      </div>
    </motion.button>
  );
}

function DecisionVisual({
  type,
  decisionCount,
  satisfactionScore,
}: {
  type: DecisionsCardProps["visualType"];
  decisionCount: number;
  satisfactionScore: number;
}) {
  switch (type) {
    case "choiceNodes":
      return <ChoiceNodes decisionCount={decisionCount} />;
    case "decisionCompass":
      return <DecisionCompass satisfactionScore={satisfactionScore} />;
    case "satisfactionBalance":
      return <SatisfactionBalance satisfactionScore={satisfactionScore} />;
    case "decisionTree":
      return <DecisionTree decisionCount={decisionCount} />;
    default:
      return <DecisionPaths decisionCount={decisionCount} satisfactionScore={satisfactionScore} />;
  }
}

function DecisionPaths({ decisionCount, satisfactionScore }: { decisionCount: number; satisfactionScore: number }) {
  const branches = decisionCount > 20 ? 5 : decisionCount > 10 ? 4 : 3;
  const smoothness = satisfactionScore > 75 ? 1 : satisfactionScore > 50 ? 1.3 : 1.7;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.circle cx="30" cy="90" r="5" fill="#70859B" />
      {[...Array(branches)].map((_, i) => {
        const y = 85 - i * 15;
        return (
          <motion.path
            key={i}
            d={`M30 90 Q55 ${y * smoothness} 95 ${20 + i * 18}`}
            fill="none" stroke="#B8C6D4" strokeWidth="2.5" strokeLinecap="round"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
          />
        );
      })}
      {[...Array(branches)].map((_, i) => (
        <circle key={i} cx="95" cy={20 + i * 18} r="4" fill="#70859B" />
      ))}
    </svg>
  );
}

function ChoiceNodes({ decisionCount }: { decisionCount: number }) {
  const nodes = Math.min(Math.max(decisionCount / 3, 4), 9);
  const positions: [number, number][] = [[25, 60], [50, 35], [50, 85], [80, 25], [80, 60], [80, 95], [105, 40], [105, 80], [60, 60]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {positions.slice(1, nodes).map((p, i) => (
        <line key={i} x1="25" y1="60" x2={p[0]} y2={p[1]} stroke="#D2DAE2" strokeWidth="2" />
      ))}
      {positions.slice(0, nodes).map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="4.5" fill="#6F859C"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.12 }}
        />
      ))}
    </svg>
  );
}

function DecisionCompass({ satisfactionScore }: { satisfactionScore: number }) {
  const rotation = (satisfactionScore - 50) * 1.8;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="34" fill="none" stroke="#D8E0E8" strokeWidth="2" />
      <motion.line
        x1="60" y1="60" x2="60" y2="28"
        stroke="#657D95" strokeWidth="4" strokeLinecap="round"
        animate={{ rotate: rotation }}
        style={{ transformOrigin: "60px 60px" }}
      />
      <circle cx="60" cy="60" r="5" fill="#657D95" />
    </svg>
  );
}

function SatisfactionBalance({ satisfactionScore }: { satisfactionScore: number }) {
  const offset = ((satisfactionScore - 50) / 50) * 18;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <line x1="60" y1="25" x2="60" y2="90" stroke="#D5DEE7" strokeWidth="3" />
      <motion.line
        x1="30" y1="55" x2="90" y2="55"
        stroke="#6E859D" strokeWidth="3" strokeLinecap="round"
        animate={{ rotate: offset }}
        style={{ transformOrigin: "60px 55px" }}
      />
      <circle cx="30" cy="55" r="7" fill="#BAC8D6" />
      <circle cx="90" cy="55" r="7" fill="#6E859D" />
    </svg>
  );
}

function DecisionTree({ decisionCount }: { decisionCount: number }) {
  const leaves = Math.min(Math.max(decisionCount / 2, 4), 10);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <line x1="60" y1="95" x2="60" y2="45" stroke="#7B8FA3" strokeWidth="4" strokeLinecap="round" />
      {[...Array(leaves)].map((_, i) => {
        const angle = (i / leaves) * Math.PI - Math.PI / 2;
        const x = 60 + Math.cos(angle) * 35;
        const y = 45 + Math.sin(angle) * 25;
        return (
          <motion.g
            key={i}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.1 }}
          >
            <line x1="60" y1="45" x2={x} y2={y} stroke="#D3DCE5" strokeWidth="2" />
            <circle cx={x} cy={y} r="4" fill="#7B8FA3" />
          </motion.g>
        );
      })}
    </svg>
  );
}
