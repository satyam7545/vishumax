import React from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';

interface IndustryLeadersSectionProps {
  onOpenBooking: () => void;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

export const IndustryLeadersSection: React.FC<IndustryLeadersSectionProps> = ({
  onOpenBooking,
  onHoverStart,
  onHoverEnd,
}) => {
  const { siteData, theme } = useSiteData();

  return (
    <section id="leaders" className="w-full relative py-4 space-y-6">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: theme.dotColor }} />
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Trusted by Industry <span className="font-serif italic font-normal text-zinc-300">Leaders</span>
          </h2>
        </div>
        <p className="text-sm text-zinc-400 ml-5 font-sans">Click any card to start the conversation.</p>
        <div
          className="mt-5 h-px w-full"
          style={{ background: theme.gradientDivider }}
        />
      </div>

      {/* Dynamic Vertical Portrait Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {siteData.leaders.map((leader, idx) => (
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            onMouseEnter={() => onHoverStart?.('LEADER')}
            onMouseLeave={onHoverEnd}
            onClick={onOpenBooking}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenBooking();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Leader card: ${leader.name}, ${leader.role}. Click to book call.`}
            whileHover={{ y: -6 }}
            className="group relative aspect-[3/4] max-h-[380px] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.9)] transition-all duration-300 flex flex-col justify-end cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {/* Portrait Image */}
            <img
              src={leader.image}
              alt={leader.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-500 ease-out"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

            {/* Bottom Card Content */}
            <div className="relative p-5 z-10 flex flex-col justify-end">
              <h3 className="font-sans font-bold text-base text-white tracking-tight">
                {leader.name}
              </h3>
              <p className="text-xs text-zinc-300 font-medium mt-0.5">
                {leader.role}
              </p>
              <p className="text-[11px] font-sans text-zinc-400 mt-0.5">
                {leader.channel}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
