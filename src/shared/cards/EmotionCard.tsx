import * as React from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';

type EmotionMoodCardProps = {
  title?: string;
  subtitle?: string;
  insight?: string;
  badgeLabel?: string;
  status?: 'positive' | 'stable' | 'attention' | 'critical' | 'neutral';
  visualType?: 'moodWave' | 'emotionBubbles' | 'stabilityBars' | 'moodBalance' | 'dailyVariation';
  trend?: 'up' | 'down' | 'neutral' | 'mixed';
  moodScore?: number;
  dominantEmotion?: string;
  variation?: number[];
  onClick?: () => void;
};

const emotionMoodTheme = {
  cardBg: '#FAF7F6',
  cardTintBg: '#F8F1F4',
  border: 'rgba(161, 116, 143, 0.18)',
  title: '#2F2D2C',
  subtitle: '#8D8584',
  body: '#5F5A59',
  accent: '#B77A9A',
  accentSoft: '#EAD5DF',
  accentMuted: '#C99AAF',
  badgeBg: 'rgba(183, 122, 154, 0.08)',
  badgeBorder: 'rgba(183, 122, 154, 0.18)',
};

const statusColors = {
  positive: { primary: '#B77A9A', secondary: '#C99AAF', gradient: '#EAD5DF' },
  stable: { primary: '#A890C4', secondary: '#BBA8D6', gradient: '#E0D5F0' },
  attention: { primary: '#D4A574', secondary: '#E0B88A', gradient: '#F5E4CE' },
  critical: { primary: '#C47D7D', secondary: '#D49999', gradient: '#F0D5D5' },
  neutral: { primary: '#9D97A0', secondary: '#B3ADB6', gradient: '#DDD9DE' },
};

const getDefaultVariation = (trend: string): number[] => {
  switch (trend) {
    case 'up':
      return [3, 4, 5, 6, 7, 8];
    case 'down':
      return [8, 7, 6, 5, 4, 3];
    case 'neutral':
      return [5, 5, 6, 5, 5, 6];
    case 'mixed':
      return [5, 7, 4, 6, 3, 5];
    default:
      return [4, 5, 5, 6, 5, 7, 6];
  }
};

