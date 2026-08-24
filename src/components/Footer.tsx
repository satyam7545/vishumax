import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface FooterProps {
  onOpenBooking: () => void;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onHoverStart,
  onHoverEnd,
}) => {
  const { siteData } = useSiteData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black border-t border-zinc-800/80 py-12 sm:py-16 text-zinc-400 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div
            className="flex items-center gap-3 select-none"
            onMouseEnter={() => onHoverStart?.('TOP')}
            onMouseLeave={onHoverEnd}
          >
            {siteData.navbar.brandLogoImage ? (
              <img
                src={siteData.navbar.brandLogoImage}
                alt="Brand Logo"
                className="w-6 h-6 rounded-lg object-cover border border-white/20 shadow-2xs"
              />
            ) : (
              <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
              </div>
            )}
            <span className="font-bold text-sm text-white">
              {siteData.navbar.brandLine1} {siteData.navbar.brandLine2}
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-xs text-zinc-400 font-medium">
            <a
              href="#work"
              onMouseEnter={() => onHoverStart?.('WORK')}
              onMouseLeave={onHoverEnd}
              className="hover:text-white transition-colors"
            >
              Work
            </a>
            <a
              href="#testimonials"
              onMouseEnter={() => onHoverStart?.('REVIEWS')}
              onMouseLeave={onHoverEnd}
              className="hover:text-white transition-colors"
            >
              Reviews
            </a>
            <a
              href="#about"
              onMouseEnter={() => onHoverStart?.('ABOUT')}
              onMouseLeave={onHoverEnd}
              className="hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#leaders"
              onMouseEnter={() => onHoverStart?.('LEADERS')}
              onMouseLeave={onHoverEnd}
              className="hover:text-white transition-colors"
            >
              Leaders
            </a>
            <a
              href="#faq"
              onMouseEnter={() => onHoverStart?.('FAQS')}
              onMouseLeave={onHoverEnd}
              className="hover:text-white transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Back to top */}
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={scrollToTop}
              onMouseEnter={() => onHoverStart?.('TOP')}
              onMouseLeave={onHoverEnd}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded-md p-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} {siteData.navbar.brandLine1} {siteData.navbar.brandLine2}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
