import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Send, Clock, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
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
  const { theme } = useSiteData();
  const [channelName, setChannelName] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [email, setEmail] = useState('');
  const [currentCtr, setCurrentCtr] = useState('4-6%');
  const [monthlyDrops, setMonthlyDrops] = useState('4-8 videos');
  const [packageTier, setPackageTier] = useState('Monthly Retainer (8 Drops)');
  const [notes, setNotes] = useState(
    prefillThumbnail ? `Interested in strategy similar to: "${prefillThumbnail}"` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = React.useCallback(() => {
    setIsSubmitted(false);
    setErrorMessage(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea3829', '#f2552c', '#ffffff', '#fbbf24'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: channelName,
          email,
          channel_url: channelUrl,
          project_type: packageTier,
          current_ctr: currentCtr,
          monthly_drops: monthlyDrops,
          message: notes,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit discovery inquiry. Please check your connection and try again.');
      }

      setIsSubmitted(true);
      triggerCelebration();
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#111116] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div
                  style={{
                    background: theme.badgeBg,
                    borderColor: theme.badgeBorder,
                    color: theme.primary,
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-2 font-semibold"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Free 20-Min YouTube CTR Audit</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Book a Discovery Strategy Session
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  We'll review your recent videos, analyze your packaging gaps, and show you how to scale views.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                      Channel Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="e.g. Ali Abdaal / TechLead"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#ea3829] text-white text-xs placeholder:text-zinc-600 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                      Channel URL or Handle *
                    </label>
                    <input
                      type="text"
                      required
                      value={channelUrl}
                      onChange={(e) => setChannelUrl(e.target.value)}
                      placeholder="youtube.com/@yourchannel"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#ea3829] text-white text-xs placeholder:text-zinc-600 focus:outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="creator@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#ea3829] text-white text-xs placeholder:text-zinc-600 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                      Monthly Video Output
                    </label>
                    <select
                      value={monthlyDrops}
                      onChange={(e) => setMonthlyDrops(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#ea3829] text-white text-xs focus:outline-none transition-colors font-sans cursor-pointer"
                    >
                      <option className="bg-[#18181b] text-white" value="1-3 videos">1 - 3 videos / month</option>
                      <option className="bg-[#18181b] text-white" value="4-8 videos">4 - 8 videos / month</option>
                      <option className="bg-[#18181b] text-white" value="8-15 videos">8 - 15 videos / month</option>
                      <option className="bg-[#18181b] text-white" value="Daily drops">Daily / High-Frequency</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                      Estimated Current CTR
                    </label>
                    <select
                      value={currentCtr}
                      onChange={(e) => setCurrentCtr(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#ea3829] text-white text-xs focus:outline-none transition-colors font-sans cursor-pointer"
                    >
                      <option className="bg-[#18181b] text-white" value="Under 3%">Under 3% (Needs overhaul)</option>
                      <option className="bg-[#18181b] text-white" value="4-6%">4% - 6% (Average)</option>
                      <option className="bg-[#18181b] text-white" value="7-10%">7% - 10% (Good)</option>
                      <option className="bg-[#18181b] text-white" value="10%+">10%+ (Scaling aggressively)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                      Desired Partnership
                    </label>
                    <select
                      value={packageTier}
                      onChange={(e) => setPackageTier(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#ea3829] text-white text-xs focus:outline-none transition-colors font-sans cursor-pointer"
                    >
                      <option className="bg-[#18181b] text-white" value="Monthly Retainer (8 Drops)">Monthly Retainer (8 Drops)</option>
                      <option className="bg-[#18181b] text-white" value="Monthly Retainer (15 Drops)">Monthly Retainer (15 Drops)</option>
                      <option className="bg-[#18181b] text-white" value="Full Channel Packaging Overhaul">Full Channel Packaging Overhaul</option>
                      <option className="bg-[#18181b] text-white" value="Test Pilot Drop (3 Thumbnails)">Test Pilot Drop (3 Thumbnails)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                    Channel Goal / Specific Requests
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us what you want to achieve or any inspiration links..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#ea3829] text-white text-xs placeholder:text-zinc-600 focus:outline-none transition-colors font-sans"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Direct review by Ravi Franklin • No generic agency handoff</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: theme.ctaButtonGradient,
                      boxShadow: theme.ctaShadow,
                    }}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50 hover:scale-105 active:scale-95 ${theme.ctaTextColor}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Schedule Session'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-white">
                Discovery Session Requested!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{channelName}</strong>. Your inquiry has been saved to our studio system. Ravi Franklin will review your channel analytics and email you at <strong className="text-white">{email}</strong> within 12 hours with available time slots and an initial audit teardown.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Return to Portfolio
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
