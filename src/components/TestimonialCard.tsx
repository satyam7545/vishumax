import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { type TestimonialItemData } from '../types/siteData';
import { useSiteData } from '../context/SiteDataContext';

interface TestimonialCardProps {
  item: TestimonialItemData;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ item }) => {
  const { theme } = useSiteData();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Testimonial from ${item.name}. Click to flip.`}
      className="perspective-1500 w-full min-h-[300px] sm:min-h-[320px] select-none cursor-pointer flex flex-col focus:outline-none"
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(!isFlipped); }
      }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full h-full relative transform-style-3d rounded-2xl flex-1"
      >
        {/* ── FRONT FACE ── */}
        <div className="w-full h-full rounded-2xl bg-[#0c0c10] text-zinc-100 p-7 sm:p-8 flex flex-col justify-between border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300 overflow-hidden">
          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-5">
            {[...Array(item.rating || 5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Quote */}
          <p className="font-sans text-sm sm:text-[15px] leading-[1.75] text-zinc-200 font-normal flex-1">
            "{item.quote}"
          </p>

          {/* Divider */}
          <div className="my-6 h-px bg-white/[0.06]" />

          {/* Creator row */}
          <div className="flex items-center gap-3.5">
            <img
              src={item.avatar}
              alt={item.name}
              className="w-11 h-11 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-sans font-semibold text-sm text-white leading-tight truncate">
                {item.name}
              </h4>
              <p className="text-[12px] text-zinc-500 font-sans truncate mt-0.5">
                {item.role}{item.company ? ` · ${item.company}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-[#0a0a0e] text-zinc-100 p-7 sm:p-8 flex flex-col gap-4 border border-white/[0.08] overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3">
            <img
              src={item.avatar}
              alt={item.name}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div>
              <h4 className="font-sans font-semibold text-sm text-white leading-tight">{item.name}</h4>
              <p className="text-[11px] text-zinc-500 font-sans mt-0.5">{item.channel}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06]" />

          {/* Bio */}
          <p className="text-[13px] text-zinc-300 leading-[1.7] font-sans flex-1 line-clamp-5">
            {item.detailedBio}
          </p>

          {/* Stats */}
          {item.stats && (
            <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center">
              {item.stats.map((st, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span
                    className="text-sm font-bold font-sans"
                    style={{ color: theme.primary }}
                  >
                    {st.value}
                  </span>
                  <span className="text-[10px] font-sans text-zinc-500 uppercase tracking-wide">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
