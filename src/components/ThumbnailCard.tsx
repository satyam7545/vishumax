import React from 'react';
import { motion } from 'framer-motion';
import { type ThumbnailItemData } from '../types/siteData';
import { useSiteData } from '../context/SiteDataContext';

interface ThumbnailCardProps {
  item: ThumbnailItemData;
  onSelect: (item: ThumbnailItemData) => void;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

export const ThumbnailCard: React.FC<ThumbnailCardProps> = ({
  item,
  onSelect,
  onHoverStart,
  onHoverEnd,
}) => {
  const { theme } = useSiteData();
  const renderCustomGraphic = () => {
    switch (item.graphicType) {
      case 'constipation':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-amber-950 via-slate-900 to-cyan-950 flex items-center justify-between p-6 select-none">
            <div className="flex-1 flex flex-col justify-between h-full z-10">
              <div className="inline-block px-2.5 py-1 rounded bg-red-600 text-white font-bold text-xs tracking-wider uppercase w-fit">
                RAPID RELIEF
              </div>
              <div>
                <h4 className="font-sans font-bold text-white text-base sm:text-lg leading-tight uppercase">
                  CURE <span className="text-cyan-300">CONSTIPATION</span>
                </h4>
                <p className="text-amber-400 font-bold text-xs sm:text-sm">IN 2 MINUTES ⏱️</p>
              </div>
            </div>
          </div>
        );

      case 'educator':
        return (
          <div className="relative w-full h-full bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 flex items-center justify-between p-6 select-none">
            <div className="flex-1 flex flex-col justify-between h-full z-10">
              <div className="inline-block px-2.5 py-1 rounded bg-yellow-400 text-black font-bold text-xs uppercase w-fit">
                ★ AIR 1 RANK
              </div>
              <div>
                <h4 className="font-sans font-bold text-white text-base sm:text-lg leading-tight">
                  AIR 1 Turned Educator
                </h4>
                <p className="text-yellow-400 font-bold text-xs sm:text-sm">Now Makes Crores 💰</p>
              </div>
            </div>
          </div>
        );

      case 'indianoil':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-zinc-900 to-amber-950 flex items-center justify-between p-6 select-none">
            <div className="flex-1 flex flex-col justify-between h-full z-10">
              <div className="inline-block px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-xs uppercase w-fit">
                IndianOil
              </div>
              <div>
                <h4 className="font-sans font-bold text-white text-base sm:text-lg leading-tight">
                  Inside 2nd Largest
                </h4>
                <p className="text-amber-400 font-bold text-xs sm:text-sm">Company of India 🏭</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      onClick={() => onSelect(item)}
      onMouseEnter={() => onHoverStart?.('INSPECT')}
      onMouseLeave={onHoverEnd}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-black border border-white/10 hover:border-white/30 transition-all duration-300 aspect-video flex flex-col shadow-2xl"
    >
      {/* Pure Thumbnail Media Container */}
      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
          />
        ) : (
          renderCustomGraphic()
        )}
      </div>

      {/* Hover Overlay — slides up on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 sm:p-5">
        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
          <p
            className="text-[10px] font-mono uppercase tracking-widest mb-1 font-semibold"
            style={{ color: theme.primary }}
          >
            Thumbnail Design
          </p>
          <h4 className="font-sans font-bold text-white text-sm sm:text-base leading-snug line-clamp-2 mb-2.5">
            {item.title}
          </h4>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-200 bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span>View Case</span>
            <span style={{ color: theme.primary }}>→</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
