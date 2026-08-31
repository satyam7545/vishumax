import React from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';

interface IndustryLeadersSectionProps {
  onOpenBooking: () => void;
}

export const IndustryLeadersSection: React.FC<IndustryLeadersSectionProps> = ({
  onOpenBooking,
}) => {
  const { siteData, theme } = useSiteData();
  if (!siteData.leaders || siteData.leaders.length === 0) {
    return null;
  }

  return (
    <section id="leaders" className="w-full relative py-4 space-y-8">
      {/* Header (Centered) */}
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight">
          Trusted by Industry <span className="font-serif italic font-normal text-zinc-300">Leaders</span>
        </h2>
        <div
          className="mt-5 h-px w-24 mx-auto"
          style={{ background: theme.gradientDivider }}
        />
      </div>

      {/* Dynamic Vertical Portrait Cards Grid (2-cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 place-items-stretch">
        {siteData.leaders.map((leader, idx) => (
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            onClick={onOpenBooking}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenBooking();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Leader card: ${leader.name}, ${leader.role}. Click to connect.`}
            whileHover={{ y: -6 }}
            className="group relative w-full mx-auto aspect-[3/4] max-h-[390px] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 shadow-[0_10px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.95)] transition-all duration-300 flex flex-col justify-end cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {/* Portrait Image */}
            <img
              src={leader.image}
              alt={leader.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Gradient Scrim — visible on mobile, reveals on hover on desktop */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] sm:h-[55%] bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 ease-out" />

            {/* Bottom Card Content — visible on mobile touchscreens, reveals on hover on desktop */}
            <div className="relative p-3 sm:p-5 z-10 flex flex-col justify-end translate-y-0 opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none">
              <h3 className="font-sans font-bold text-xs sm:text-base lg:text-lg text-white tracking-tight leading-tight">
                {leader.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-zinc-300 font-medium mt-0.5 leading-tight">
                {leader.role}
              </p>
              
              {leader.quote && (
                <p className="hidden sm:block text-[11px] font-sans text-zinc-300 italic line-clamp-2 leading-relaxed border-t border-white/10 pt-1.5 mt-2">
                  "{leader.quote}"
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
