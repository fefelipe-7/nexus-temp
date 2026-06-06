import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  Wind,
  ChevronRight,
} from "lucide-react";

type MotivationWillpowerCardProps = {
  status?: "high" | "moderate" | "low";
  visualType?:
    | "ignitionSpark"
    | "momentumTrail"
    | "risingGlow"
    | "actionSeeds"
    | "windCurrent";
  motivationLevel?: number;
  initiativeLevel?: number;
  insight?: string;
  badgeLabel?: string;
  onClick?: () => void;
};

const statusConfig = {
  high: { badge: "impulso consistente", icon: Sparkles },
  moderate: { badge: "energia variável", icon: Wind },
  low: { badge: "inércia percebida", icon: Flame },
};

export function MotivationWillpowerCard({
  status = "high",
  visualType = "ignitionSpark",
  motivationLevel = 82,
  initiativeLevel = 71,
  insight = "Você demonstra maior facilidade para iniciar tarefas e manter movimento em direção aos seus objetivos.",
  badgeLabel,
  onClick,
}: MotivationWillpowerCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="
        w-full
        rounded-[32px]
        border
        border-[#F0DFC5]
        bg-[#FFF9F2]
        p-5
        text-left
        shadow-[0_2px_20px_rgba(180,140,80,0.06)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0DB]">
            <Icon size={18} className="text-[#B9813D]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#2D2922]">
              Motivação e Vontade
            </h3>
            <ChevronRight size={16} className="text-[#B49B7A]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#7D6C58]">
            Disposição para agir, iniciar
            tarefas e sustentar objetivos
            ao longo do dia.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#4D4337]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#FFF0DB] px-3 py-1.5">
              <span className="text-caption font-medium text-[#8A6737]">
                {badgeLabel || config.badge}
              </span>
            </div>
            <div className="rounded-full bg-[#FFF5E8] px-3 py-1.5 text-caption text-[#7C6442]">
              {motivationLevel}% motivação
            </div>
            <div className="rounded-full bg-[#FFF5E8] px-3 py-1.5 text-caption text-[#7C6442]">
              {initiativeLevel}% iniciativa
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <MotivationVisual type={visualType} level={motivationLevel} />
        </div>
      </div>
    </motion.button>
  );
}

function MotivationVisual({ type, level }: { type: MotivationWillpowerCardProps["visualType"]; level: number }) {
  switch (type) {
    case "momentumTrail": return <MomentumTrail level={level} />;
    case "risingGlow": return <RisingGlow level={level} />;
    case "actionSeeds": return <ActionSeeds level={level} />;
    case "windCurrent": return <WindCurrent level={level} />;
    default: return <IgnitionSpark level={level} />;
  }
}

function IgnitionSpark({ level }: { level: number }) {
  const sparks = level > 85 ? 8 : level > 65 ? 6 : level > 40 ? 4 : 2;
  const positions = [
    [60, 15], [95, 35], [105, 65], [85, 95],
    [60, 108], [35, 95], [15, 65], [25, 35],
  ];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.circle
        cx="60" cy="60" r="18" fill="#F4C27A"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      {positions.slice(0, sparks).map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="5" fill="#E8A74F"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 + i * 0.3 }}
        />
      ))}
    </svg>
  );
}

function MomentumTrail({ level }: { level: number }) {
  const dots = Math.max(2, Math.round(level / 15));

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(dots)].map((_, i) => (
        <motion.circle
          key={i} cx={18 + i * 14} cy={60}
          r={4 + i * 0.8} fill="#DCA35A"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function RisingGlow({ level }: { level: number }) {
  const rings = level > 80 ? 4 : level > 60 ? 3 : 2;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(rings)].map((_, i) => (
        <motion.circle
          key={i} cx="60" cy="60" r={18 + i * 12}
          fill="none" stroke="#E0B276" strokeWidth="2"
          opacity={0.9 - i * 0.2}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
      ))}
      <circle cx="60" cy="60" r="14" fill="#E8B15F" />
    </svg>
  );
}

function ActionSeeds({ level }: { level: number }) {
  const seeds = level > 80 ? 8 : level > 60 ? 6 : 4;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(seeds)].map((_, i) => (
        <motion.circle
          key={i} cx={25 + i * 10} cy={90 - i * 8} r="4" fill="#D89C4E"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function WindCurrent({ level }: { level: number }) {
  const waves = level > 80 ? 4 : level > 60 ? 3 : 2;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(waves)].map((_, i) => (
        <motion.path
          key={i}
          d={`M20 ${40 + i * 18} C40 ${30 + i * 18} 80 ${50 + i * 18} 100 ${40 + i * 18}`}
          fill="none" stroke="#D6A15E" strokeWidth="3" strokeLinecap="round"
          animate={{ x: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.3 }}
        />
      ))}
    </svg>
  );
}
