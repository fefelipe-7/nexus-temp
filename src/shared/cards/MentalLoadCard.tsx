import { motion } from "framer-motion";
import {
  Layers3,
  Brain,
  CircleDot,
  ChevronRight,
} from "lucide-react";

type MentalLoadCardProps = {
  status?: "low" | "moderate" | "high";
  visualType?:
    | "mentalStack"
    | "openLoops"
    | "cognitiveThreads"
    | "loadContainers"
    | "attentionDistribution";
  mentalLoadScore?: number;
  activeTopics?: number;
  insight?: string;
  badgeLabel?: string;
  onClick?: () => void;
};

const statusConfig = {
  low: { badge: "espaço mental disponível", icon: CircleDot },
  moderate: { badge: "ocupação equilibrada", icon: Layers3 },
  high: { badge: "múltiplas demandas ativas", icon: Brain },
};

export function MentalLoadCard({
  status = "moderate",
  visualType = "attentionDistribution",
  mentalLoadScore = 72,
  activeTopics = 8,
  insight = "Existem diferentes responsabilidades ocupando sua atenção, mas ainda dentro de uma capacidade administrável.",
  badgeLabel,
  onClick,
}: MentalLoadCardProps) {
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
        border-[#D9DFEA]
        bg-[#F8FAFC]
        p-5
        text-left
        shadow-[0_2px_20px_rgba(80,100,130,0.05)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF0F7]">
            <Icon size={18} className="text-[#66748A]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#26303F]">
              Carga Mental
            </h3>
            <ChevronRight size={16} className="text-[#8A95A8]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#6D7888]">
            Demandas cognitivas acumuladas e
            quantidade de assuntos exigindo
            atenção.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#3E4958]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#EAF0F7] px-3 py-1.5">
              <span className="text-caption font-medium text-[#58677B]">
                {badgeLabel || config.badge}
              </span>
            </div>
            <div className="rounded-full bg-[#F0F4F8] px-3 py-1.5 text-caption text-[#647286]">
              {mentalLoadScore}% carga percebida
            </div>
            <div className="rounded-full bg-[#F0F4F8] px-3 py-1.5 text-caption text-[#647286]">
              {activeTopics} assuntos ativos
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <MentalLoadVisual type={visualType} load={mentalLoadScore} topics={activeTopics} />
        </div>
      </div>
    </motion.button>
  );
}

function MentalLoadVisual({ type, load, topics }: { type: MentalLoadCardProps["visualType"]; load: number; topics: number }) {
  switch (type) {
    case "openLoops": return <OpenLoops topics={topics} />;
    case "cognitiveThreads": return <CognitiveThreads load={load} />;
    case "loadContainers": return <LoadContainers load={load} />;
    case "attentionDistribution": return <AttentionDistribution topics={topics} />;
    default: return <MentalStack load={load} />;
  }
}

function MentalStack({ load }: { load: number }) {
  const layers = load > 85 ? 7 : load > 70 ? 6 : load > 55 ? 5 : load > 35 ? 4 : 2;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(layers)].map((_, i) => (
        <motion.rect
          key={i}
          x="20" y={85 - i * 12} width="80" height="8" rx="4"
          fill="#8C9AAF" opacity={0.95 - i * 0.08}
          animate={{ y: [85 - i * 12, 83 - i * 12, 85 - i * 12] }}
          transition={{ repeat: Infinity, duration: 4, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function OpenLoops({ topics }: { topics: number }) {
  const count = Math.min(10, Math.max(2, topics));

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(count)].map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <motion.circle
            key={i} cx={30 + col * 30} cy={30 + row * 24} r="8"
            fill="none" stroke="#7F8EA5" strokeWidth="2"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 4, delay: i * 0.2 }}
          />
        );
      })}
    </svg>
  );
}

function CognitiveThreads({ load }: { load: number }) {
  const lines = load > 85 ? 6 : load > 65 ? 5 : load > 40 ? 4 : 2;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(lines)].map((_, i) => (
        <motion.path
          key={i}
          d={`M15 ${25 + i * 15} C40 ${20 + i * 15} 80 ${30 + i * 15} 105 ${25 + i * 15}`}
          fill="none" stroke="#8290A6" strokeWidth="3" strokeLinecap="round"
          animate={{ x: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 4, delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

function LoadContainers({ load }: { load: number }) {
  const boxes = load > 80 ? 6 : load > 60 ? 5 : load > 40 ? 4 : 2;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(boxes)].map((_, i) => {
        const row = i < 1 ? 0 : i < 3 ? 1 : 2;
        const col = row === 0 ? 0 : row === 1 ? i - 1 : i - 3;
        return (
          <motion.rect
            key={i}
            x={48 + col * 22} y={24 + row * 24}
            width="16" height="16" rx="5" fill="#A5B1C1"
            animate={{ y: [24 + row * 24, 21 + row * 24, 24 + row * 24] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
          />
        );
      })}
    </svg>
  );
}

function AttentionDistribution({ topics }: { topics: number }) {
  const points = Math.min(10, Math.max(4, topics));

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="12" fill="#718199" />
      {[...Array(points)].map((_, i) => {
        const angle = (i / points) * Math.PI * 2;
        const radius = 38;
        const x = 60 + Math.cos(angle) * radius;
        const y = 60 + Math.sin(angle) * radius;
        return (
          <g key={i}>
            <line x1="60" y1="60" x2={x} y2={y} stroke="#C7D0DB" strokeWidth="1.5" />
            <motion.circle
              cx={x} cy={y} r="4" fill="#9EABB9"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
            />
          </g>
        );
      })}
    </svg>
  );
}
