import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Sparkles, CheckCircle2, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import { type ThumbnailItemData } from '../types/siteData';
import { useSiteData } from '../context/SiteDataContext';

interface ThumbnailModalProps {
  item: ThumbnailItemData | null;
  onClose: () => void;
  onBookCall: (prefillTitle?: string) => void;
}

export const ThumbnailModal: React.FC<ThumbnailModalProps> = ({
  item,
  onClose,
  onBookCall,
}) => {
  const { theme } = useSiteData();
  const [isZoomed, setIsZoomed] = useState(false);

  const [prevId, setPrevId] = useState<string | null>(null);
  if (item && item.id !== prevId) {
    setPrevId(item.id);
    setIsZoomed(false);
  }

  React.useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#111116] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/20 transition-all z-30 cursor-pointer shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Thumbnail Display */}
            <div className="lg:col-span-7 bg-black flex flex-col justify-center items-center p-4 sm:p-6 relative border-b lg:border-b-0 lg:border-r border-white/10">
              <div
                onClick={() => setIsZoomed(!isZoomed)}
                title={isZoomed ? 'Click to zoom out' : 'Click to inspect packaging in high-res'}
                className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl relative cursor-zoom-in group select-none"
              >
                {item.image ? (
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    animate={{ scale: isZoomed ? 1.5 : 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full h-full object-cover origin-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400 text-sm font-mono">
                    High-Converting Graphic Asset
                  </div>
                )}

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/85 text-xs font-mono text-white border border-white/10 z-10">
                  {item.duration}
                </div>

                {/* Zoom Hint Overlay Button */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity z-10">
                  {isZoomed ? (
                    <>
                      <ZoomOut className="w-3 h-3" style={{ color: theme.primary }} />
                      <span>Zoom Out</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-3 h-3" style={{ color: theme.primary }} />
                      <span>Inspect 1.5x</span>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Metrics Strip */}
              <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Baseline CTR</div>
                  <div className="text-sm sm:text-base font-bold font-mono text-zinc-300">{item.beforeCtr}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">New CTR</div>
                  <div className="text-sm sm:text-base font-black font-mono text-emerald-400">{item.afterCtr}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Total Views</div>
                  <div className="text-sm sm:text-base font-bold font-mono text-zinc-100">{item.views}</div>
                </div>
              </div>
            </div>

            {/* Right: Strategy & Breakdown */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    style={{
                      background: theme.badgeBg,
                      borderColor: theme.badgeBorder,
                      color: theme.primary,
                    }}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border"
                  >
                    {item.niche}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {item.channel}
                  </span>
                </div>

                <h3 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                  {item.title}
                </h3>

                {/* Packaging Hook */}
                <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Packaging Psychology
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {item.hook}
                  </p>
                </div>

                {/* Strategy List */}
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Optimization Breakdown
                  </div>
                  {item.strategyBreakdown.map((strat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{strat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal CTA */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    onClose();
                    onBookCall(item.title);
                  }}
                  style={{
                    background: theme.ctaButtonGradient,
                    boxShadow: theme.ctaShadow,
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${theme.ctaTextColor}`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Get Packaging for Your Channel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
