import { motion } from "framer-motion";
import {
  Leaf,
  ChevronRight,
} from "lucide-react";

type MentalPracticesCardProps = {
  visualType?:
    | "zenStones"
    | "breathingGarden"
    | "presenceWaves"
    | "mindSeeds"
    | "ritualOrbit";

  practiceDays?: number;
  currentStreak?: number;
  weeklyConsistency?: number;
  favoritePractice?: string;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function MentalPracticesCard({
  visualType = "zenStones",
  practiceDays = 18,
  currentStreak = 7,
  weeklyConsistency = 82,
  favoritePractice = "meditação guiada",
  insight = "Você tem mantido uma rotina relativamente consistente de práticas voltadas ao bem-estar mental.",
  badgeLabel = "presença cultivada",
  onClick,
}: MentalPracticesCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="
        w-full
        rounded-[32px]
        border
        border-[#D8E6DD]
        bg-[#F7FBF8]
        p-5
        text-left
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F3EC]">
            <Leaf size={18} className="text-[#5D7B68]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#24342A]">
              Práticas Mentais
            </h3>
            <ChevronRight size={16} className="text-[#8AA094]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#667A70]">
            Exercícios de atenção,
            reflexão e presença
            cultivados ao longo do tempo.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#41524A]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#E8F3EC] px-3 py-1.5">
              <span className="text-caption font-medium text-[#587062]">
                {badgeLabel}
              </span>
            </div>
            <div className="rounded-full bg-[#F0F7F3] px-3 py-1.5 text-caption text-[#667A70]">
              {practiceDays} sessões
            </div>
            <div className="rounded-full bg-[#F0F7F3] px-3 py-1.5 text-caption text-[#667A70]">
              {currentStreak} dias seguidos
            </div>
          </div>

          <div className="mt-3">
            <p className="text-caption uppercase tracking-wide text-[#95A69D]">
              prática mais frequente
            </p>
            <p className="mt-1 text-caption font-medium text-[#495C53]">
              {favoritePractice}
            </p>
          </div>
        </div>

        <MentalPracticesVisual type={visualType} consistency={weeklyConsistency} />
      </div>
    </motion.button>
  );
}

function MentalPracticesVisual({ type, consistency }: { type: MentalPracticesCardProps["visualType"]; consistency: number }) {
  switch (type) {
    case "breathingGarden": return <BreathingGarden />;
    case "presenceWaves": return <PresenceWaves />;
    case "mindSeeds": return <MindSeeds />;
    case "ritualOrbit": return <RitualOrbit />;
    default: return <ZenStones consistency={consistency} />;
  }
}

function ZenStones({ consistency }: { consistency: number }) {
  const stones = consistency > 85 ? 4 : consistency > 60 ? 3 : 2;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(stones)].map((_, i) => (
        <motion.ellipse
          key={i}
          cx="60"
          cy={90 - i * 18}
          rx={20 - i * 2}
          ry={8}
          fill="#91A89A"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 4, delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

function BreathingGarden() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => {
          const cx = 30 + col * 30;
          const cy = 30 + row * 30;
          const delay = row * 0.3 + col * 0.2;
          return (
            <motion.circle
              key={`${row}-${col}`}
              cx={cx} cy={cy}
              r="8" fill="#9DB8A8"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 5, delay }}
            />
          );
        })
      )}
    </svg>
  );
}

function PresenceWaves() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M10 ${45 + i * 16} Q30 ${35 + i * 16} 50 ${45 + i * 16} T90 ${45 + i * 16}`}
          fill="none" stroke="#9DB8A8" strokeWidth="2" opacity={0.7 - i * 0.2}
          animate={{ x: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 4 + i * 0.5 }}
        />
      ))}
    </svg>
  );
}

function MindSeeds() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 32;
        return (
          <motion.circle
            key={i}
            cx={60 + Math.cos(angle) * r}
            cy={60 + Math.sin(angle) * r}
            r="5" fill="#8DAA98"
            animate={{ scale: [0.5, 1.2, 0.5] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
          />
        );
      })}
      <circle cx="60" cy="60" r="6" fill="#587062" />
    </svg>
  );
}

function RitualOrbit() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.circle
        cx="60" cy="60" r="14" fill="#8DAA98"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.circle
        cx="60" cy="60" r="30" fill="none" stroke="#BBD0C3" strokeWidth="1.5"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        style={{ transformOrigin: "60px 60px" }}
      />
      <motion.circle
        cx="60" cy="60" r="42" fill="none" stroke="#D0E0D6" strokeWidth="1"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        style={{ transformOrigin: "60px 60px" }}
      />
    </svg>
  );
}
