import { motion } from "framer-motion";
import {
  Globe,
  Users,
  ChevronRight,
} from "lucide-react";

type CommunityBelongingCardProps = {
  visualType?:
    | "sharedCircle"
    | "gathering"
    | "communityWeave"
    | "belongingField"
    | "campfire";

  belongingScore?: number;
  participationScore?: number;

  insight?: string;
  badgeLabel?: string;

  onClick?: () => void;
};

export function CommunityBelongingCard({
  visualType = "sharedCircle",
  belongingScore = 82,
  participationScore = 67,
  insight = "Você parece manter uma boa conexão com comunidades, grupos e espaços que considera significativos.",
  badgeLabel = "forte pertencimento",
  onClick,
}: CommunityBelongingCardProps) {
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
        border-[#D8DEF0]
        bg-[#F8F9FD]
        shadow-[0_2px_20px_rgba(90,100,180,0.05)]
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#EAEFFD]">
            <Globe size={18} className="text-[#6673B8]" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#2C3150]">
              Comunidade e Pertencimento
            </h3>
            <ChevronRight size={16} className="text-[#9198B8]" />
          </div>

          <p className="mt-2 text-caption leading-relaxed text-[#717896]">
            Participação em grupos, espaços compartilhados e sensação de fazer parte.
          </p>

          <p className="mt-4 text-caption leading-relaxed text-[#4A506E]">
            {insight}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="rounded-full bg-[#EAEFFD] px-3 py-1.5">
              <span className="text-caption font-medium text-[#6673B8]">
                {badgeLabel}
              </span>
            </div>

            <div className="rounded-full bg-[#F2F4FB] px-3 py-1.5 text-caption text-[#707796]">
              {belongingScore}% pertencimento
            </div>

            <div className="rounded-full bg-[#F2F4FB] px-3 py-1.5 text-caption text-[#707796]">
              {participationScore}% participação
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center self-center">
          <CommunityVisual type={visualType} belonging={belongingScore} participation={participationScore} />
        </div>
      </div>
    </motion.button>
  );
}

function CommunityVisual({
  type,
  belonging,
  participation,
}: {
  type: CommunityBelongingCardProps["visualType"];
  belonging: number;
  participation: number;
}) {
  switch (type) {
    case "gathering":
      return <Gathering belonging={belonging} />;
    case "communityWeave":
      return <CommunityWeave participation={participation} />;
    case "belongingField":
      return <BelongingField belonging={belonging} />;
    case "campfire":
      return <Campfire participation={participation} />;
    default:
      return <SharedCircle belonging={belonging} />;
  }
}

function SharedCircle({ belonging }: { belonging: number }) {
  const totalNodes = 12;
  const visibleNodes = Math.max(4, Math.round((belonging / 100) * totalNodes));

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(totalNodes)].map((_, i) => {
        const angle = (i / totalNodes) * Math.PI * 2;
        const x = 60 + Math.cos(angle) * 35;
        const y = 60 + Math.sin(angle) * 35;
        const active = i < visibleNodes;
        return (
          <motion.circle
            key={i} cx={x} cy={y} r="4.5"
            fill={active ? "#6A77BC" : "#D7DCF0"}
            animate={active ? { scale: [1, 1.15, 1] } : undefined}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
          />
        );
      })}
    </svg>
  );
}

function Gathering({ belonging }: { belonging: number }) {
  const radius = belonging > 70 ? 28 : belonging > 40 ? 36 : 46;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.circle
        cx="60" cy="60" r="10" fill="#6673B8"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + Math.cos(rad) * radius;
        const y = 60 + Math.sin(rad) * radius;
        return (
          <motion.circle
            key={i} cx={x} cy={y} r="5" fill="#AAB4E5"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
          />
        );
      })}
    </svg>
  );
}

function CommunityWeave({ participation }: { participation: number }) {
  const complexity = participation > 75 ? 8 : participation > 40 ? 6 : 4;
  const points: [number, number][] = [[25, 25], [60, 20], [95, 30], [25, 60], [60, 60], [95, 65], [30, 95], [85, 95]];

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(complexity)].map((_, i) => (
        <line key={i} x1={points[i][0]} y1={points[i][1]} x2={points[(i + 1) % points.length][0]} y2={points[(i + 1) % points.length][1]} stroke="#BFC7EA" strokeWidth="2" />
      ))}
      {points.slice(0, complexity).map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="4" fill="#6673B8"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function BelongingField({ belonging }: { belonging: number }) {
  const spread = belonging > 70 ? 18 : belonging > 40 ? 28 : 40;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {[...Array(12)].map((_, i) => {
        const x = 60 + Math.cos(i) * spread;
        const y = 60 + Math.sin(i * 2) * spread;
        return (
          <motion.circle
            key={i} cx={x} cy={y} r="4" fill="#7D88C6"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 4, delay: i * 0.1 }}
          />
        );
      })}
    </svg>
  );
}

function Campfire({ participation }: { participation: number }) {
  const active = participation > 70 ? 6 : 4;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <motion.path
        d="M60 45 C70 58 68 72 60 80 C52 72 50 58 60 45"
        fill="#6673B8"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
      {[...Array(active)].map((_, i) => {
        const angle = (i / active) * Math.PI * 2;
        const x = 60 + Math.cos(angle) * 32;
        const y = 65 + Math.sin(angle) * 32;
        return (
          <motion.circle
            key={i} cx={x} cy={y} r="4.5" fill="#AEB7E6"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
          />
        );
      })}
    </svg>
  );
}
