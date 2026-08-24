import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface AboutRaviCardProps {
  onOpenBooking: () => void;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

export const AboutRaviCard: React.FC<AboutRaviCardProps> = ({
  onOpenBooking,
  onHoverStart,
  onHoverEnd,
}) => {
  const { siteData, theme } = useSiteData();

  return (
    <motion.div
      id="about"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-br from-[#111116] via-[#0c0c10] to-[#111116] border border-zinc-800/90 rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Bio & Description */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-xs font-sans font-semibold mb-3.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{siteData.about.badgeText}</span>
            </div>

            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {siteData.about.heading && siteData.about.heading !== 'About Ravi Franklin'
                ? siteData.about.heading
                : `About ${siteData.about.name || 'Vishal Gupta'}`}
            </h3>

            <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
              {siteData.about.bioParagraph1}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
              {siteData.about.bioParagraph2}
            </p>
          </div>

          {/* CTA Link */}
          <div className="pt-1">
            <button
              onClick={onOpenBooking}
              onMouseEnter={() => onHoverStart?.('TALK')}
              onMouseLeave={onHoverEnd}
              style={{
                background: theme.ctaButtonGradient,
                boxShadow: `0 4px 18px ${theme.glowColor}`,
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-sans font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md group ${theme.ctaTextColor}`}
            >
              <span>{siteData.about.ctaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right: Studio Portrait Photo */}
        <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[280px] aspect-[4/4.5] rounded-2xl overflow-hidden border-2 border-zinc-800/90 shadow-2xl group">
            <img
              src={siteData.about.portraitImage}
              alt={siteData.about.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-center">
              <span className="text-xs font-bold text-white block">
                {siteData.about.name}
              </span>
              <span
                className="text-[10px] font-semibold font-sans"
                style={{ color: theme.primary }}
              >
                {siteData.about.roleTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
