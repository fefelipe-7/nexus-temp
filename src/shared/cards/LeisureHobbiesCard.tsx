import { motion } from "framer-motion";
import {
  Palette,
  Sparkles,
  ChevronRight,
} from "lucide-react";

type LeisureHobbiesCardProps = {
  visualType?:
    | "hobbyOrbit"
    | "joySparks"
    | "creativeMosaic"
    | "playfulWave"
    | "interestGarden";

  hobbyCount?: number;
  leisureHours?: number;
  engagementLevel?: number;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function LeisureHobbiesCard({
  visualType = "hobbyOrbit",
  hobbyCount = 5,
  leisureHours = 14,
  engagementLevel = 78,
  insight = "Você parece manter espaço para interesses e atividades que ajudam a renovar energia, curiosidade e bem-estar.",
  badgeLabel = "interesses ativos",
  onClick,
}: LeisureHobbiesCardProps) {
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
        border-[#F4DDCF]
        bg-[#FFFDFB]
        shadow-[0_2px_20px_rgba(220,150,90,0.06)]
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0E7]">
            <Palette size={18} className="text-[#D78155]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#4A3428]">
              Lazer e Hobbies
            </h3>
            <ChevronRight size={16} className="text-[#B69380]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#8A6D5A]">
            Atividades realizadas por prazer, curiosidade e expressão pessoal.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#624C3D]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#FFF0E7] px-3 py-1.5">
              <span className="text-caption font-medium text-[#D17A4A]">
                {badgeLabel}
              </span>
            </div>
            <div className="rounded-full bg-[#FFF7F2] px-3 py-1.5 text-caption text-[#8A715F]">
              {hobbyCount} hobbies
            </div>
            <div className="rounded-full bg-[#FFF7F2] px-3 py-1.5 text-caption text-[#8A715F]">
              {leisureHours}h recentes
            </div>
          </div>

          <div className="mt-3">
            <p className="text-micro uppercase tracking-wide text-[#B99882]">
              envolvimento
            </p>
            <p className="mt-1 text-caption font-medium text-[#654E3D]">
              {engagementLevel}% participação
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <LeisureVisual type={visualType} hobbyCount={hobbyCount} engagementLevel={engagementLevel} />
        </div>
      </div>
    </motion.button>
  );
}

function LeisureVisual({
  type,
  hobbyCount,
  engagementLevel,
}: {
  type: LeisureHobbiesCardProps["visualType"];
  hobbyCount: number;
  engagementLevel: number;
}) {
  switch (type) {
    case "joySparks":
      return <JoySparks count={hobbyCount} />;
    case "creativeMosaic":
      return <CreativeMosaic count={hobbyCount} />;
    case "playfulWave":
      return <PlayfulWave engagementLevel={engagementLevel} />;
    case "interestGarden":
      return <InterestGarden count={hobbyCount} />;
    default:
      return <HobbyOrbit count={hobbyCount} />;
  }
}

function HobbyOrbit({ count }: { count: number }) {
  const hobbies = Math.min(Math.max(count, 3), 8);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.circle
        cx="60" cy="60" r="10" fill="#D77D4F"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <circle cx="60" cy="60" r="28" fill="none" stroke="#F5D7C7" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="42" fill="none" stroke="#F7E4D8" strokeWidth="1" />
      {[...Array(hobbies)].map((_, i) => {
        const radius = i % 2 === 0 ? 28 : 42;
        const angle = (i / hobbies) * Math.PI * 2;
        const x = 60 + Math.cos(angle) * radius;
        const y = 60 + Math.sin(angle) * radius;
        return (
          <motion.circle
            key={i} cx={x} cy={y} r="4" fill="#F0AE7F"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
          />
        );
      })}
    </svg>
  );
}

function JoySparks({ count }: { count: number }) {
  const sparks = Math.min(Math.max(count * 2, 6), 16);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(sparks)].map((_, i) => {
        const x = 20 + ((i * 31) % 80);
        const y = 20 + ((i * 47) % 80);
        return (
          <motion.g
            key={i}
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.08 }}
          >
            <circle cx={x} cy={y} r={i % 3 === 0 ? 4 : 2.5} fill="#E08A57" />
          </motion.g>
        );
      })}
    </svg>
  );
}

function CreativeMosaic({ count }: { count: number }) {
  const blocks = Math.min(Math.max(count + 2, 4), 9);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(blocks)].map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <motion.rect
            key={i} x={25 + col * 25} y={25 + row * 25} width="18" height="18" rx="5"
            fill={i % 2 === 0 ? "#E08A57" : "#F5CBAF"}
            animate={{ y: [25 + row * 25, 22 + row * 25, 25 + row * 25] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.12 }}
          />
        );
      })}
    </svg>
  );
}

function PlayfulWave({ engagementLevel }: { engagementLevel: number }) {
  const amplitude = engagementLevel > 75 ? 18 : engagementLevel > 45 ? 12 : 7;
  const path = `M10 60 C25 ${60 - amplitude} 40 ${60 + amplitude} 55 60 C70 ${60 - amplitude} 85 ${60 + amplitude} 110 60`;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.path
        d={path} fill="none" stroke="#E08A57" strokeWidth="4" strokeLinecap="round"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
    </svg>
  );
}

function InterestGarden({ count }: { count: number }) {
  const flowers = Math.min(Math.max(count, 3), 7);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(flowers)].map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 30 + col * 28;
        const y = 35 + row * 28;
        return (
          <motion.g
            key={i}
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
          >
            <circle cx={x} cy={y} r="4" fill="#D97D4E" />
            <circle cx={x - 6} cy={y} r="3" fill="#F5CBAF" />
            <circle cx={x + 6} cy={y} r="3" fill="#F5CBAF" />
            <circle cx={x} cy={y - 6} r="3" fill="#F5CBAF" />
            <circle cx={x} cy={y + 6} r="3" fill="#F5CBAF" />
          </motion.g>
        );
      })}
    </svg>
  );
}
