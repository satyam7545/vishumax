import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { type TestimonialItemData } from '../types/siteData';

interface TestimonialCardProps {
  item: TestimonialItemData;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ item }) => {
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
        <div
          className="w-full h-full rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 flex flex-col transition-all duration-300 overflow-hidden relative group hover:scale-[1.01] border border-white/40 text-left select-none"
          style={{
            background: 'linear-gradient(135deg, #a7f3d0 0%, #86efac 40%, #4ade80 85%, #22c55e 100%)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 0 35px rgba(74,222,128,0.25)',
          }}
        >
          {/* Subtle diagonal ambient light ray matching the screenshot */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(125deg, transparent 32%, rgba(255,255,255,0.28) 48%, rgba(255,255,255,0.12) 56%, transparent 68%)',
            }}
          />

          {/* TOP: Author Profile with Avatar, Name, and @Handle */}
          <div className="flex items-center gap-4 sm:gap-4.5 mb-5 sm:mb-6 relative z-10">
            <img
              src={item.avatar}
              alt={item.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0 shadow-md border border-black/10"
            />
            <div className="min-w-0">
              <h4 className="font-['Inter',sans-serif] font-semibold text-[21px] sm:text-[23.5px] text-zinc-950 tracking-tight leading-tight truncate">
                {item.name}
              </h4>
              <p className="font-['Inter',sans-serif] text-[13.5px] sm:text-[14.5px] text-emerald-950 font-normal mt-0.5 leading-none truncate">
                {item.channel?.startsWith('@') ? item.channel : `@${(item.channel || item.name).replace(/\s+/g, '')}`}
              </p>
            </div>
          </div>

          {/* Quote */}
          <p className="font-['Inter',sans-serif] text-[14px] sm:text-[15.5px] leading-[1.65] text-zinc-950 font-normal relative z-10 text-left flex-1">
            {item.quote ? item.quote.replace(/^["'“]|["'”]$/g, '').trim() : ''}
          </p>
        </div>

        {/* ── BACK FACE ── */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 flex flex-col overflow-hidden relative border border-white/40 text-left"
          style={{
            background: 'linear-gradient(135deg, #a7f3d0 0%, #86efac 40%, #4ade80 85%, #22c55e 100%)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 0 35px rgba(74,222,128,0.25)',
          }}
        >
          {/* TOP: Header */}
          <div className="flex items-center gap-4 sm:gap-4.5 mb-5 sm:mb-6 relative z-10">
            <img
              src={item.avatar}
              alt={item.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0 shadow-md border border-black/10"
            />
            <div className="min-w-0">
              <h4 className="font-['Inter',sans-serif] font-semibold text-[21px] sm:text-[23.5px] text-zinc-950 tracking-tight leading-tight truncate">
                {item.name}
              </h4>
              <p className="font-['Inter',sans-serif] text-[13.5px] sm:text-[14.5px] text-emerald-950 font-normal mt-0.5 leading-none truncate">
                {item.channel?.startsWith('@') ? item.channel : `@${(item.channel || item.name).replace(/\s+/g, '')}`}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="font-['Inter',sans-serif] text-[14px] sm:text-[15.5px] text-zinc-950 leading-[1.65] font-normal flex-1 relative z-10 overflow-y-auto">
            {item.detailedBio || item.quote}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
