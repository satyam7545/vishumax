import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { value: '2', suffix: 'B+', label: 'Thumbnail Clicks' },
  { value: '14', suffix: 'k+', label: 'Reviews on Fiverr' },
  { value: '1280', suffix: '+', label: 'Happy Creators' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1800;
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

export const StatsBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="w-full bg-black pt-0 pb-12 sm:pb-16 relative overflow-hidden">
      {/* Single fading top line */}
      <div
        className="w-full h-px mb-10 sm:mb-14"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.15) 75%, transparent 100%)',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-2 sm:px-12 grid grid-cols-3 divide-x divide-white/[0.08]">
        {STATS.map((stat, idx) => {
          const numericTarget = parseInt(stat.value, 10);
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center px-1 sm:px-8 gap-1.5 sm:gap-2"
            >
              {/* Big number */}
              <span className="font-sans font-light text-2xl sm:text-4xl lg:text-[4.75rem] text-white/90 leading-none tracking-tight">
                {isInView ? (
                  <AnimatedCounter target={numericTarget} suffix={stat.suffix || ''} />
                ) : (
                  <span>{stat.value}{stat.suffix}</span>
                )}
              </span>

              {/* Label */}
              <span className="text-[10px] sm:text-xs font-sans font-normal text-zinc-400 sm:text-zinc-500 tracking-tight sm:tracking-wide">
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
