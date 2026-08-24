import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Copy, Check, MessageSquare, Shield, ExternalLink } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillThumbnail?: string;
}

export const BookCallModal: React.FC<BookCallModalProps> = ({
  isOpen,
  onClose,
  prefillThumbnail,
}) => {
  const { siteData, theme } = useSiteData();
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'discord' | 'email' | null>(null);

  const telegramUrl = siteData.contact?.telegramUrl || 'https://t.me/vishumax';
  const whatsappNumber = siteData.contact?.whatsappNumber || '+91 98765 43210';
  const discordUsername = siteData.contact?.discordUsername || 'vishumax';
  const contactEmail = siteData.contact?.email || 'contact@vishumax.in';

  // Format WhatsApp Link
  const cleanWhatsappDigits = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    prefillThumbnail
      ? `Hi Vishal! I'm interested in thumbnail packaging similar to "${prefillThumbnail}".`
      : "Hi Vishal! I'd like to discuss thumbnail packaging for my YouTube channel."
  )}`;

  const handleCopy = (text: string, type: 'whatsapp' | 'discord' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-[#0e0e13] border border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-auto p-6 sm:p-8"
        >
          {/* Ambient Top Glow */}
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-28 blur-3xl pointer-events-none rounded-full"
            style={{ background: theme.heroAuraGradient }}
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-sans font-semibold mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>Direct Creator Access</span>
            </div>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Connect with <span className="font-serif italic font-normal text-zinc-200">Vishal Gupta</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-sm mx-auto font-sans">
              Choose your preferred channel below for fast, direct communication regarding packaging & strategy.
            </p>
          </div>

          {/* Channel Cards */}
          <div className="space-y-3.5 relative z-10">
            {/* 1. Telegram (Primary Direct Chat) */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/35 hover:border-[#0088cc]/60 shadow-[0_4px_20px_rgba(0,136,204,0.15)] transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#0088cc] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                  <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5 rotate-[-20deg]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-sm sm:text-base text-white">Chat on Telegram</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#0088cc]/30 text-cyan-200 border border-[#0088cc]/40">
                      Fastest
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans mt-0.5">
                    Instant reply • Review channel & discuss drops directly
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-cyan-300 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
            </a>

            {/* 2. WhatsApp */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/15 border border-[#25D366]/30 transition-all gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-black shadow-md shrink-0">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="font-sans font-bold text-sm text-white">WhatsApp</span>
                  <p className="text-xs text-emerald-300 font-mono font-medium mt-0.5">
                    {whatsappNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleCopy(whatsappNumber, 'whatsapp')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedType === 'whatsapp' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-sans font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* 3. Discord */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#5865F2]/10 hover:bg-[#5865F2]/15 border border-[#5865F2]/30 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-md shrink-0 font-bold text-sm">
                  D
                </div>
                <div className="text-left">
                  <span className="font-sans font-bold text-sm text-white">Discord</span>
                  <p className="text-xs text-indigo-300 font-mono font-medium mt-0.5">
                    {discordUsername}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(discordUsername, 'discord')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedType === 'discord' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-indigo-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Tag</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Direct Guarantee Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-sans">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Direct strategy review • No agency middlemen</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(contactEmail, 'email')}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedType === 'email' ? 'Email Copied!' : contactEmail}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
