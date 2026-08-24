import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';

interface NavbarProps {
  onOpenBooking?: (prefill?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
}) => {
  const { siteData } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: id === 'work' || id === 'about' ? 'center' : 'start',
      });
    }
  };

  return (
    <header className="fixed top-4 sm:top-7 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 pointer-events-none select-none">
      {/* Ambient Backlight Glow (Subtle & Soft) */}
      <div className="absolute -top-6 w-64 h-12 bg-amber-500/5 blur-2xl pointer-events-none rounded-full" />

      {/* Floating Glassmorphic Pill Header */}
      <motion.nav
        layout
        transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
        className={`pointer-events-auto w-full max-w-[92vw] md:w-auto md:max-w-fit flex items-center justify-between gap-4 sm:gap-8 md:gap-10 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-black/40 hover:bg-black/45 backdrop-blur-2xl border border-white/15 hover:border-white/25 shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-colors duration-300 ${
          scrolled ? 'scale-[0.98] bg-black/60 border-white/20 shadow-md' : ''
        }`}
      >
        {/* Left: Golden Clover 4-Petal Logo Icon */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group cursor-pointer shrink-0 py-1"
          title={siteData.navbar.brandLine1 || 'VishuMax'}
        >
          {siteData.navbar.brandLogoImage ? (
            <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.4)] shrink-0">
              <img
                src={siteData.navbar.brandLogoImage}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.65)]"
                viewBox="0 0 24 24"
                fill="#f59e0b"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="7.5" cy="7.5" r="4.2" />
                <circle cx="16.5" cy="7.5" r="4.2" />
                <circle cx="7.5" cy="16.5" r="4.2" />
                <circle cx="16.5" cy="16.5" r="4.2" />
              </svg>
            </div>
          )}
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[14px] lg:text-[15px] font-medium tracking-normal text-white">
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('work');
            }}
            className="text-white/90 hover:text-white transition-all whitespace-nowrap font-sans hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            Works
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('faq');
            }}
            className="text-white/90 hover:text-white transition-all whitespace-nowrap font-sans hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            FAQ?
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('about');
            }}
            className="text-white/90 hover:text-white transition-all whitespace-nowrap font-sans hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            Bio
          </a>
        </div>

        {/* Right: Buttons + Hamburger */}
        <motion.div layout transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }} className="flex items-center gap-2">
          {/* 2 Spots Remaining (always visible on desktop) */}
          <button
            type="button"
            onClick={() => onOpenBooking?.('Discovery Session')}
            className="hidden md:flex relative overflow-hidden px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/25 hover:border-emerald-400/60 bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-xs sm:text-[13.5px] whitespace-nowrap items-center gap-2.5 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_16px_rgba(16,185,129,0.15),inset_0_1px_1px_rgba(255,255,255,0.25)] group/shine"
          >
            {/* Shining Light Sweep Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent animate-nav-shine pointer-events-none" />

            {/* Glowing Green Radar Dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>

            <span className="relative z-10 text-white font-semibold tracking-tight group-hover/shine:text-emerald-100 transition-colors">
              2 Spots Remaining
            </span>
          </button>


          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-zinc-200" /> : <Menu className="w-5 h-5 text-zinc-300" />}
          </button>
        </motion.div>
      </motion.nav>

      {/* Live Chat — fixed top-right, fades in on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            key="live-chat"
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={() => onOpenBooking?.('Discovery Session')}
            className="pointer-events-auto hidden md:flex fixed top-5 sm:top-[1.85rem] right-6 z-50 items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black font-semibold text-[13px] whitespace-nowrap cursor-pointer transition-colors duration-200 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95"
          >
            {/* Live green dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black/50" />
            </span>
            Live Chat
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto mt-2.5 w-full max-w-sm p-5 rounded-3xl bg-black/75 backdrop-blur-3xl border border-white/20 shadow-2xl flex flex-col gap-3.5 text-center md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('work');
            }}
            className="py-2 text-[15px] font-medium text-white/90 hover:text-amber-300 border-b border-white/10 transition-colors"
          >
            Works
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('faq');
            }}
            className="py-2 text-[15px] font-medium text-white/90 hover:text-amber-300 border-b border-white/10 transition-colors"
          >
            FAQ?
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('about');
            }}
            className="py-2 text-[15px] font-medium text-white/90 hover:text-amber-300 transition-colors"
          >
            Bio
          </a>

          {/* Contact Now CTA in mobile drawer */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking?.('Discovery Session');
            }}
            className="mt-1 w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[15px] transition-colors shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95"
          >
            Live Chat
          </button>
        </div>
      )}
    </header>
  );
};
