import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  ChevronRight,
} from "lucide-react";

type ExperiencesCardProps = {
  visualType?:
    | "memoryConstellation"
    | "discoveryTrail"
    | "memorySparks"
    | "lifeMosaic"
    | "horizon";

  experienceCount?: number;
  memorableMoments?: number;
  noveltyLevel?: number;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function ExperiencesCard({
  visualType = "memoryConstellation",
  experienceCount = 8,
  memorableMoments = 3,
  noveltyLevel = 78,
  insight = "Você registrou experiências que parecem ter ampliado sua perspectiva e criado memórias significativas recentemente.",
  badgeLabel = "novas experiências",
  onClick,
}: ExperiencesCardProps) {
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
        border-[#F0DFC8]
        bg-[#FFFDF9]
        shadow-[0_2px_20px_rgba(180,140,80,0.06)]
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF2DE]">
            <Sparkles size={18} className="text-[#C28A3B]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#473620]">
              Experiências
            </h3>
            <ChevronRight size={16} className="text-[#B59B77]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#866F4D]">
            Momentos marcantes, novidades e acontecimentos fora da rotina.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#5E4A31]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#FFF2DE] px-3 py-1.5">
              <span className="text-caption font-medium text-[#B37A2B]">
                {badgeLabel}
              </span>
            </div>
            <div className="rounded-full bg-[#FFF8EE] px-3 py-1.5 text-caption text-[#8B7658]">
              {experienceCount} experiências
            </div>
            <div className="rounded-full bg-[#FFF8EE] px-3 py-1.5 text-caption text-[#8B7658]">
              {memorableMoments} momentos marcantes
            </div>
          </div>

          <div className="mt-3">
            <p className="text-micro uppercase tracking-wide text-[#B09A7B]">
              nível de novidade
            </p>
            <p className="mt-1 text-caption font-medium text-[#604C35]">
              {noveltyLevel}% exploração
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <ExperiencesVisual type={visualType} experienceCount={experienceCount} noveltyLevel={noveltyLevel} />
        </div>
      </div>
    </motion.button>
  );
}

function ExperiencesVisual({
  type,
  experienceCount,
  noveltyLevel,
}: {
  type: ExperiencesCardProps["visualType"];
  experienceCount: number;
  noveltyLevel: number;
}) {
  switch (type) {
    case "discoveryTrail":
      return <DiscoveryTrail experienceCount={experienceCount} />;
    case "memorySparks":
      return <MemorySparks experienceCount={experienceCount} />;
    case "lifeMosaic":
      return <LifeMosaic experienceCount={experienceCount} />;
    case "horizon":
      return <Horizon noveltyLevel={noveltyLevel} />;
    default:
      return <MemoryConstellation experienceCount={experienceCount} />;
  }
}

function MemoryConstellation({ experienceCount }: { experienceCount: number }) {
  const stars = Math.min(Math.max(experienceCount, 4), 12);
  const positions = [[25, 25], [60, 18], [95, 30], [35, 55], [80, 58], [20, 85], [55, 95], [100, 82], [50, 40], [75, 18], [25, 65], [90, 95]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {positions.slice(0, stars).map(([x, y], i) => (
        <motion.g
          key={i}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
        >
          <circle cx={x} cy={y} r="3" fill="#D99A3A" />
          <circle cx={x} cy={y} r="6" fill="none" stroke="#F2D3A2" strokeWidth="1" opacity="0.5" />
        </motion.g>
      ))}
    </svg>
  );
}

function DiscoveryTrail({ experienceCount }: { experienceCount: number }) {
  const steps = Math.min(Math.max(experienceCount, 4), 8);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(steps)].map((_, i) => {
        const x = 20 + i * 12;
        const y = 70 - Math.sin(i * 0.8) * 20;
        return (
          <g key={i}>
            {i < steps - 1 && (
              <line x1={x} y1={y} x2={x + 12} y2={70 - Math.sin((i + 1) * 0.8) * 20} stroke="#F0D3A4" strokeWidth="2" />
            )}
            <motion.circle
              cx={x} cy={y} r="4" fill="#C98A34"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.15 }}
            />
          </g>
        );
      })}
      <motion.path
        d="M104 28 L109 38 L118 40 L109 44 L104 54 L99 44 L90 40 L99 38 Z"
        fill="#F3C66E"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </svg>
  );
}

function MemorySparks({ experienceCount }: { experienceCount: number }) {
  const sparks = Math.min(Math.max(experienceCount, 5), 14);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(sparks)].map((_, i) => {
        const x = 20 + ((i * 27) % 80);
        const y = 20 + ((i * 43) % 80);
        return (
          <motion.circle
            key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 2.5} fill="#D7963B"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.1 }}
          />
        );
      })}
    </svg>
  );
}

function LifeMosaic({ experienceCount }: { experienceCount: number }) {
  const blocks = Math.min(Math.max(experienceCount, 4), 9);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(blocks)].map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <motion.rect
            key={i} x={25 + col * 25} y={25 + row * 25} width="18" height="18" rx="5"
            fill={i % 2 === 0 ? "#D89A45" : "#F2D5A7"}
            animate={{ y: [25 + row * 25, 22 + row * 25, 25 + row * 25] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.12 }}
          />
        );
      })}
    </svg>
  );
}

function Horizon({ noveltyLevel }: { noveltyLevel: number }) {
  const points = noveltyLevel > 80 ? 4 : noveltyLevel > 50 ? 3 : 2;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <line x1="15" y1="60" x2="105" y2="60" stroke="#F0D6AF" strokeWidth="2" />
      {[...Array(points)].map((_, i) => {
        const x = 30 + i * 25;
        return (
          <motion.g
            key={i}
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.25 }}
          >
            <circle cx={x} cy="60" r="4" fill="#D59437" />
            <circle cx={x} cy="60" r="8" fill="none" stroke="#F4D7A7" strokeWidth="1" />
          </motion.g>
        );
      })}
      <motion.path
        d="M90 30 L95 40 L105 42 L95 46 L90 56 L85 46 L75 42 L85 40 Z"
        fill="#F1C56D"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
    </svg>
  );
}
