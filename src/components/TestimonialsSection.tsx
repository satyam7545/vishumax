import React from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { type TestimonialItemData } from '../types/siteData';

interface TestimonialsSectionProps {
  onOpenBooking: () => void;
}

// ── Individual card in the horizontal marquee ─────────────────────────────
function MarqueeTestimonialCard({ item }: { item: TestimonialItemData }) {
  const cleanQuote = item.quote ? item.quote.replace(/^["'""]|["'""]$/g, '').trim() : '';
  const channelHandle = item.channel
    ? (item.channel.startsWith('@') ? item.channel : `@${item.channel.replace(/\s+/g, '')}`)
    : `@${item.name.replace(/\s+/g, '')}`;

  return (
    <div
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col shrink-0 w-[300px] sm:w-[360px] border border-white/40 text-left select-none"
      style={{
        background: 'linear-gradient(135deg, #a7f3d0 0%, #86efac 40%, #4ade80 85%, #22c55e 100%)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(74,222,128,0.2)',
      }}
    >
      {/* Subtle diagonal ambient light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(125deg, transparent 32%, rgba(255,255,255,0.28) 48%, rgba(255,255,255,0.12) 56%, transparent 68%)',
        }}
      />

      {/* Author row */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <img
          src={item.avatar}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover shrink-0 shadow-md border border-black/10"
        />
        <div className="min-w-0">
          <h4 className="font-['Inter',sans-serif] font-semibold text-base sm:text-lg text-zinc-950 tracking-tight leading-tight truncate">
            {item.name}
          </h4>
          <p className="font-['Inter',sans-serif] text-xs text-emerald-950 font-normal mt-0.5 leading-none truncate">
            {channelHandle}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p className="font-['Inter',sans-serif] text-xs sm:text-sm leading-relaxed text-zinc-950 font-normal relative z-10 line-clamp-4">
        {cleanQuote}
      </p>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export const TestimonialsSection: React.FC<TestimonialsSectionProps> = () => {
  const { siteData, theme } = useSiteData();

  const all = siteData.testimonials || [];
  if (all.length === 0) return null;

  // Ensure enough cards for a seamless loop (min 4 before doubling)
  const padded = [...all];
  while (padded.length < 4) padded.push(...all);

  return (
    <section id="testimonials" className="w-full py-4 space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <h2 className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight">
          What <span className="font-serif italic font-normal text-zinc-300">Creators</span> Say
        </h2>
        <div
          className="mt-5 sm:mt-6 h-px w-24 mx-auto"
          style={{ background: theme.gradientDivider }}
        />
      </div>

      {/* Single horizontal marquee row */}
      <div className="relative w-full overflow-hidden pause-on-hover">
        {/* Left fade edge */}
        <div
          className="absolute top-0 bottom-0 left-0 w-10 sm:w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, black, transparent)' }}
        />
        {/* Right fade edge */}
        <div
          className="absolute top-0 bottom-0 right-0 w-10 sm:w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, black, transparent)' }}
        />

        <div className="flex w-max animate-marquee-slow items-stretch gap-4 sm:gap-5 py-2">
          {/* Track A */}
          <div className="flex shrink-0 items-stretch gap-4 sm:gap-5 pr-4 sm:pr-5">
            {padded.map((item, i) => (
              <MarqueeTestimonialCard key={`a-${item.id}-${i}`} item={item} />
            ))}
          </div>
          {/* Track B — exact duplicate for seamless infinite loop */}
          <div className="flex shrink-0 items-stretch gap-4 sm:gap-5 pr-4 sm:pr-5" aria-hidden="true">
            {padded.map((item, i) => (
              <MarqueeTestimonialCard key={`b-${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
