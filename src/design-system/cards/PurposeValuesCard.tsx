import { motion } from "framer-motion";
import {
  Compass,
  ChevronRight,
} from "lucide-react";

type PurposeValuesCardProps = {
  visualType?:
    | "northStar"
    | "compass"
    | "guidingPath"
    | "valueConstellation"
    | "innerBalance";

  alignmentScore?: number;
  clarityLevel?: number;
  activeValues?: number;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function PurposeValuesCard({
  visualType = "northStar",
  alignmentScore = 84,
  clarityLevel = 72,
  activeValues = 5,
  insight = "Suas escolhas recentes parecem manter uma boa conexão com os valores e objetivos que você considera mais importantes.",
  badgeLabel = "forte alinhamento",
  onClick,
}: PurposeValuesCardProps) {
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
        border-[#D9DDF1]
        bg-[#FBFCFF]
        shadow-[0_2px_20px_rgba(90,100,180,0.05)]
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF0FB]">
            <Compass size={18} className="text-[#5967B3]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#2E3457]">
              Propósito e Valores
            </h3>
            <ChevronRight size={16} className="text-[#99A0C6]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#747B9A]">
            Direção pessoal, significado e alinhamento com aquilo que realmente importa.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#4E567A]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#EEF0FB] px-3 py-1.5">
              <span className="text-caption font-medium text-[#5B68B5]">
                {badgeLabel}
              </span>
            </div>
            <div className="rounded-full bg-[#F6F7FC] px-3 py-1.5 text-caption text-[#747B99]">
              {alignmentScore}% alinhamento
            </div>
            <div className="rounded-full bg-[#F6F7FC] px-3 py-1.5 text-caption text-[#747B99]">
              {clarityLevel}% clareza
            </div>
          </div>

          <div className="mt-3">
            <p className="text-micro uppercase tracking-wide text-[#A0A7C7]">
              valores presentes
            </p>
            <p className="mt-1 text-caption font-medium text-[#525B7E]">
              {activeValues} valores ativos
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <PurposeVisual type={visualType} alignmentScore={alignmentScore} clarityLevel={clarityLevel} activeValues={activeValues} />
        </div>
      </div>
    </motion.button>
  );
}

function PurposeVisual({
  type,
  alignmentScore,
  clarityLevel,
  activeValues,
}: {
  type: PurposeValuesCardProps["visualType"];
  alignmentScore: number;
  clarityLevel: number;
  activeValues: number;
}) {
  switch (type) {
    case "compass":
      return <CompassVisual alignmentScore={alignmentScore} />;
    case "guidingPath":
      return <GuidingPath clarityLevel={clarityLevel} />;
    case "valueConstellation":
      return <ValueConstellation activeValues={activeValues} />;
    case "innerBalance":
      return <InnerBalance alignmentScore={alignmentScore} />;
    default:
      return <NorthStar alignmentScore={alignmentScore} />;
  }
}

function NorthStar({ alignmentScore }: { alignmentScore: number }) {
  const glow = alignmentScore > 80 ? 1 : alignmentScore > 50 ? 0.7 : 0.45;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.line
        x1="60" y1="88" x2="60" y2="42"
        stroke="#C9CFEA" strokeWidth="2"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <motion.circle cx="60" cy="92" r="6" fill="#6B76B8" />
      <motion.g
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <path d="M60 20 L64 32 L76 36 L64 40 L60 52 L56 40 L44 36 L56 32 Z" fill="#D6B77A" opacity={glow} />
      </motion.g>
    </svg>
  );
}

function CompassVisual({ alignmentScore }: { alignmentScore: number }) {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="34" fill="none" stroke="#D7DCF0" strokeWidth="2" />
      <text x="60" y="20" textAnchor="middle" fontSize="10" fill="#9EA6C8">N</text>
      <text x="102" y="64" textAnchor="middle" fontSize="10" fill="#9EA6C8">E</text>
      <text x="60" y="106" textAnchor="middle" fontSize="10" fill="#9EA6C8">S</text>
      <text x="18" y="64" textAnchor="middle" fontSize="10" fill="#9EA6C8">W</text>
      <motion.path
        d="M60 60 L60 32" stroke="#6975B8" strokeWidth="4" strokeLinecap="round"
        animate={{ scaleY: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
      <circle cx="60" cy="60" r="5" fill="#6975B8" />
    </svg>
  );
}

function GuidingPath({ clarityLevel }: { clarityLevel: number }) {
  const curve = clarityLevel > 75 ? 8 : clarityLevel > 50 ? 18 : 32;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.path
        d={`M20 85 Q50 ${50 + curve} 70 60 Q90 ${40 - curve} 100 25`}
        fill="none" stroke="#7380C2" strokeWidth="4" strokeLinecap="round"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <circle cx="20" cy="85" r="4" fill="#7380C2" />
      <path d="M100 15 L104 24 L114 27 L104 30 L100 40 L96 30 L86 27 L96 24 Z" fill="#D4B47A" />
    </svg>
  );
}

function ValueConstellation({ activeValues }: { activeValues: number }) {
  const nodes = Math.min(Math.max(activeValues, 3), 8);
  const points: [number, number][] = [[30, 30], [60, 20], [90, 30], [35, 60], [85, 60], [30, 90], [60, 100], [90, 90]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {points.slice(0, nodes - 1).map((p, i) => (
        <line key={i} x1={p[0]} y1={p[1]} x2={points[i + 1][0]} y2={points[i + 1][1]} stroke="#D7DCF0" strokeWidth="2" />
      ))}
      {points.slice(0, nodes).map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="4" fill="#6975B8"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function InnerBalance({ alignmentScore }: { alignmentScore: number }) {
  const width = alignmentScore > 75 ? 22 : alignmentScore > 50 ? 18 : 14;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.path
        d={`M45 25 C${45 - width} 40, ${45 - width} 80, 45 95`}
        fill="none" stroke="#7380C2" strokeWidth="3" strokeLinecap="round"
      />
      <motion.path
        d={`M75 25 C${75 + width} 40, ${75 + width} 80, 75 95`}
        fill="none" stroke="#7380C2" strokeWidth="3" strokeLinecap="round"
      />
      <motion.circle
        cx="60" cy="60" r="8" fill="#D4B47A"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
    </svg>
  );
}
