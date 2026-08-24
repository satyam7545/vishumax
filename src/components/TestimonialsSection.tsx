import React from 'react';
import { TestimonialCard } from './TestimonialCard';
import { AboutRaviCard } from './AboutRaviCard';
import { useSiteData } from '../context/SiteDataContext';

interface TestimonialsSectionProps {
  onOpenBooking: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = () => {
  const { siteData, theme } = useSiteData();

  return (
    <section id="testimonials" className="w-full py-4 space-y-8">
      {/* Testimonials Header (Centered) */}
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight">
          What <span className="font-serif italic font-normal text-zinc-300">Creators</span> Say
        </h2>
        <p className="text-sm text-zinc-400 font-sans mt-2">Hover cards to read their full story.</p>
        <div
          className="mt-6 h-px w-24 mx-auto"
          style={{ background: theme.gradientDivider }}
        />
      </div>

      {/* Dynamic Editorial Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {siteData.testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            item={testimonial}
          />
        ))}
      </div>

      {/* About Profile Card */}
      <div className="pt-4">
        <AboutRaviCard />
      </div>
    </section>
  );
};
