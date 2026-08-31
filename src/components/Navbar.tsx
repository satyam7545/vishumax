import React, { useState, useEffect } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';

interface NavbarProps {
  onOpenBooking?: (prefill?: string) => void;
  onNavigateToWorks?: () => void;
  onNavigateToBio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onNavigateToWorks,
  onNavigateToBio,
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
            href="#works"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateToWorks) {
                onNavigateToWorks();
              } else {
                window.location.hash = '#works';
              }
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
            href="#bio"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateToBio) {
                onNavigateToBio();
              } else {
                window.location.hash = '#bio';
              }
            }}
            className="text-white/90 hover:text-white transition-all whitespace-nowrap font-sans hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] cursor-pointer"
          >
            Bio
          </a>
        </div>

        {/* Right: Buttons + Hamburger */}
        <motion.div layout transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }} className="flex items-center gap-2">
          {/* Spots Remaining Status Badge (Non-interactive status indicator) */}
          <div
            className="hidden md:flex relative overflow-hidden px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/20 bg-white/[0.05] text-white font-medium text-xs sm:text-[13.5px] whitespace-nowrap items-center gap-2.5 select-none pointer-events-none shadow-[0_0_16px_rgba(16,185,129,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            {/* Shining Light Sweep Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-nav-shine pointer-events-none" />

            {/* Glowing Green Radar Dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>

            <span className="relative z-10 text-white font-semibold tracking-tight">
              {siteData.about.slotsRemaining !== undefined
                ? `${siteData.about.slotsRemaining} Spots Remaining`
                : (siteData.about.badgeText || '2 Spots Remaining')}
            </span>
          </div>


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

      {/* Telegram Chat — fixed top-right, fades in on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            key="telegram-chat"
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={() => onOpenBooking?.('Discovery Session')}
            className="pointer-events-auto hidden md:flex fixed top-5 sm:top-[1.85rem] right-6 z-50 items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black font-semibold text-[13px] whitespace-nowrap cursor-pointer transition-colors duration-200 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95"
          >
            <Send className="w-3.5 h-3.5 fill-black" />
            <span>Telegram Chat</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop & Drawer Dropdown */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 pointer-events-auto md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="pointer-events-auto relative z-50 mt-2.5 w-full max-w-sm p-6 rounded-3xl bg-[#0a0a0f]/98 backdrop-blur-3xl border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col gap-3.5 text-center md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <a
              href="#works"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (onNavigateToWorks) {
                  onNavigateToWorks();
                } else {
                  window.location.hash = '#works';
                }
              }}
              className="py-2.5 text-[15px] font-medium text-white/90 hover:text-emerald-400 border-b border-white/10 transition-colors"
            >
              Works
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('faq');
              }}
              className="py-2.5 text-[15px] font-medium text-white/90 hover:text-emerald-400 border-b border-white/10 transition-colors"
            >
              FAQ?
            </a>
            <a
              href="#bio"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (onNavigateToBio) {
                  onNavigateToBio();
                } else {
                  window.location.hash = '#bio';
                }
              }}
              className="py-2.5 text-[15px] font-medium text-white/90 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Bio
            </a>

            {/* Telegram CTA in mobile drawer */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking?.('Discovery Session');
              }}
              className="mt-2 w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[15px] transition-colors shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 fill-black" />
              <span>Chat on Telegram</span>
            </button>
          </div>
        </>
      )}
    </header>
  );
};
