import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';

type Experience = {
  id: string;
  intensity: number;
  memorability: number;
  novelty: number;
  social?: boolean;
};

type ExperiencesCardProps = {
  title?: string;
  subtitle?: string;
  insight?: string;
  badgeLabel?: string;
  status?: 'positive' | 'stable' | 'attention' | 'critical' | 'neutral';
  visualType?:
    | 'memoryConstellation'
    | 'noveltyOrbit'
    | 'experienceTrail'
    | 'energySparks'
    | 'routineBreaks'
    | 'memoryDots';
  trend?: 'up' | 'down' | 'neutral' | 'mixed';
  memorableCount?: number;
  energyCount?: number;
  noveltyScore?: number;
  socialPresence?: number;
  experiences?: Experience[];
  variation?: number[];
  onClick?: () => void;
};

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

const MemoryConstellationVisualization: React.FC<{ experiences: Experience[]; trend: string }> = ({ experiences, trend }) => {
  const points = experiences.map((exp, i) => {
    const angle = (i / experiences.length) * Math.PI * 2;
    const radius = 25 + exp.novelty * 2;
    const x = 60 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    const size = 2 + exp.memorability * 0.6;
    return { x, y, size, opacity: 0.3 + exp.intensity * 0.07, exp, index: i };
  });

  const mostMemorable = points.reduce((max, p) => p.exp.memorability > max.exp.memorability ? p : max, points[0]);

  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#C7A96B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C7A96B" stopOpacity="0" />
        </radialGradient>
      </defs>
      {points.map((p1, i) =>
        points.slice(i + 1).map((p2, j) => {
          const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
          if (distance < 35) {
            return (
              <motion.line
                key={`line-${i}-${j}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#9CB6BA"
                strokeWidth="0.5"
                opacity="0.25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
              />
            );
          }
          return null;
        })
      )}
      {points.map((p, i) => (
        <motion.circle
          key={`point-${i}`}
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill={p.exp.social ? '#6F8F98' : '#9CB6BA'}
          opacity={p.opacity}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: p.opacity }}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
        />
      ))}
      {mostMemorable && (
        <>
          <motion.circle
            cx={mostMemorable.x}
            cy={mostMemorable.y}
            r={mostMemorable.size + 4}
            fill="url(#glow)"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <motion.circle
            cx={mostMemorable.x}
            cy={mostMemorable.y}
            r={mostMemorable.size + 1}
            fill="#C7A96B"
            opacity="0.4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          />
        </>
      )}
    </svg>
  );
};

const NoveltyOrbitVisualization: React.FC<{ experiences: Experience[]; trend: string }> = ({ experiences, trend }) => {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      <defs>
        <radialGradient id="center-glow">
          <stop offset="0%" stopColor="#6F8F98" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6F8F98" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="50" r="3" fill="#6F8F98" opacity="0.5" />
      <circle cx="60" cy="50" r="12" fill="url(#center-glow)" />
      {[15, 25, 35].map((r, i) => (
        <motion.circle
          key={`orbit-${i}`}
          cx="60"
          cy="50"
          r={r}
          fill="none"
          stroke="#9CB6BA"
          strokeWidth="0.5"
          opacity="0.15"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: i * 0.15 }}
        />
      ))}
      {experiences.map((exp, i) => {
        const angle = (i / experiences.length) * Math.PI * 2 + Math.PI / 4;
        const radius = 15 + exp.novelty * 2.5;
        const x = 60 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        return (
          <motion.circle
            key={`orbit-point-${i}`}
            cx={x}
            cy={y}
            r={1.5 + exp.intensity * 0.3}
            fill={exp.social ? '#6F8F98' : '#9CB6BA'}
            opacity={0.6 + exp.memorability * 0.04}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 + exp.memorability * 0.04 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
          />
        );
      })}
    </svg>
  );
};

const ExperienceTrailVisualization: React.FC<{ experiences: Experience[]; trend: string }> = ({ experiences, trend }) => {
  const pathPoints = experiences.map((exp, i) => {
    const x = 15 + (i / (experiences.length - 1)) * 90;
    const y = 50 + Math.sin(i * 0.8) * 15 - exp.intensity * 2;
    return { x, y, exp };
  });

  const pathD = pathPoints.reduce((path, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pathPoints[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${path} Q ${cpx} ${prev.y}, ${p.x} ${p.y}`;
  }, '');

  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      <motion.path
        d={pathD}
        fill="none"
        stroke="#9CB6BA"
        strokeWidth="1.5"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      {pathPoints.map((p, i) => (
        <motion.circle
          key={`trail-${i}`}
          cx={p.x}
          cy={p.y}
          r={1.5 + p.exp.memorability * 0.5}
          fill={p.exp.social ? '#6F8F98' : '#9CB6BA'}
          opacity={0.5 + p.exp.intensity * 0.05}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
        />
      ))}
    </svg>
  );
};

const EnergySparksVisualization: React.FC<{ experiences: Experience[]; trend: string }> = ({ experiences, trend }) => {
  const sparks = experiences.map((exp, i) => {
    const x = 20 + Math.random() * 80;
    const y = 20 + Math.random() * 60;
    const size = exp.intensity * 1.2;
    return { x, y, size, exp };
  });

  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {sparks.map((spark, i) => (
        <g key={`spark-${i}`}>
          <motion.path
            d={`M ${spark.x} ${spark.y - spark.size} L ${spark.x + spark.size * 0.3} ${spark.y - spark.size * 0.3} L ${spark.x + spark.size} ${spark.y} L ${spark.x + spark.size * 0.3} ${spark.y + spark.size * 0.3} L ${spark.x} ${spark.y + spark.size} L ${spark.x - spark.size * 0.3} ${spark.y + spark.size * 0.3} L ${spark.x - spark.size} ${spark.y} L ${spark.x - spark.size * 0.3} ${spark.y - spark.size * 0.3} Z`}
            fill={spark.exp.memorability > 7 ? '#C7A96B' : '#6F8F98'}
            opacity={0.3 + spark.exp.intensity * 0.05}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          />
          <motion.circle
            cx={spark.x}
            cy={spark.y}
            r={spark.size * 0.4}
            fill={spark.exp.memorability > 7 ? '#C7A96B' : '#9CB6BA'}
            opacity={0.6}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
          />
        </g>
      ))}
    </svg>
  );
};

const RoutineBreaksVisualization: React.FC<{ experiences: Experience[]; trend: string }> = ({ experiences, trend }) => {
  const routineBlocks = 8;
  const breaks = experiences.map((exp, i) => ({
    position: (i / experiences.length) * routineBlocks,
    height: 8 + exp.intensity * 2,
    exp,
  }));

  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {Array.from({ length: routineBlocks }).map((_, i) => (
        <rect
          key={`routine-${i}`}
          x={10 + i * 12}
          y="45"
          width="10"
          height="10"
          fill="#9CB6BA"
          opacity="0.12"
          rx="2"
        />
      ))}
      {breaks.map((brk, i) => (
        <motion.rect
          key={`break-${i}`}
          x={10 + Math.floor(brk.position) * 12}
          y={50 - brk.height / 2}
          width="10"
          height={brk.height}
          fill={brk.exp.memorability > 6 ? '#6F8F98' : '#9CB6BA'}
          opacity={0.5 + brk.exp.intensity * 0.05}
          rx="2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
        />
      ))}
    </svg>
  );
};

const MemoryDotsVisualization: React.FC<{ experiences: Experience[]; trend: string }> = ({ experiences, trend }) => {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {experiences.map((exp, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 30 + col * 25;
        const y = 30 + row * 20;
        const size = 2 + exp.memorability * 0.6;
        return (
          <motion.circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r={size}
            fill={exp.social ? '#6F8F98' : '#9CB6BA'}
            opacity={0.4 + exp.intensity * 0.05}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 + exp.intensity * 0.05 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        );
      })}
    </svg>
  );
};

const ExperiencesCard = forwardRef<HTMLButtonElement, ExperiencesCardProps>(
  (
    {
      title = 'Experiências',
      subtitle = 'Momentos vividos, memórias e acontecimentos fora da rotina.',
      insight = 'Novidade e presença social aparecem como os principais ingredientes das melhores experiências.',
      badgeLabel = 'mês mais vivo',
      status = 'positive',
      visualType = 'memoryConstellation',
      trend = 'mixed',
      experiences = [
        { id: '1', intensity: 5, memorability: 7, novelty: 6, social: true },
        { id: '2', intensity: 3, memorability: 4, novelty: 5, social: false },
        { id: '3', intensity: 8, memorability: 9, novelty: 8, social: true },
        { id: '4', intensity: 6, memorability: 6, novelty: 7, social: false },
        { id: '5', intensity: 7, memorability: 8, novelty: 9, social: true },
      ],
      onClick,
      ...props
    },
    ref,
  ) => {
    const renderVisualization = () => {
      const props = { experiences, trend };
      switch (visualType) {
        case 'noveltyOrbit':
          return <NoveltyOrbitVisualization {...props} />;
        case 'experienceTrail':
          return <ExperienceTrailVisualization {...props} />;
        case 'energySparks':
          return <EnergySparksVisualization {...props} />;
        case 'routineBreaks':
          return <RoutineBreaksVisualization {...props} />;
        case 'memoryDots':
          return <MemoryDotsVisualization {...props} />;
        default:
          return <MemoryConstellationVisualization {...props} />;
      }
    };

    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        className={cn(
          'w-full max-w-[430px] min-h-[240px] rounded-[32px] p-6 border text-left',
          'bg-gradient-to-br from-[#FAF8F4] to-[#F3F7F6]',
          'border-[rgba(103,130,137,0.18)]',
          'shadow-sm hover:shadow-md transition-all duration-300',
          'active:scale-[0.97]',
          'flex flex-col justify-between relative',
        )}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-[#DCE9E8] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#6F8F98]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-semibold text-[#2F2D2C] mb-1 leading-tight">
                {title}
              </h3>
              <p className="text-[13px] text-[#8A8B86] leading-snug">
                {subtitle}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#9CB6BA] opacity-40 flex-shrink-0 ml-2" />
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-[#5F615E] leading-relaxed mb-4">
              {insight}
            </p>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(111,143,152,0.08)] border border-[rgba(111,143,152,0.18)]">
              <span className="text-[13px] font-medium text-[#6F8F98]">
                {badgeLabel}
              </span>
            </div>
          </div>

          <div className="w-[110px] h-[110px] flex-shrink-0">
            {renderVisualization()}
          </div>
        </div>
      </motion.button>
    );
  },
);

ExperiencesCard.displayName = 'ExperiencesCard';

export { ExperiencesCard };
export default ExperiencesCard;
