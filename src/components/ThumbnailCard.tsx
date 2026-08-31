import React from 'react';
import { type ThumbnailItemData } from '../types/siteData';

interface ThumbnailCardProps {
  item: ThumbnailItemData;
}

export const ThumbnailCard: React.FC<ThumbnailCardProps> = ({
  item,
}) => {
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
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex flex-col shadow-[0_14px_40px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.6)] select-none">
      {/* Pure Thumbnail Media Container */}
      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          renderCustomGraphic()
        )}
      </div>
    </div>
  );
};
