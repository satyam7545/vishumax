import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface CtaBannerProps {
  onOpenBooking: () => void;
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  onOpenBooking,
  onHoverStart,
  onHoverEnd,
}) => {
  const { theme } = useSiteData();

  return (
    <section className="w-full relative overflow-hidden bg-zinc-950">
      {/* Ambient dynamic theme glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 70% 80% at 50% 50%, ${theme.glowColor} 0%, transparent 75%)`,
          opacity: 0.45,
        }}
      />

      {/* Fine dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-28 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            background: theme.badgeBg,
            borderColor: theme.badgeBorder,
            color: theme.primary,
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-mono font-semibold mb-6 uppercase tracking-widest"
        >
          <Sparkles className="w-3 h-3" />
          <span>Free Discovery Call</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="font-sans font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.1] max-w-2xl"
        >
          Ready to 10×{' '}
          <span className="font-serif italic font-normal text-zinc-300">
            your click-through rate?
          </span>
        </motion.h2>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="mt-4 text-sm sm:text-base text-zinc-400 font-sans max-w-md"
        >
          Book a free 20-min discovery call. We'll review your channel, spot the gaps, and show you exactly how to scale.
          <span className="text-zinc-300 font-medium"> No commitments.</span>
        </motion.p>

        {/* CTA button with Animated Glowing Border Effect */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="mt-8"
        >
          <div className="relative p-[1.5px] rounded-full overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl inline-flex items-center justify-center">
            {/* Spinning Conic Border Beam */}
            <span
              className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] pointer-events-none"
              style={{
                background: `conic-gradient(from 0deg, transparent 0 240deg, ${theme.secondary} 300deg, #ffffff 360deg)`,
              }}
            />

            {/* Inner Subtle Gradient Button Surface */}
            <button
              type="button"
              onClick={onOpenBooking}
              onMouseEnter={() => onHoverStart?.('BOOK')}
              onMouseLeave={onHoverEnd}
              className="relative z-10 overflow-hidden inline-flex items-center gap-3 px-8 sm:px-11 py-4 sm:py-4.5 rounded-full font-sans font-semibold text-sm sm:text-base tracking-tight cursor-pointer bg-gradient-to-b from-zinc-800/90 via-zinc-900/95 to-zinc-950 hover:from-zinc-750 hover:via-zinc-850 hover:to-zinc-900 text-white border border-white/20 hover:border-white/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-200"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 text-white font-medium">Start the Conversation</span>
              <ArrowRight className="relative z-10 w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </motion.div>

        {/* Trust micro-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-5 text-[11px] text-zinc-600 font-sans"
        >
          Typically respond within 24 hours · 100M+ views driven for clients
        </motion.p>
      </div>
    </section>
  );
};
