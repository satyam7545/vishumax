import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, MessageSquare, Mail, Send, ArrowRight, ExternalLink } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { Footer } from '../components/Footer';

interface BioPageProps {
  onNavigateHome: () => void;
  onNavigateToWorks: () => void;
  onOpenBooking: (serviceTitle?: string) => void;
}

export const BioPage: React.FC<BioPageProps> = ({
  onNavigateHome,
  onNavigateToWorks,
  onOpenBooking,
}) => {
  const { siteData, theme } = useSiteData();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Bio — ${siteData.about.name || 'Vishal Gupta'} | ${siteData.navbar.brandLine1} ${siteData.navbar.brandLine2}`;
    return () => {
      document.title = `${siteData.navbar.brandLine1} ${siteData.navbar.brandLine2} — YouTube Packaging & Thumbnail Design`;
    };
  }, [siteData]);

  const authorName = siteData.about.name || 'Vishal Gupta';
  const headingText =
    siteData.about.heading && siteData.about.heading !== 'About Ravi Franklin'
      ? siteData.about.heading
      : `About ${authorName}`;

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient Top Glow Aura */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none z-0 blur-[140px] rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.glowColor} 0%, transparent 70%)`,
          opacity: 0.35,
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

      {/* Floating Glass Navigation Bar */}
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

          {/* Right Action: Live Chat */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateToWorks}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs sm:text-[13px] font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <span>View Works</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              type="button"
              onClick={() => onOpenBooking('Creator Partnership')}
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
        </div>
      </header>

      {/* Main Bio Showcase Content */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex flex-col items-center font-['Inter',sans-serif]">
        {/* Intro Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300 mb-6 backdrop-blur-md shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-white">Creator Bio & Packaging Philosophy</span>
        </motion.div>

        {/* Hero Bio Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full rounded-3xl bg-[#0c0c12]/90 border border-white/15 p-6 sm:p-10 lg:p-12 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative overflow-hidden"
        >
          {/* Subtle Ambient Card Gradient */}
          <div
            className="absolute top-0 right-0 w-80 h-80 pointer-events-none rounded-full blur-[100px] opacity-20"
            style={{ background: theme.primary }}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Bio Information */}
            <div className={`${siteData.about.portraitImage ? 'md:col-span-7 lg:col-span-8' : 'md:col-span-12'} flex flex-col justify-center space-y-5 text-left`}>
              <div>
                <span className="text-xs font-mono tracking-wider uppercase text-emerald-400 font-semibold block mb-2">
                  Meet The Strategist
                </span>
                <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15]">
                  {authorName}
                </h1>
                <p className="mt-3 font-serif italic text-lg sm:text-xl text-zinc-300 leading-snug">
                  "{headingText}"
                </p>
              </div>

              <div className="h-px w-20 bg-gradient-to-r from-emerald-500/80 to-transparent" />

              <div className="space-y-4 text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                <p>{siteData.about.bioParagraph1}</p>
                {siteData.about.bioParagraph2 && (
                  <p className="text-zinc-400">{siteData.about.bioParagraph2}</p>
                )}
              </div>

              {/* Direct Channels */}
              <div className="pt-3 flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => onOpenBooking('Project Inquiry')}
                  className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-black flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all"
                  style={{ background: theme.primary }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect with {authorName.split(' ')[0]}</span>
                </button>

                {siteData.contact?.telegramUrl && (
                  <a
                    href={siteData.contact.telegramUrl.startsWith('http') ? siteData.contact.telegramUrl : `https://t.me/${siteData.contact.telegramUrl.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-zinc-200 font-medium flex items-center gap-2 transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram</span>
                  </a>
                )}

                {siteData.contact?.email && (
                  <a
                    href={`mailto:${siteData.contact.email}`}
                    className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-zinc-200 font-medium flex items-center gap-2 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Studio Portrait Photo */}
            {siteData.about.portraitImage && (
              <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-end">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] group bg-zinc-950">
                  <img
                    src={siteData.about.portraitImage}
                    alt={authorName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                    <p className="text-xs font-bold text-white">{authorName}</p>
                    <p className="text-[10px] text-zinc-400">YouTube Packaging Specialist</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick CTA to Works */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 sm:mt-12 w-full rounded-2xl bg-white/[0.03] border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div>
            <h3 className="font-bold text-base text-white">Want to see the packaging in action?</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Explore our portfolio of high-CTR documentary, tech, and travel thumbnails.</p>
          </div>
          <button
            type="button"
            onClick={onNavigateToWorks}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Browse Works Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </main>

      {/* Unified Website Footer */}
      <Footer onOpenBooking={() => onOpenBooking()} />
    </div>
  );
};
