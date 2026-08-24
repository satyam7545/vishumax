import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, RotateCw } from 'lucide-react';
import { type TestimonialItemData } from '../types/siteData';
import { useSiteData } from '../context/SiteDataContext';

interface TestimonialCardProps {
  item: TestimonialItemData;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  item,
  onHoverStart,
  onHoverEnd,
}) => {
  const { theme } = useSiteData();
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasGlowed, setHasGlowed] = useState(false);

  useEffect(() => {
    // One-time border glow pulse fades out after 1.8s to hint at interactivity
    const timer = setTimeout(() => setHasGlowed(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Testimonial from ${item.name}. Press Enter or Space to flip card.`}
      style={{
        boxShadow: !hasGlowed ? `0 0 20px ${theme.glowColor}` : undefined,
        borderColor: !hasGlowed ? theme.primary : undefined,
      }}
      className={`perspective-1500 w-full min-h-[250px] sm:min-h-[270px] select-none cursor-pointer flex flex-col focus:outline-none rounded-3xl transition-all duration-700 group ${
        !hasGlowed ? 'ring-2 ring-emerald-500/40' : ''
      }`}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
      onMouseEnter={() => onHoverStart?.('FLIP')}
      onMouseLeave={onHoverEnd}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.55,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="w-full h-full relative transform-style-3d rounded-3xl flex-1"
      >
        {/* FRONT FACE (Sleek Modern Dark Card) */}
        <div className="w-full h-full rounded-3xl bg-[#0d0d12] text-zinc-100 p-6 sm:p-7 flex flex-col justify-between border border-zinc-800/80 shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:border-zinc-700 hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] transition-all duration-300 overflow-hidden">
          {/* Top: Stars & Quote */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <Quote className="w-5 h-5 text-zinc-700 -scale-x-100" />
            </div>

            <p className="font-sans text-xs sm:text-sm leading-relaxed text-zinc-200 font-medium">
              "{item.quote}"
            </p>
          </div>

          {/* Bottom: Creator Profile */}
          <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center gap-3">
            <img
              src={item.avatar}
              alt={item.name}
              className="w-10 h-10 rounded-full object-cover border border-zinc-700 shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-sans font-bold text-xs sm:text-sm text-white tracking-tight uppercase truncate">
                {item.name}
              </h4>
              <p className="text-[11px] text-zinc-400 font-sans truncate font-medium">
                {item.role} • {item.company}
              </p>
            </div>
          </div>

          {/* Persistent flip hint badge */}
          <div className="absolute bottom-4 right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] text-zinc-400 font-sans font-medium opacity-80 group-hover:opacity-100 group-hover:text-zinc-200 transition-all pointer-events-none shadow-2xs">
            <RotateCw className="w-2.5 h-2.5" style={{ color: theme.primary }} />
            <span>Tap to flip</span>
          </div>
        </div>

        {/* BACK FACE (Deep-Dive Dark Dossier) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-[#09090d] text-zinc-100 p-6 sm:p-7 flex flex-col justify-between border border-zinc-800 overflow-hidden shadow-2xl">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                />
                <div>
                  <h4 className="font-sans font-bold text-xs sm:text-sm text-white uppercase">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    {item.channel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px] text-zinc-400 font-mono">
                <RotateCw className="w-2.5 h-2.5" />
                <span>back</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed font-sans mb-3 line-clamp-4">
              {item.detailedBio}
            </p>
          </div>

          {/* Metrics */}
          {item.stats && (
            <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
              {item.stats.map((st, i) => (
                <div key={i}>
                  <div className="text-[9px] font-mono text-zinc-400 uppercase">{st.label}</div>
                  <div
                    className="text-xs sm:text-sm font-bold font-mono"
                    style={{ color: theme.primary }}
                  >
                    {st.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
