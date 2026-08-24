import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { value: '100', suffix: 'M+', label: 'Views Driven' },
  { value: '200', suffix: '+', label: 'Channels Served' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

interface StatItemProps {
  stat: Stat;
  index: number;
  shouldAnimate: boolean;
}

function StatItem({ stat, index, shouldAnimate }: StatItemProps) {
  const numericTarget = parseInt(stat.value, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="flex flex-col items-center text-center px-6 py-2 relative"
    >
      {/* Divider between items (not before first) */}
      {index > 0 && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-px bg-white/10" />
      )}

      <div className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-none tracking-tight">
        {shouldAnimate ? (
          <AnimatedCounter target={numericTarget} suffix={stat.suffix || ''} />
        ) : (
          <span>{stat.value}{stat.suffix}</span>
        )}
      </div>
      <div className="mt-1.5 text-[11px] sm:text-xs font-sans font-medium text-zinc-400 uppercase tracking-wider">
        {stat.label}
      </div>
    </motion.div>
  );
}

export const StatsBar: React.FC = () => {
  const { theme } = useSiteData();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div
      ref={ref}
      className="w-full bg-zinc-950 border-t border-b border-zinc-800 py-6 sm:py-8 relative"
    >
      {/* Subtle dynamic ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 100% at 50% 50%, ${theme.glowColor} 0%, transparent 70%)`,
          opacity: 0.25,
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 sm:px-8 grid grid-cols-2 gap-y-0">
        {STATS.map((stat, idx) => (
          <StatItem key={stat.label} stat={stat} index={idx} shouldAnimate={isInView} />
        ))}
      </div>
    </div>
  );
};
