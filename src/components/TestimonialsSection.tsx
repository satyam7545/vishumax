import React from 'react';
import { Star } from 'lucide-react';
import { AboutRaviCard } from './AboutRaviCard';
import { useSiteData } from '../context/SiteDataContext';
import { type TestimonialItemData } from '../types/siteData';

interface TestimonialsSectionProps {
  onOpenBooking: () => void;
}

// ── Minimal static card used inside the scrolling columns ──────────────────
function ScrollTestimonialCard({ item, theme }: { item: TestimonialItemData; theme: { primary: string; gradientDivider: string } }) {
  return (
    <div className="rounded-2xl bg-[#0c0c10] border border-white/[0.06] p-6 flex flex-col gap-4 shrink-0">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[...Array(item.rating || 5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Quote */}
      <p className="font-sans text-[13px] sm:text-sm leading-relaxed text-zinc-300">
        "{item.quote}"
      </p>

      {/* Divider */}
      <div className="h-px bg-white/[0.05]" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={item.avatar}
          alt={item.name}
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="font-sans font-semibold text-[13px] text-white leading-tight truncate">
            {item.name}
          </p>
          <p className="font-sans text-[11px] text-zinc-500 mt-0.5 truncate">
            {item.role}{item.company ? ` · ${item.company}` : ''}
          </p>
        </div>
      </div>

      {/* Stats row if available */}
      {item.stats && item.stats.length > 0 && (
        <div className="flex items-center gap-4 pt-1">
          {item.stats.slice(0, 2).map((st, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-xs font-bold" style={{ color: theme.primary }}>{st.value}</span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-wide">{st.label}</span>
            </div>
          ))}
        </div>
      )}
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
