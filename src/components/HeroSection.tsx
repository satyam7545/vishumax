import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

/** Parses the leading number from a string like "100M+" or "250+" */
function parseLeadingNumber(str: string): { prefix: string; num: number; suffix: string } {
  const match = str.match(/^([^0-9]*)([0-9,]+)([^0-9]*)$/);
  if (!match) return { prefix: '', num: 0, suffix: str };
  return {
    prefix: match[1] || '',
    num: parseInt(match[2].replace(/,/g, ''), 10),
    suffix: match[3] || '',
  };
}

/** Animated counter hook — counts from 0 to target over `duration` ms */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
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
  }, [target, duration]);

  return count;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onHoverStart,
  onHoverEnd,
}) => {
  const { siteData, theme } = useSiteData();

  // Parse and animate the views stat
  const { prefix, num, suffix } = parseLeadingNumber(siteData.hero.viewsStat || '');
  const count = useCounter(num);

  return (
    <section className="relative w-full pt-24 sm:pt-28 pb-4 sm:pb-6 flex flex-col items-center justify-center text-center bg-transparent">
      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 flex flex-col items-center w-full">
        {/* Proof Lives in Our Work Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 sm:mb-6 flex flex-col items-center gap-2.5 w-full"
        >
          <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-widest text-zinc-400">
            Proof lives in our work
          </span>

          <div
            className="relative w-full max-w-3xl overflow-hidden py-0.5"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            }}
          >
            <div className="flex animate-marquee whitespace-nowrap gap-2.5 items-center">
              {[...siteData.proofLogos, ...siteData.proofLogos, ...siteData.proofLogos, ...siteData.proofLogos].map((brand, idx) => (
                <div
                  key={`${brand.id}-${idx}`}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/15 text-left select-none shrink-0 backdrop-blur-sm shadow-sm hover:border-white/30 transition-colors"
                >
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-4 h-4 rounded-full object-cover border border-white/20 shrink-0"
                    />
                  ) : (
                    <span
                      className="w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-bold shrink-0"
                      style={{ background: theme.badgeBg, borderColor: theme.badgeBorder, color: theme.primary }}
                    >
                      {brand.name.charAt(0)}
                    </span>
                  )}
                  <span className="font-sans font-semibold text-[11px] text-zinc-200 uppercase tracking-wider">
                    {brand.name}
                  </span>
                  {brand.badge && (
                    <span
                      className="text-[9px] font-mono font-semibold"
                      style={{ color: theme.primary }}
                    >
                      {brand.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quote and Right-Aligned Attribution Container */}
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-sans font-semibold text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] text-white tracking-tight leading-[1.25] sm:leading-[1.22] text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] w-full"
          >
            {(siteData.hero.headlinePrefix || "“If people don't click, so you want to give them")
              .replace(/they don't watch,\s*/gi, '')}{' '}
            <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-zinc-100">
              {siteData.hero.headlineAccent || 'something to click.”'}
            </span>
          </motion.h1>

          {/* Said by Attribution (right and below of quote) */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="w-full flex justify-end mt-2 sm:mt-2.5 pr-2 sm:pr-4"
          >
            <span className="text-xs sm:text-sm font-sans font-medium text-zinc-400">
              — <span className="text-white font-bold tracking-wide">Mr Beast*</span>
            </span>
          </motion.div>
        </div>

        {/* Animated Views Stat */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-3 text-xs sm:text-sm text-zinc-300 font-medium drop-shadow-md tabular-nums"
        >
          {num > 0 ? (
            <>
              {prefix}
              {count.toLocaleString()}
              {suffix}
            </>
          ) : (
            siteData.hero.viewsStat
          )}
        </motion.p>

        {/* CTA Button with shimmer effect */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 sm:mt-7"
        >
          <button
            onClick={onOpenBooking}
            onMouseEnter={() => onHoverStart?.('BOOK')}
            onMouseLeave={onHoverEnd}
            style={{
              background: theme.ctaButtonGradient,
              boxShadow: theme.ctaShadow,
            }}
            className={`relative overflow-hidden px-7 sm:px-9 py-3 sm:py-3.5 rounded-full font-sans font-bold text-xs sm:text-sm tracking-normal transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/20 group ${theme.ctaTextColor}`}
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <span className="relative">{siteData.hero.ctaText}</span>
          </button>
        </motion.div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 sm:mt-8 flex flex-col items-center gap-1 text-zinc-500"
        >
          <span className="text-[9px] font-mono uppercase tracking-widest">scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
