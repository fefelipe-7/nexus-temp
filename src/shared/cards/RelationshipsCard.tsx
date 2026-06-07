import { motion } from "framer-motion";
import {
  Users,
  HeartHandshake,
  ChevronRight,
} from "lucide-react";

type RelationshipsCardProps = {
  visualType?:
    | "supportCircle"
    | "connectionConstellation"
    | "warmLinks"
    | "relationshipGarden"
    | "presenceField";

  relationshipCount?: number;
  activeConnections?: number;
  supportAvailable?: boolean;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function RelationshipsCard({
  visualType = "supportCircle",
  relationshipCount = 12,
  activeConnections = 5,
  supportAvailable = true,
  insight = "Você parece contar com pessoas próximas para compartilhar experiências, buscar ajuda e atravessar desafios.",
  badgeLabel,
  onClick,
}: RelationshipsCardProps) {
  const Icon = supportAvailable ? HeartHandshake : Users;

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
        border-[#D7E8E6]
        bg-[#F7FBFB]
        shadow-[0_2px_20px_rgba(70,120,120,0.05)]
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F4F2]">
            <Icon size={18} className="text-[#5A817C]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#253836]">
              Relacionamentos
            </h3>
            <ChevronRight size={16} className="text-[#89A6A1]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#6B807D]">
            Vínculos significativos, conexões sociais e rede de apoio disponível.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#425754]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#E8F4F2] px-3 py-1.5">
              <span className="text-caption font-medium text-[#5A7C77]">
                {badgeLabel || (supportAvailable ? "apoio disponível" : "apoio limitado")}
              </span>
            </div>

            <div className="rounded-full bg-[#F0F8F7] px-3 py-1.5 text-caption text-[#6A807D]">
              {relationshipCount} vínculos
            </div>

            <div className="rounded-full bg-[#F0F8F7] px-3 py-1.5 text-caption text-[#6A807D]">
              {activeConnections} conexões ativas
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <RelationshipsVisual type={visualType} relationshipCount={relationshipCount} supportAvailable={supportAvailable} />
        </div>
      </div>
    </motion.button>
  );
}

function RelationshipsVisual({
  type,
  relationshipCount,
  supportAvailable,
}: {
  type: RelationshipsCardProps["visualType"];
  relationshipCount: number;
  supportAvailable: boolean;
}) {
  switch (type) {
    case "connectionConstellation":
      return <ConnectionConstellation count={relationshipCount} />;
    case "warmLinks":
      return <WarmLinks count={relationshipCount} />;
    case "relationshipGarden":
      return <RelationshipGarden count={relationshipCount} />;
    case "presenceField":
      return <PresenceField count={relationshipCount} />;
    default:
      return <SupportCircle count={relationshipCount} supportAvailable={supportAvailable} />;
  }
}

function SupportCircle({ count, supportAvailable }: { count: number; supportAvailable: boolean }) {
  const nodes = Math.min(Math.max(Math.round(count / 2), 3), 8);
  const radius = supportAvailable ? 30 : 42;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.circle
        cx="60" cy="60" r="12"
        fill="#5F837D"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
      {[...Array(nodes)].map((_, i) => {
        const angle = (i / nodes) * Math.PI * 2;
        const x = 60 + Math.cos(angle) * radius;
        const y = 60 + Math.sin(angle) * radius;
        return (
          <g key={i}>
            <line x1="60" y1="60" x2={x} y2={y} stroke="#D0E5E2" strokeWidth="1.5" />
            <motion.circle
              cx={x} cy={y} r="5"
              fill="#89B3AC"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function ConnectionConstellation({ count }: { count: number }) {
  const nodes = Math.min(Math.max(Math.round(count / 2), 4), 8);
  const positions = [[25, 35], [90, 25], [95, 75], [65, 95], [25, 85], [50, 55], [80, 55], [35, 60]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(nodes - 1)].map((_, i) => (
        <line key={i} x1={positions[i][0]} y1={positions[i][1]} x2={positions[i + 1][0]} y2={positions[i + 1][1]} stroke="#CFE1DF" strokeWidth="1.5" />
      ))}
      {positions.slice(0, nodes).map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="5" fill="#6E9892"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

function WarmLinks({ count }: { count: number }) {
  const links = Math.min(Math.max(Math.round(count / 2), 3), 6);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(links)].map((_, i) => (
        <motion.path
          key={i}
          d={`M20 ${30 + i * 14} C45 ${15 + i * 14} 75 ${45 + i * 14} 100 ${30 + i * 14}`}
          fill="none" stroke="#83AAA4" strokeWidth="3" strokeLinecap="round"
          animate={{ x: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 4, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function RelationshipGarden({ count }: { count: number }) {
  const flowers = Math.min(Math.max(Math.round(count / 2), 3), 7);

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
            <circle cx={x} cy={y} r="4" fill="#6E9892" />
            <circle cx={x - 6} cy={y} r="3" fill="#A7CBC6" />
            <circle cx={x + 6} cy={y} r="3" fill="#A7CBC6" />
            <circle cx={x} cy={y - 6} r="3" fill="#A7CBC6" />
            <circle cx={x} cy={y + 6} r="3" fill="#A7CBC6" />
          </motion.g>
        );
      })}
    </svg>
  );
}

function PresenceField({ count }: { count: number }) {
  const dots = Math.min(Math.max(Math.round(count / 2), 5), 12);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(dots)].map((_, i) => {
        const x = 20 + ((i * 37) % 80);
        const y = 20 + ((i * 23) % 80);
        return (
          <motion.circle
            key={i} cx={x} cy={y} r={i % 3 === 0 ? 5 : 3} fill="#7CA6A0"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 4, delay: i * 0.2 }}
          />
        );
      })}
    </svg>
  );
}
