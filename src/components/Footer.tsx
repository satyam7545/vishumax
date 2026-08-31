import React from 'react';
import { ArrowUp, Send } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface FooterProps {
  onOpenBooking?: () => void;
}

// Inline SVG social icons
const TwitterX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Instagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const Facebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073C24 5.4 18.627 0 12 0S0 5.4 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.932-1.956 1.889v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const YouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const socials = [
  { label: 'YouTube',     icon: <YouTube />,   href: 'https://youtube.com' },
  { label: 'Instagram',   icon: <Instagram />, href: 'https://instagram.com' },
  { label: 'Twitter / X', icon: <TwitterX />,  href: 'https://x.com' },
  { label: 'Facebook',    icon: <Facebook />,  href: 'https://facebook.com' },
];

export const Footer: React.FC<FooterProps> = () => {
  const { siteData, theme } = useSiteData();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const rawTg = siteData.contact?.telegramUrl || 'https://t.me/vishumax';
  const telegramUrl = rawTg.startsWith('http') ? rawTg : `https://t.me/${rawTg.replace('@', '')}`;
  const telegramHandle = rawTg.startsWith('http') ? `@${rawTg.split('/').pop()}` : rawTg.startsWith('@') ? rawTg : `@${rawTg}`;

  return (
    <footer className="w-full bg-black border-t border-zinc-800/80 py-12 sm:py-16 text-zinc-400 font-sans relative z-10 overflow-hidden">
      {/* 1. Large Top Gradient Glow — rich radiant theme illumination */}
      <div
        className="absolute inset-x-0 top-0 h-full pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 95% 100% at 50% 0%, ${theme.glowColor} 0%, rgba(0,0,0,0.5) 65%, transparent 100%)`,
          opacity: 0.52,
        }}
      />
      {/* 2. Secondary concentrated top core beam */}
      <div
        className="absolute inset-x-0 top-0 h-[220px] pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 70% 80% at 50% -20%, ${theme.secondary || '#38bdf8'} 0%, transparent 75%)`,
          opacity: 0.35,
        }}
      />
      {/* 3. Luminous Top Border Beam Highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${theme.primary} 50%, transparent 100%)`,
          opacity: 0.6,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">

          {/* Brand + Telegram handle */}
          <div className="flex flex-col gap-1.5 select-none">
            <div className="flex items-center gap-3">
              {siteData.navbar.brandLogoImage ? (
                <img
                  src={siteData.navbar.brandLogoImage}
                  alt="Brand Logo"
                  className="w-6 h-6 rounded-lg object-cover border border-white/20"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                </div>
              )}
              <span className="font-bold text-sm text-white">
                {siteData.navbar.brandLine1} {siteData.navbar.brandLine2}
              </span>
            </div>
            <a
              href={telegramUrl}
              className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors ml-9 flex items-center gap-1.5 font-medium"
            >
              <Send className="w-3 h-3 text-sky-400" />
              <span>{telegramHandle}</span>
            </a>
          </div>

          {/* Center / Action Section: Social Media Icons + Direct Telegram Chat */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Social Media Links */}
            <div className="flex items-center gap-2.5">
              {socials.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Direct Telegram Chat button (Direct redirect in same window) */}
            <a
              href={telegramUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 hover:text-white font-semibold text-xs transition-all shadow-sm group"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Chat on Telegram</span>
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer text-xs font-medium"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} {siteData.navbar.brandLine1} {siteData.navbar.brandLine2}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
