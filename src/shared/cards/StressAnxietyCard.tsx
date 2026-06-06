import { motion } from "framer-motion";
import {
  Brain,
  Cloud,
  Wind,
  Waves,
  ChevronRight,
} from "lucide-react";

type StressAnxietyCardProps = {
  status?: "positive" | "stable" | "attention" | "critical";
  visualType?:
    | "breathingRings"
    | "pressureCloud"
    | "pulseLine"
    | "mentalLoadBlocks"
    | "breathingBalance";
  trend?: "low" | "moderate" | "high";
  insight?: string;
  badgeLabel?: string;
  pressureLevel?: number;
  variation?: number[];
  onClick?: () => void;
};

const statusConfig = {
  positive: {
    badge: "tensão reduzida",
    icon: Wind,
  },
  stable: {
    badge: "equilíbrio emocional",
    icon: Waves,
  },
  attention: {
    badge: "atenção moderada",
    icon: Cloud,
  },
  critical: {
    badge: "sobrecarga percebida",
    icon: Brain,
  },
};

export function StressAnxietyCard({
  status = "attention",
  visualType = "breathingRings",
  trend = "moderate",
  insight =
    "Algumas preocupações aparecem com frequência, mas ainda parecem administráveis.",
  badgeLabel,
  pressureLevel = 3,
  variation = [30, 45, 25, 55, 40, 65, 35],
  onClick,
}: StressAnxietyCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="
        w-full
        text-left
        rounded-[32px]
        border
        border-[#D9D3E7]
        bg-[#F7F5FA]
        shadow-[0_2px_20px_rgba(120,100,150,0.05)]
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#ECE7F6]">
            <Icon size={18} className="text-[#736B89]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#292631]">
              Estresse e Ansiedade
            </h3>
            <ChevronRight size={16} className="text-[#8E869F]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#756E84]">
            Tensões percebidas, preocupações
            recorrentes e impacto emocional do dia.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#3F3A49]">
            {insight}
          </p>

          <div className="mt-4 inline-flex rounded-full bg-[#ECE7F6] px-3 py-1.5">
            <span className="text-caption font-medium text-[#5E5871]">
              {badgeLabel || config.badge}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <EmotionVisual
            type={visualType}
            trend={trend}
            pressureLevel={pressureLevel}
            variation={variation}
          />
        </div>
      </div>
    </motion.button>
  );
}

type VisualProps = {
  type: StressAnxietyCardProps["visualType"];
  trend: StressAnxietyCardProps["trend"];
  pressureLevel: number;
  variation: number[];
};

function EmotionVisual({
  type,
  trend,
  pressureLevel,
  variation,
}: VisualProps) {
  switch (type) {
    case "pressureCloud":
      return <PressureCloud pressureLevel={pressureLevel} />;
    case "pulseLine":
      return <PulseLine trend={trend} variation={variation} />;
    case "mentalLoadBlocks":
      return <MentalLoadBlocks pressureLevel={pressureLevel} />;
    case "breathingBalance":
      return <BreathingBalance trend={trend} />;
    default:
      return <BreathingRings pressureLevel={pressureLevel} />;
  }
}

function BreathingRings({ pressureLevel }: { pressureLevel: number }) {
  const rings = Math.max(1, Math.min(5, pressureLevel));

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(rings)].map((_, i) => (
        <motion.circle
          key={i}
          cx="60"
          cy="60"
          r={12 + i * 10}
          fill="none"
          stroke="#8E86A8"
          strokeWidth="1.4"
          opacity={0.9 - i * 0.12}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 4 + i }}
        />
      ))}
    </svg>
  );
}

function PressureCloud({ pressureLevel }: { pressureLevel: number }) {
  const count = Math.max(4, pressureLevel * 2);

  const positions = [
    [50, 30], [72, 34], [34, 55], [58, 55],
    [82, 55], [46, 78], [70, 78], [25, 40],
    [92, 42], [58, 96],
  ];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(count)].map((_, i) => {
        const [x, y] = positions[i % positions.length];
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={7 + (i % 3)}
            fill="#DAD3EA"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4 + i * 0.3 }}
          />
        );
      })}
    </svg>
  );
}

function PulseLine({ trend, variation }: { trend: string; variation: number[] }) {
  const points = variation.map((v, i) => `${10 + i * 16},${90 - v}`).join(" ");

  return (
    <svg width="130" height="120" viewBox="0 0 130 120">
      <motion.polyline
        points={points}
        fill="none"
        stroke="#7E7695"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: trend === "high" ? 1.8 : 4 }}
      />
    </svg>
  );
}

function MentalLoadBlocks({ pressureLevel }: { pressureLevel: number }) {
  const blocks = Math.max(3, pressureLevel + 2);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(blocks)].map((_, i) => {
        const row = i < 1 ? 0 : i < 3 ? 1 : 2;
        const col = row === 0 ? 0 : row === 1 ? i - 1 : i - 3;

        return (
          <motion.rect
            key={i}
            x={40 + col * 22}
            y={25 + row * 24}
            width="14"
            height="14"
            rx="4"
            fill="#D6D0E6"
            animate={{ y: [25 + row * 24, 22 + row * 24, 25 + row * 24] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.3 }}
          />
        );
      })}
    </svg>
  );
}

function BreathingBalance({ trend }: { trend: string }) {
  const path = trend === "high"
    ? "M60 20 C90 30 90 55 60 60 C25 70 35 95 60 100"
    : "M60 20 C85 35 85 50 60 60 C35 70 35 85 60 100";

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.path
        d={path}
        fill="none"
        stroke="#847C99"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />
    </svg>
  );
}
