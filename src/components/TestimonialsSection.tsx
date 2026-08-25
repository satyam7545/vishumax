import React from 'react';
import { AboutRaviCard } from './AboutRaviCard';
import { useSiteData } from '../context/SiteDataContext';
import { type TestimonialItemData } from '../types/siteData';

interface TestimonialsSectionProps {
  onOpenBooking: () => void;
}

// ── Minimal static card used inside the scrolling columns ──────────────────
function ScrollTestimonialCard({ item }: { item: TestimonialItemData; theme: { primary: string; glowColor?: string; gradientDivider: string } }) {
  const cleanQuote = item.quote ? item.quote.replace(/^["'“]|["'”]$/g, '').trim() : '';
  const channelHandle = item.channel
    ? (item.channel.startsWith('@') ? item.channel : `@${item.channel.replace(/\s+/g, '')}`)
    : `@${item.name.replace(/\s+/g, '')}`;

  return (
    <div
      className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 flex flex-col shrink-0 transition-all duration-300 group hover:scale-[1.01] border border-white/40 text-left select-none"
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
            {channelHandle}
          </p>
        </div>
      </div>

      {/* Testimonial Quote Text */}
      <p className="font-['Inter',sans-serif] text-[14px] sm:text-[15.5px] leading-[1.65] text-zinc-950 font-normal relative z-10 text-left">
        {cleanQuote}
      </p>
    </div>
  );
}

// ── Column: wraps cards into a seamless infinite vertical scroll ───────────
function ScrollColumn({
  items,
  direction,
  speed = 28,
  theme,
}: {
  items: TestimonialItemData[];
  direction: 'up' | 'down';
  speed?: number;
  theme: { primary: string; gradientDivider: string };
}) {
  const animClass = direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down';
  const animStyle = {
    animationDuration: `${speed}s`,
  };

  return (
    <div className="relative overflow-hidden pause-on-hover h-[640px] sm:h-[700px]">
      {/* Fade top */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      {/* Fade bottom */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

      <div className={`${animClass} flex flex-col gap-4`} style={animStyle}>
        {/* First copy */}
        {items.map((item, i) => (
          <ScrollTestimonialCard key={`a-${item.id}-${i}`} item={item} theme={theme} />
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, i) => (
          <ScrollTestimonialCard key={`b-${item.id}-${i}`} item={item} theme={theme} />
        ))}
      </div>
    </div>
  );
}

// ── Main section ────────────────────────────────────────────────────────────
export const TestimonialsSection: React.FC<TestimonialsSectionProps> = () => {
  const { siteData, theme } = useSiteData();

  const all = siteData.testimonials;

  // Distribute across 3 columns; if not enough, cycle through all
  const col0 = all.filter((_, i) => i % 3 === 0).length > 0
    ? all.filter((_, i) => i % 3 === 0)
    : all;
  const col1 = all.filter((_, i) => i % 3 === 1).length > 0
    ? all.filter((_, i) => i % 3 === 1)
    : all;
  const col2 = all.filter((_, i) => i % 3 === 2).length > 0
    ? all.filter((_, i) => i % 3 === 2)
    : all;

  // Pad short columns by repeating so the loop duration feels even
  const pad = (arr: TestimonialItemData[], min = 3) => {
    const result = [...arr];
    while (result.length < min) result.push(...arr);
    return result;
  };

  return (
    <section id="testimonials" className="w-full py-4 space-y-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <h2 className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight">
          What <span className="font-serif italic font-normal text-zinc-300">Creators</span> Say
        </h2>
        <div
          className="mt-6 h-px w-24 mx-auto"
          style={{ background: theme.gradientDivider }}
        />
      </div>

      {/* 3-column infinite scroll — columns 1 & 3 go up, col 2 goes down */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <ScrollColumn items={pad(col0)} direction="up"   speed={30} theme={theme} />
        <ScrollColumn items={pad(col1)} direction="down" speed={35} theme={theme} />
        <ScrollColumn items={pad(col2)} direction="up"   speed={25} theme={theme} />
      </div>

      {/* About card below */}
      <div className="pt-2">
        <AboutRaviCard />
      </div>
    </section>
  );
};
