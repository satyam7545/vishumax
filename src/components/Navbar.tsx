import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface NavbarProps {
  onOpenBooking?: () => void;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onHoverStart,
  onHoverEnd,
}) => {
  const { siteData, theme } = useSiteData();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3.5 bg-black/85 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'py-5 sm:py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo Lockup */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMouseEnter={() => onHoverStart?.('HOME')}
          onMouseLeave={onHoverEnd}
          className="flex items-center gap-3 group cursor-pointer select-none"
        >
          {/* Logo Badge / Custom Image */}
          <div
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-white/20 group-hover:border-white/40 transition-all duration-300 shrink-0 bg-zinc-900 flex items-center justify-center"
            style={{ boxShadow: `0 0 16px ${theme.glowColor}` }}
          >
            {siteData.navbar.brandLogoImage ? (
              <img
                src={siteData.navbar.brandLogoImage}
                alt={`${siteData.navbar.brandLine1} Logo`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white"
                style={{ background: theme.previewGradient }}
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
            )}
          </div>

          {/* Brand Typography */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-extrabold text-[15px] sm:text-[17px] tracking-tight text-white group-hover:text-zinc-100 transition-colors">
              {siteData.navbar.brandLine1}
            </span>
            {siteData.navbar.brandLine2 && (
              <span className="font-sans font-medium text-[13px] sm:text-[14px] text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {siteData.navbar.brandLine2}
              </span>
            )}
          </div>
        </a>

        {/* Right: Contact Now Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            onMouseEnter={() => onHoverStart?.('TALK')}
            onMouseLeave={onHoverEnd}
            style={{
              background: theme.ctaButtonGradient,
              boxShadow: `0 2px 14px ${theme.glowColor}`,
            }}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-sans font-bold text-xs sm:text-[13px] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md group flex items-center gap-1.5 ${theme.ctaTextColor}`}
          >
            <span>Contact Now</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
