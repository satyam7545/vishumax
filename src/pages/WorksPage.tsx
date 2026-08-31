import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, ArrowLeft } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { Footer } from '../components/Footer';

interface WorksPageProps {
  onNavigateHome: () => void;
  onOpenBooking: (prefill?: string) => void;
}

// Categories matching reference
const CATEGORIES = [
  'All Designs',
  'Documentary',
  'Tech',
  'Travel',
  'Podcast/Interviews',
  'Health',
] as const;

export const WorksPage: React.FC<WorksPageProps> = ({
  onNavigateHome,
  onOpenBooking,
}) => {
  const { siteData, theme } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Designs');

  const thumbnails = siteData.thumbnails || [];

  // Filter thumbnails matching selected category
  const filteredThumbnails = useMemo(() => {
    if (selectedCategory === 'All Designs') return thumbnails;
    return thumbnails.filter((item) => {
      const cat = (item.category || '').toLowerCase();
      const sel = selectedCategory.toLowerCase();
      return cat.includes(sel) || sel.includes(cat);
    });
  }, [thumbnails, selectedCategory]);

  const handleCardClick = (item: (typeof thumbnails)[0]) => {
    if (item.link && item.link.trim() !== '') {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else {
      const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title)}`;
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black flex flex-col justify-between relative overflow-x-hidden">
      {/* 1. Large Top Ambient Glow extending generously all the way down to the category cards */}
      <div
        className="absolute inset-x-0 top-0 h-[600px] sm:h-[720px] pointer-events-none transition-all duration-700 z-0 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 115% 90% at 50% 0%, ${theme.glowColor} 0%, rgba(0,0,0,0.5) 60%, transparent 100%)`,
          opacity: 0.7,
        }}
      />
      {/* Secondary accent beam highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[380px] sm:h-[460px] pointer-events-none transition-all duration-700 z-0"
        style={{
          background: `radial-gradient(ellipse 80% 65% at 50% -10%, ${theme.secondary || '#38bdf8'} 0%, transparent 70%)`,
          opacity: 0.3,
        }}
      />
      {/* Dot Grid Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating Glass Navigation Bar (Optimized for mobile & desktop) */}
      <header className="sticky top-0 z-50 bg-[#08080c]/85 backdrop-blur-xl border-b border-white/10 px-3 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Back to Home Button & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-zinc-300 hover:text-white text-xs sm:text-[13px] font-semibold transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 group font-['Inter',sans-serif] shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
              <span className="hidden xs:inline">Back to Home</span>
              <span className="xs:hidden">Back</span>
            </button>

            <span className="text-white/20 hidden sm:inline">•</span>

            {/* Brand Logo & Name */}
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-base font-bold tracking-tight cursor-pointer hover:opacity-90 transition-opacity font-['Inter',sans-serif] truncate"
            >
              {siteData.navbar.brandLogoImage && (
                <img
                  src={siteData.navbar.brandLogoImage}
                  alt="Brand Logo"
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border border-white/20 shrink-0"
                />
              )}
              <span className="truncate">{siteData.navbar.brandLine1}</span>
              <span className="shrink-0" style={{ color: theme.primary }}>{siteData.navbar.brandLine2}</span>
            </button>
          </div>

          {/* Right Action: Live Chat with Glowing Radar Dot */}
          <button
            type="button"
            onClick={() => onOpenBooking('Custom Thumbnail Strategy')}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-[13px] whitespace-nowrap cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.35)] text-black font-['Inter',sans-serif] shrink-0"
            style={{ background: theme.primary }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black/60" />
            </span>
            <span>Live Chat</span>
          </button>
        </div>
      </header>

      {/* Main Works Showcase Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16 w-full flex flex-col items-center font-['Inter',sans-serif]">
        {/* Intro Header Section (Clean exact structure as requested) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-3xl mb-8 sm:mb-12 flex flex-col items-center px-2"
        >
          {/* Main Title: My Designs in Action */}
          <h1 className="font-['Inter',sans-serif] font-semibold text-3xl xs:text-4xl sm:text-5xl md:text-[3.4rem] text-white tracking-tight leading-[1.14]">
            My Designs in Action
          </h1>

          {/* Subtitle from the screenshot */}
          <p className="mt-3 sm:mt-4 text-xs xs:text-sm sm:text-base text-zinc-300 font-['Inter',sans-serif] max-w-2xl leading-relaxed">
            Whether it’s tech, travel, or finance, each thumbnail is designed to stand out in the feed, generates curiosity, and drive clicks.
          </p>
        </motion.div>

        {/* Category Pill Tabs Bar with Glassmorphic Effect (Mobile scrollable) */}
        <div className="mb-8 sm:mb-14 flex justify-center w-full overflow-x-auto py-2 px-1 sm:px-2 no-scrollbar">
          <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/[0.2] shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] rounded-full p-1 sm:p-1.5 inline-flex items-center gap-1 sm:gap-1.5 shrink-0 max-w-full">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13.5px] transition-all duration-300 cursor-pointer whitespace-nowrap font-['Inter',sans-serif] ${
                    isSelected
                      ? 'bg-white text-zinc-950 font-bold shadow-[0_4px_20px_rgba(255,255,255,0.4)] scale-[1.02]'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.1] font-medium'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Pure White Card Grid (Smooth, glitch-free fade) */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8"
        >
          {filteredThumbnails.map((item) => {
            const channelHandle = item.channel?.startsWith('@')
              ? item.channel
              : `@${item.channel || 'Creator'}`;
            const channelInitial = (item.channel || item.title || 'C').replace('@', '').charAt(0).toUpperCase();

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="group relative rounded-2xl sm:rounded-3xl bg-white p-3.5 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.6)] border border-slate-100 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(0,0,0,0.85)] transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer overflow-hidden text-slate-900 will-change-transform"
              >
                  {/* Top: 16:9 Thumbnail Image (Pure design preview, No CTR overlay) */}
                  <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-xs text-slate-400 font-mono">
                        High-Res Thumbnail Design
                      </div>
                    )}


                  </div>

                  {/* Middle: Channel Avatar + Title & Verified Handle */}
                  <div className="mt-3.5 sm:mt-4 flex items-start gap-2.5 sm:gap-3">
                    {/* Channel Avatar */}
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.channel || 'Channel Avatar'}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-slate-200 shadow-sm mt-0.5"
                      />
                    ) : (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200 shadow-sm mt-0.5">
                        {channelInitial}
                      </div>
                    )}

                    {/* Title & Verified Handle */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Inter',sans-serif] font-bold text-sm sm:text-[15px] text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-[11.5px] sm:text-xs text-slate-500 font-medium truncate font-['Inter',sans-serif]">
                        <span className="truncate">{channelHandle}</span>
                        {/* Verified Blue Badge Checkmark */}
                        <svg
                          className="w-3.5 h-3.5 text-blue-500 shrink-0 fill-blue-500"
                          viewBox="0 0 24 24"
                          aria-label="Verified Channel"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Dark View Count Pill (with Poppins Font) + Light Category Pill */}
                  <div className="mt-3.5 sm:mt-4 pt-3 sm:pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Left: Dark View Count Pill using Poppins Font */}
                    <div className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900 text-white font-['Poppins',sans-serif] text-[11px] sm:text-[11.5px] font-semibold flex items-center gap-1.5 shadow-sm tracking-tight shrink-0">
                      <span>{item.views || '9.5M Views'}</span>
                      <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold font-sans">
                        ↑
                      </span>
                    </div>

                    {/* Right: Light Category Pill */}
                    <div className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-700 font-['Inter',sans-serif] text-[10.5px] sm:text-[11px] font-medium flex items-center gap-1.5 truncate">
                      <span className="truncate">{item.category || 'Documentary'}</span>
                      <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-500 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
        </motion.div>

        {/* Empty State */}
        {filteredThumbnails.length === 0 && (
          <div className="py-16 sm:py-20 text-center text-zinc-400 text-sm flex flex-col items-center gap-3 font-['Inter',sans-serif]">
            <p>No thumbnail designs found in this category.</p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All Designs')}
              className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold cursor-pointer shadow-md hover:scale-105 transition-all"
            >
              Show All Designs
            </button>
          </div>
        )}
      </main>

      {/* Unified Website Footer */}
      <Footer onOpenBooking={() => onOpenBooking()} />
    </div>
  );
};
