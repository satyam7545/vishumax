import React from 'react';
import { TestimonialCard } from './TestimonialCard';
import { AboutRaviCard } from './AboutRaviCard';
import { useSiteData } from '../context/SiteDataContext';

interface TestimonialsSectionProps {
  onOpenBooking: () => void;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onOpenBooking,
  onHoverStart,
  onHoverEnd,
}) => {
  const { siteData, theme } = useSiteData();

  return (
    <section id="testimonials" className="w-full py-4 space-y-8">
      {/* Testimonials Header */}
      <div className="mb-2">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: theme.dotColor }} />
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            What <span className="font-serif italic font-normal text-zinc-300">Creators</span> Say
          </h2>
        </div>
        <p className="text-sm text-zinc-400 ml-5 font-sans">Flip cards to read their full story.</p>
        <div
          className="mt-5 h-px w-full"
          style={{ background: theme.gradientDivider }}
        />
      </div>

      {/* Dynamic Editorial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {siteData.testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            item={testimonial}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
          />
        ))}
      </div>

      {/* About Profile Card */}
      <div className="pt-4">
        <AboutRaviCard
          onOpenBooking={onOpenBooking}
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
        />
      </div>
    </section>
  );
};
