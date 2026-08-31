import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface HeroSectionProps {
  onOpenBooking: () => void;
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
}) => {
  const { siteData, theme } = useSiteData();

  // Parse and animate the views stat
  const { prefix, num, suffix } = parseLeadingNumber(siteData.hero.viewsStat || '');
  const count = useCounter(num);

  return (
    <section className="relative w-full pt-28 sm:pt-32 pb-4 sm:pb-6 flex flex-col items-center justify-center text-center bg-transparent">
      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 flex flex-col items-center w-full">
        {/* Proof Lives in Our Work Marquee (Only rendered when clients exist) */}
        {siteData.proofLogos && siteData.proofLogos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5 sm:mb-6 flex flex-col items-center gap-2.5 w-full"
          >
            <div
              className="relative w-full max-w-4xl overflow-hidden py-1"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              }}
            >
              <div className="flex w-max animate-marquee items-center">
                {/* Track A */}
                <div className="flex shrink-0 items-center gap-3 pr-3">
                  {[...siteData.proofLogos, ...siteData.proofLogos].map((brand, idx) => (
                    <div
                      key={`p-a-${brand.id}-${idx}`}
                      className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/60 border border-white/15 text-left select-none shrink-0 backdrop-blur-md shadow-xs hover:border-white/30 transition-colors"
                    >
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full object-cover border border-white/20 shrink-0 block"
                        />
                      ) : (
                        <span
                          className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full border flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0 leading-none"
                          style={{ background: theme.badgeBg, borderColor: theme.badgeBorder, color: theme.primary }}
                        >
                          {brand.name.charAt(0)}
                        </span>
                      )}
                      <span className="font-sans font-bold text-xs sm:text-[13px] text-white uppercase tracking-wider leading-none flex items-center">
                        {brand.name}
                      </span>
                      {brand.badge && (
                        <span
                          className="text-[10px] sm:text-[11px] font-mono font-bold leading-none flex items-center"
                          style={{ color: theme.primary }}
                        >
                          {brand.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Track B (Exact Duplicate for Seamless Loop) */}
                <div className="flex shrink-0 items-center gap-3 pr-3" aria-hidden="true">
                  {[...siteData.proofLogos, ...siteData.proofLogos].map((brand, idx) => (
                    <div
                      key={`p-b-${brand.id}-${idx}`}
                      className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/60 border border-white/15 text-left select-none shrink-0 backdrop-blur-md shadow-xs hover:border-white/30 transition-colors"
                    >
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full object-cover border border-white/20 shrink-0 block"
                        />
                      ) : (
                        <span
                          className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full border flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0 leading-none"
                          style={{ background: theme.badgeBg, borderColor: theme.badgeBorder, color: theme.primary }}
                        >
                          {brand.name.charAt(0)}
                        </span>
                      )}
                      <span className="font-sans font-bold text-xs sm:text-[13px] text-white uppercase tracking-wider leading-none flex items-center">
                        {brand.name}
                      </span>
                      {brand.badge && (
                        <span
                          className="text-[10px] sm:text-[11px] font-mono font-bold leading-none flex items-center"
                          style={{ color: theme.primary }}
                        >
                          {brand.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Headline & Attribution Container */}
        <div className="w-full max-w-5xl flex flex-col items-center">
          {/* Main Top Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-sans font-normal text-[2.55rem] xs:text-[2.85rem] sm:text-4xl md:text-[3.35rem] lg:text-[3.75rem] xl:text-[4.15rem] text-white tracking-tight leading-[1.08] sm:leading-[1.08] text-center drop-shadow-[0_6px_32px_rgba(0,0,0,0.95)] w-full max-w-5xl px-2"
          >
            {/* Phone View (< sm): Split "We make you believe" & "in Power of packaging." */}
            <span className="sm:hidden">
              <span className="block">
                {(siteData.hero.headlinePrefix || 'We make you believe in').trim().toLowerCase().endsWith(' in')
                  ? (siteData.hero.headlinePrefix || 'We make you believe in').trim().slice(0, -3).trim()
                  : (siteData.hero.headlinePrefix || 'We make you believe')}
              </span>
              <span className="block mt-1">
                {(siteData.hero.headlinePrefix || 'We make you believe in').trim().toLowerCase().endsWith(' in') && (
                  <span className="font-sans font-normal">in </span>
                )}
                <span className="font-serif italic font-normal text-zinc-100">
                  {siteData.hero.headlineAccent || 'Power of packaging.'}
                </span>
              </span>
            </span>

            {/* Desktop View (>= sm): Original layout & typography */}
            <span className="hidden sm:inline">
              {(siteData.hero.headlinePrefix || 'We make you believe in')}{' '}
              <br />
              <span className="font-serif italic font-normal text-zinc-100">
                {siteData.hero.headlineAccent || 'Power of packaging.'}
              </span>
            </span>
          </motion.h1>

          {/* Duplicated Quote & Mr Beast Attribution on the Same Line */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="w-full flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-2.5 sm:mt-4 text-center px-4"
          >
            <span className="text-[9.5px] xs:text-[10px] sm:text-xs font-sans font-normal text-zinc-400/80 sm:text-zinc-400 leading-normal">
              {siteData.hero.attributionQuote || "“If people don't click, so you want to give them something to click.”"}
            </span>
            <span className="text-[9.5px] xs:text-[10px] sm:text-xs font-sans font-normal sm:font-bold text-zinc-400 sm:text-white tracking-wide whitespace-nowrap">
              {siteData.hero.attributionPrefix || '—'} {siteData.hero.attributionAuthor || 'Mr Beast*'}
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

        {/* CTA Button with Animated Glowing Border Effect & Subtle Dark Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 sm:mt-7"
        >
          <div className="relative p-[1.5px] rounded-full overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_35px_rgba(0,0,0,0.7)] inline-flex items-center justify-center">
            {/* Spinning Conic Border Beam */}
            <span
              className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] pointer-events-none"
              style={{
                background: `conic-gradient(from 0deg, transparent 0 240deg, ${theme.secondary} 300deg, #ffffff 360deg)`,
              }}
            />

            {/* Inner Subtle Gradient CTA Button */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="relative z-10 overflow-hidden px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-sans font-semibold text-xs sm:text-sm tracking-normal flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-b from-zinc-800/90 via-zinc-900/95 to-zinc-950 hover:from-zinc-750 hover:via-zinc-850 hover:to-zinc-900 text-white border border-white/20 hover:border-white/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-200"
            >
              {/* Shimmer sweep on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 text-white font-medium">{siteData.hero.ctaText || 'Book a free discovery call'}</span>
            </button>
          </div>
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
