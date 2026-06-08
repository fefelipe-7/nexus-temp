import { motion } from "framer-motion";
import {
  Flag,
  ChevronRight,
} from "lucide-react";

type MilestonesCardProps = {
  visualType?:
    | "timelinePath"
    | "milestoneConstellation"
    | "lifeRiver"
    | "transitionSteps"
    | "chapterMarkers";

  milestoneCount?: number;
  transitionCount?: number;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function MilestonesCard({
  visualType = "timelinePath",
  milestoneCount = 8,
  transitionCount = 3,
  insight = "Sua trajetória recente mostra momentos importantes de mudança, conquistas e encerramentos que parecem marcar diferentes fases da sua vida.",
  badgeLabel = "momentos marcantes",
  onClick,
}: MilestonesCardProps) {
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
        border-[#E4DDD5]
        bg-[#FFFCFA]
        shadow-[0_2px_20px_rgba(120,95,70,0.05)]
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F0EA]">
            <Flag size={18} className="text-[#9C7356]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#4D3A2D]">Marcos</h3>
            <ChevronRight size={16} className="text-[#B39A86]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#85705F]">
            Eventos importantes, transições pessoais e capítulos significativos da sua trajetória.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#5F4A3A]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#F8F0EA] px-3 py-1.5">
              <span className="text-caption font-medium text-[#9C7356]">
                {badgeLabel}
              </span>
            </div>
            <div className="rounded-full bg-[#FCF7F3] px-3 py-1.5 text-caption text-[#8A7461]">
              {milestoneCount} marcos
            </div>
            <div className="rounded-full bg-[#FCF7F3] px-3 py-1.5 text-caption text-[#8A7461]">
              {transitionCount} transições
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <MilestoneVisual type={visualType} milestoneCount={milestoneCount} transitionCount={transitionCount} />
        </div>
      </div>
    </motion.button>
  );
}

function MilestoneVisual({
  type,
  milestoneCount,
  transitionCount,
}: {
  type: MilestonesCardProps["visualType"];
  milestoneCount: number;
  transitionCount: number;
}) {
  switch (type) {
    case "milestoneConstellation":
      return <MilestoneConstellation milestoneCount={milestoneCount} />;
    case "lifeRiver":
      return <LifeRiver transitionCount={transitionCount} />;
    case "transitionSteps":
      return <TransitionSteps transitionCount={transitionCount} />;
    case "chapterMarkers":
      return <ChapterMarkers milestoneCount={milestoneCount} />;
    default:
      return <TimelinePath milestoneCount={milestoneCount} />;
  }
}

function TimelinePath({ milestoneCount }: { milestoneCount: number }) {
  const points = Math.min(Math.max(milestoneCount, 4), 10);
  const positions: [number, number][] = [[15, 90], [25, 80], [38, 62], [55, 55], [68, 58], [78, 45], [88, 35], [98, 30], [105, 30], [112, 26]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.path
        d="M15 90 C30 80, 35 45, 55 55 C70 65, 80 25, 105 30"
        fill="none" stroke="#D8C5B5" strokeWidth="3" strokeLinecap="round"
        animate={{ pathLength: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      {[...Array(points)].map((_, i) => {
        const p = positions[i];
        return (
          <motion.circle
            key={i} cx={p[0]} cy={p[1]} r={i % 3 === 0 ? 4.5 : 3} fill="#9C7356"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
          />
        );
      })}
    </svg>
  );
}

function MilestoneConstellation({ milestoneCount }: { milestoneCount: number }) {
  const nodes = Math.min(Math.max(milestoneCount, 5), 10);
  const positions: [number, number][] = [[25, 25], [55, 20], [85, 35], [35, 55], [75, 60], [25, 85], [55, 95], [90, 80], [105, 50], [60, 50]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {positions.slice(0, nodes - 1).map((p, i) => (
        <line key={i} x1={p[0]} y1={p[1]} x2={positions[i + 1][0]} y2={positions[i + 1][1]} stroke="#E1D3C8" strokeWidth="2" />
      ))}
      {positions.slice(0, nodes).map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="4" fill="#A0785B"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.12 }}
        />
      ))}
    </svg>
  );
}

function LifeRiver({ transitionCount }: { transitionCount: number }) {
  const amplitude = transitionCount > 4 ? 20 : transitionCount > 2 ? 14 : 8;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.path
        d={`M10 60 C25 ${60 - amplitude} 40 ${60 + amplitude} 60 60 C80 ${60 - amplitude} 95 ${60 + amplitude} 110 60`}
        fill="none" stroke="#B58C6B" strokeWidth="5" strokeLinecap="round"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
    </svg>
  );
}

function TransitionSteps({ transitionCount }: { transitionCount: number }) {
  const steps = Math.min(Math.max(transitionCount + 2, 3), 7);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(steps)].map((_, i) => (
        <motion.rect
          key={i} x={20 + i * 12} y={80 - i * 10} width="18" height="18" rx="5"
          fill={i === steps - 1 ? "#A07759" : "#DCCBBE"}
          animate={{ y: [80 - i * 10, 78 - i * 10, 80 - i * 10] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.12 }}
        />
      ))}
    </svg>
  );
}

function ChapterMarkers({ milestoneCount }: { milestoneCount: number }) {
  const chapters = Math.min(Math.max(milestoneCount, 4), 8);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <line x1="15" y1="60" x2="105" y2="60" stroke="#E1D3C7" strokeWidth="3" strokeLinecap="round" />
      {[...Array(chapters)].map((_, i) => {
        const x = 20 + i * (80 / Math.max(chapters - 1, 1));
        return (
          <motion.g
            key={i}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
          >
            <circle cx={x} cy="60" r="5" fill="#A27A5D" />
            <line x1={x} y1="50" x2={x} y2="32" stroke="#D5C3B6" strokeWidth="2" />
          </motion.g>
        );
      })}
    </svg>
  );
}
