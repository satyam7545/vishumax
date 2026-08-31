import React from 'react';
import { ThumbnailCard } from './ThumbnailCard';
import { useSiteData } from '../context/SiteDataContext';

export const ThumbnailShowcase: React.FC = () => {
  const { siteData } = useSiteData();

  const thumbs = siteData.thumbnails || [];
  if (thumbs.length === 0) {
    return null;
  }
  const half = Math.ceil(thumbs.length / 2);
  const row1Thumbs = thumbs.length > 0 ? thumbs : [];
  // Row 2 shifts items by half so they aren't identical to row 1 at the same x position
  const row2Thumbs =
    thumbs.length > 1
      ? [...thumbs.slice(half), ...thumbs.slice(0, half)]
      : thumbs;

  return (
    <section className="w-full relative select-none overflow-hidden pt-2 pb-16 sm:pb-24 bg-transparent">
      {/* Left Edge Fade (Subtle) */}
      <div className="absolute top-0 bottom-0 left-0 w-6 sm:w-10 md:w-16 z-20 pointer-events-none bg-gradient-to-r from-black via-black/40 to-transparent" />

      {/* Right Edge Fade (Subtle) */}
      <div className="absolute top-0 bottom-0 right-0 w-6 sm:w-10 md:w-16 z-20 pointer-events-none bg-gradient-to-l from-black via-black/40 to-transparent" />

      {/* Main Container */}
      <div className="relative z-10 w-full space-y-4 sm:space-y-5">
        {/* Row 1: Moving Left (Continuous Smooth Loop) */}
        <div className="relative w-full overflow-hidden py-1">
          <div className="flex w-max animate-marquee-slow">
            {/* Track 1 */}
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3.5 pr-2.5 sm:pr-3.5">
              {[...row1Thumbs, ...row1Thumbs].map((thumb, idx) => (
                <div
                  key={`r1-a-${thumb.id}-${idx}`}
                  className="w-[280px] sm:w-[380px] md:w-[460px] shrink-0"
                >
                  <ThumbnailCard item={thumb} />
                </div>
              ))}
            </div>
            {/* Track 2 (Exact Duplicate for Seamless Infinite Loop) */}
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3.5 pr-2.5 sm:pr-3.5" aria-hidden="true">
              {[...row1Thumbs, ...row1Thumbs].map((thumb, idx) => (
                <div
                  key={`r1-b-${thumb.id}-${idx}`}
                  className="w-[280px] sm:w-[380px] md:w-[460px] shrink-0"
                >
                  <ThumbnailCard item={thumb} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Moving Right (Opposite Direction Continuous Smooth Loop) */}
        <div className="relative w-full overflow-hidden py-1">
          <div className="flex w-max animate-marquee-slow" style={{ animationDirection: 'reverse' }}>
            {/* Track 1 */}
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3.5 pr-2.5 sm:pr-3.5">
              {[...row2Thumbs, ...row2Thumbs].map((thumb, idx) => (
                <div
                  key={`r2-a-${thumb.id}-${idx}`}
                  className="w-[280px] sm:w-[380px] md:w-[460px] shrink-0"
                >
                  <ThumbnailCard item={thumb} />
                </div>
              ))}
            </div>
            {/* Track 2 (Exact Duplicate for Seamless Infinite Loop) */}
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3.5 pr-2.5 sm:pr-3.5" aria-hidden="true">
              {[...row2Thumbs, ...row2Thumbs].map((thumb, idx) => (
                <div
                  key={`r2-b-${thumb.id}-${idx}`}
                  className="w-[280px] sm:w-[380px] md:w-[460px] shrink-0"
                >
                  <ThumbnailCard item={thumb} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
