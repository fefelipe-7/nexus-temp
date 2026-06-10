import { motion } from "framer-motion";
import {
  Brain,
  ChevronRight,
} from "lucide-react";

type FocusCognitionCardProps = {
  status?: "excellent" | "good" | "moderate" | "low";
  visualType?:
    | "focusHalo"
    | "cognitiveWindow"
    | "attentionBeam"
    | "mentalOrbit"
    | "peakClock";
  focusScore?: number;
  peakHour?: string;
  insight?: string;
  badgeLabel?: string;
  onClick?: () => void;
};

const statusConfig = {
  excellent: { badge: "clareza elevada" },
  good: { badge: "bom fluxo mental" },
  moderate: { badge: "atenção estável" },
  low: { badge: "energia cognitiva reduzida" },
};

export function FocusCognitionCard({
  status = "good",
  visualType = "cognitiveWindow",
  focusScore = 78,
  peakHour = "09:00–11:00",
  insight = "Seu foco parece mais consistente durante o período da manhã, especialmente em atividades que exigem concentração contínua.",
  badgeLabel,
  onClick,
}: FocusCognitionCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="
        w-full
        rounded-[32px]
        border
        border-[#D7E2EE]
        bg-[#F7FAFC]
        p-5
        text-left
      "
    >
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF1F8]">
            <Brain size={18} className="text-[#60738A]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#292631]">
              Foco e Cognição
            </h3>
            <ChevronRight size={16} className="text-[#8E869F]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#6A7683]">
            Clareza mental, atenção sustentada e
            períodos de maior desempenho cognitivo.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#3F3A49]">
            {insight}
          </p>

          <div className="mt-4 flex gap-2 flex-wrap">
            <div className="rounded-full bg-[#EAF1F8] px-3 py-1 text-caption text-[#5E5871]">
              {badgeLabel || statusConfig[status].badge}
            </div>
            <div className="rounded-full bg-[#EEF4FA] px-3 py-1 text-caption text-[#5E5871]">
              {focusScore}% foco percebido
            </div>
            <div className="rounded-full bg-[#EEF4FA] px-3 py-1 text-caption text-[#5E5871]">
              pico: {peakHour}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {visualType === "focusHalo" && <FocusHalo score={focusScore} />}
          {visualType === "cognitiveWindow" && <CognitiveWindow score={focusScore} />}
          {visualType === "attentionBeam" && <AttentionBeam score={focusScore} />}
          {visualType === "mentalOrbit" && <MentalOrbit score={focusScore} />}
          {visualType === "peakClock" && <PeakClock />}
        </div>
      </div>
    </motion.button>
  );
}

function FocusHalo({ score }: { score: number }) {
  const rings = score > 85 ? 5 : score > 70 ? 4 : score > 50 ? 3 : 2;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(rings)].map((_, i) => (
        <motion.circle
          key={i}
          cx="60"
          cy="60"
          r={14 + i * 10}
          fill="none"
          stroke="#7B94AE"
          strokeWidth="1.5"
          opacity={0.9 - i * 0.15}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 4 + i }}
        />
      ))}
    </svg>
  );
}

function CognitiveWindow({ score }: { score: number }) {
  const active = Math.round((score / 100) * 7);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(7)].map((_, i) => (
        <rect
          key={i}
          x={18 + i * 13}
          y="52"
          width="10"
          height="22"
          rx="5"
          fill={i < active ? "#7D9CC0" : "#DDE6F0"}
        />
      ))}
    </svg>
  );
}

function AttentionBeam({ score }: { score: number }) {
  const width = 20 + score * 0.5;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="35" cy="60" r="10" fill="#7D9CC0" />
      <polygon points={`35,50 ${width},60 35,70`} fill="#C9D8E8" />
    </svg>
  );
}

function MentalOrbit({ score }: { score: number }) {
  const radius = score > 80 ? 28 : 38;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="12" fill="#7D9CC0" />
      {[0, 90, 180, 270].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <motion.circle
            key={a}
            cx={60 + radius * Math.cos(rad)}
            cy={60 + radius * Math.sin(rad)}
            r="5"
            fill="#C6D6E8"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12 }}
          />
        );
      })}
    </svg>
  );
}

function PeakClock() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="36" fill="none" stroke="#D6E1EC" strokeWidth="8" />
      <path
        d="M60 24 A36 36 0 0 1 92 60"
        stroke="#7D9CC0"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="87" cy="44" r="6" fill="#7D9CC0" />
    </svg>
  );
}
