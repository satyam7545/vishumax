import React from 'react';
import { type ThumbnailItemData } from '../types/siteData';
import { ThumbnailCard } from './ThumbnailCard';
import { useSiteData } from '../context/SiteDataContext';

interface ThumbnailShowcaseProps {
  onSelectThumbnail: (item: ThumbnailItemData) => void;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

export const ThumbnailShowcase: React.FC<ThumbnailShowcaseProps> = ({
  onSelectThumbnail,
  onHoverStart,
  onHoverEnd,
}) => {
  const { siteData } = useSiteData();

  const thumbs = siteData.thumbnails || [];
  const half = Math.ceil(thumbs.length / 2);
  const row1Thumbs = thumbs.length > 0 ? thumbs : [];
  // Row 2 shifts items by half so they aren't identical to row 1 at the same x position
  const row2Thumbs =
    thumbs.length > 1
      ? [...thumbs.slice(half), ...thumbs.slice(0, half)]
      : thumbs;

  return (
    <section id="work" className="w-full relative select-none overflow-hidden pt-2 pb-16 sm:pb-24 bg-transparent">
      {/* Main Container */}
      <div className="relative z-10 w-full space-y-4 sm:space-y-5">
        {/* Row 1: Moving Left */}
        <div className="relative w-full overflow-hidden py-1">
          <div className="flex animate-marquee-slow whitespace-nowrap gap-5 sm:gap-6 items-center">
            {[...row1Thumbs, ...row1Thumbs, ...row1Thumbs, ...row1Thumbs].map((thumb, idx) => (
              <div
                key={`r1-${thumb.id}-${idx}`}
                className="w-[300px] sm:w-[420px] md:w-[460px] shrink-0"
              >
                <ThumbnailCard
                  item={thumb}
                  onSelect={onSelectThumbnail}
                  onHoverStart={onHoverStart}
                  onHoverEnd={onHoverEnd}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Moving Right (Opposite Direction) */}
        <div className="relative w-full overflow-hidden py-1">
          <div className="flex animate-marquee-reverse whitespace-nowrap gap-5 sm:gap-6 items-center">
            {[...row2Thumbs, ...row2Thumbs, ...row2Thumbs, ...row2Thumbs].map((thumb, idx) => (
              <div
                key={`r2-${thumb.id}-${idx}`}
                className="w-[300px] sm:w-[420px] md:w-[460px] shrink-0"
              >
                <ThumbnailCard
                  item={thumb}
                  onSelect={onSelectThumbnail}
                  onHoverStart={onHoverStart}
                  onHoverEnd={onHoverEnd}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