const MoodWaveVisualization: React.FC<{ variation: number[]; status: EmotionMoodCardProps['status'] }> = ({ variation, status = 'stable' }) => {
  const colors = statusColors[status];
  const maxValue = Math.max(...variation);
  const normalizedData = variation.map(v => (v / maxValue) * 100);

  return (
    <svg width="100%" height="100%" viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`waveGradient-${status}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M 0 ${80 - normalizedData[0] * 0.6} ${normalizedData.map((val, i) => {
          const x = (i / (normalizedData.length - 1)) * 120;
          const y = 80 - val * 0.6;
          return `L ${x} ${y}`;
        }).join(' ')} L 120 80 L 0 80 Z`}
        fill={`url(#waveGradient-${status})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      <motion.path
        d={`M 0 ${80 - normalizedData[0] * 0.6} ${normalizedData.map((val, i) => {
          const x = (i / (normalizedData.length - 1)) * 120;
          const y = 80 - val * 0.6;
          return `L ${x} ${y}`;
        }).join(' ')}`}
        stroke={colors.primary}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
    </svg>
  );
};

const EmotionBubblesVisualization: React.FC<{ variation: number[]; status: EmotionMoodCardProps['status'] }> = ({ variation, status = 'stable' }) => {
  const colors = statusColors[status];
  const bubbles = variation.slice(0, 5).map((val, i) => ({
    size: (val / Math.max(...variation)) * 30 + 15,
    x: 20 + i * 20,
    y: 40 + (Math.sin(i) * 10),
  }));

  return (
    <svg width="100%" height="100%" viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">
      {bubbles.map((bubble, i) => (
        <motion.circle
          key={i}
          cx={bubble.x}
          cy={bubble.y}
          r={bubble.size}
          fill={colors.primary}
          opacity={0.3 + (i * 0.1)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 + (i * 0.1) }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: 'backOut' }}
        />
      ))}
    </svg>
  );
};

const StabilityBarsVisualization: React.FC<{ variation: number[]; status: EmotionMoodCardProps['status'] }> = ({ variation, status = 'stable' }) => {
  const colors = statusColors[status];
  const maxValue = Math.max(...variation);

  return (
    <svg width="100%" height="100%" viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">
      {variation.map((val, i) => {
        const height = (val / maxValue) * 60;
        const x = 10 + i * 16;
        const y = 70 - height;

        return (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width="10"
            height={height}
            rx="5"
            fill={colors.secondary}
            initial={{ height: 0, y: 70 }}
            animate={{ height, y }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
          />
        );
      })}
    </svg>
  );
};

const MoodBalanceVisualization: React.FC<{ status: EmotionMoodCardProps['status'] }> = ({ status = 'stable' }) => {
  const colors = statusColors[status];

  return (
    <svg width="100%" height="100%" viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">
      <motion.circle
        cx="40"
        cy="40"
        r="25"
        fill={colors.primary}
        opacity="0.3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
      />
      <motion.circle
        cx="60"
        cy="40"
        r="20"
        fill={colors.secondary}
        opacity="0.4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'backOut' }}
      />
      <motion.circle
        cx="80"
        cy="40"
        r="18"
        fill={colors.gradient}
        opacity="0.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'backOut' }}
      />
    </svg>
  );
};

const DailyVariationVisualization: React.FC<{ variation: number[]; status: EmotionMoodCardProps['status'] }> = ({ variation, status = 'stable' }) => {
  const colors = statusColors[status];
  const maxValue = Math.max(...variation);

  return (
    <svg width="100%" height="100%" viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet">
      {variation.map((val, i) => {
        const x = 10 + i * 16;
        const y = 40 - ((val / maxValue) * 20 - 10);

        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill={colors.primary}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: 'backOut' }}
          />
        );
      })}
      <motion.path
        d={`M ${10} ${40 - ((variation[0] / maxValue) * 20 - 10)} ${variation.map((val, i) => {
          const x = 10 + i * 16;
          const y = 40 - ((val / maxValue) * 20 - 10);
          return `L ${x} ${y}`;
        }).join(' ')}`}
        stroke={colors.primary}
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </svg>
  );
};

const EmotionMoodCard = React.forwardRef<HTMLButtonElement, EmotionMoodCardProps>(
  ({
    title = 'Emoções e Humor',
    subtitle = 'Estado emocional geral, emoções sentidas e variações do dia.',
    insight = 'Seu humor parece mais estável hoje, com emoções leves dominando a maior parte do dia.',
    badgeLabel = 'humor estável',
    status = 'stable',
    visualType = 'moodWave',
    trend = 'neutral',
    variation,
    onClick,
    ...props
  }, ref) => {
    const actualVariation = variation || getDefaultVariation(trend!);

    const renderVisualization = () => {
      switch (visualType) {
        case 'emotionBubbles':
          return <EmotionBubblesVisualization variation={actualVariation} status={status} />;
        case 'stabilityBars':
          return <StabilityBarsVisualization variation={actualVariation} status={status} />;
        case 'moodBalance':
          return <MoodBalanceVisualization status={status} />;
        case 'dailyVariation':
          return <DailyVariationVisualization variation={actualVariation} status={status} />;
        case 'moodWave':
        default:
          return <MoodWaveVisualization variation={actualVariation} status={status} />;
      }
    };

    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        className={cn(
          'w-full min-h-[240px]',
          'rounded-[32px] p-6',
          'border',
          'text-left',
          'transition-all duration-300',
          'hover:scale-[0.98] active:scale-[0.96]',
        )}
        style={{
          backgroundColor: emotionMoodTheme.cardTintBg,
          borderColor: emotionMoodTheme.border,
        }}
        whileHover={{ backgroundColor: '#F6EEF1' }}
        whileTap={{ scale: 0.97 }}
        {...props}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div
                className="p-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: emotionMoodTheme.accentSoft }}
              >
                <Heart
                  className="w-5 h-5"
                  style={{ color: emotionMoodTheme.accent }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-sm font-bold leading-tight mb-1"
                  style={{ color: emotionMoodTheme.title }}
                >
                  {title}
                </h3>
                <p
                  className="text-caption leading-relaxed"
                  style={{ color: emotionMoodTheme.subtitle }}
                >
                  {subtitle}
                </p>
              </div>
            </div>
            <ChevronRight
              className="w-5 h-5 flex-shrink-0 ml-2 mt-1"
              style={{ color: emotionMoodTheme.subtitle, opacity: 0.5 }}
            />
          </div>

          <div className="flex gap-4 flex-1 items-start">
            <div className="flex-1 flex flex-col justify-between min-h-[120px]">
                <p
                  className="text-caption leading-relaxed mb-4"
                  style={{ color: emotionMoodTheme.body }}
                >
                  {insight}
                </p>

              <div className="inline-flex self-start">
                <span
                  className="px-4 py-1.5 rounded-full text-caption font-medium border"
                  style={{
                    backgroundColor: emotionMoodTheme.badgeBg,
                    borderColor: emotionMoodTheme.badgeBorder,
                    color: emotionMoodTheme.accent,
                  }}
                >
                  {badgeLabel}
                </span>
              </div>
            </div>

            <div className="w-[110px] h-[110px] flex-shrink-0 flex items-center justify-center">
              {renderVisualization()}
            </div>
          </div>
        </div>
      </motion.button>
    );
  },
);

EmotionMoodCard.displayName = 'EmotionMoodCard';

export { EmotionMoodCard };
export default EmotionMoodCard;
