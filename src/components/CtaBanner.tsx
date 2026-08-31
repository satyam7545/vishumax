import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

interface CtaBannerProps {
  onOpenBooking: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenBooking }) => {
  const { theme } = useSiteData();

  return (
    <section className="w-full bg-black px-4 sm:px-8 py-16 sm:py-24 relative overflow-hidden">
      {/* Ambient glow behind card */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 70% at 50% 50%, ${theme.glowColor} 0%, transparent 70%)`,
          opacity: 0.18,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden"
      >
        {/* Glassmorphic card */}
        <div
          className="relative px-8 sm:px-16 py-14 sm:py-20 flex flex-col items-center text-center gap-6 bg-[#0c0c10]/90 backdrop-blur-sm border border-white/[0.08]"
          style={{
            boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)`,
          }}
        >
          {/* Arch gradient — rises from bottom center to mid-card */}
          <div
            className="absolute inset-x-0 bottom-0 h-[65%] pointer-events-none transition-all duration-700"
            style={{
              background: `radial-gradient(ellipse 90% 100% at 50% 100%, ${theme.glowColor} 0%, transparent 70%)`,
              opacity: 0.22,
            }}
          />
          {/* Subtle inner top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-mono font-semibold uppercase tracking-widest"
            style={{
              background: theme.badgeBg,
              borderColor: theme.badgeBorder,
              color: theme.primary,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: theme.primary }}
            />
            Free Discovery Call
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-sans font-bold text-3xl sm:text-5xl md:text-[3.25rem] text-white tracking-tight leading-[1.1]"
          >
            Get your First{' '}
            <span className="font-serif italic font-normal text-zinc-300">Thumbnail</span>
          </motion.h2>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="text-sm sm:text-[15px] text-zinc-400 font-sans max-w-md leading-relaxed"
          >
            We specialize in YouTube thumbnail strategy, design, titles, and offer
            consulting — all in-house, no agencies, no outsourcing.
          </motion.p>

          {/* CTA — spinning conic border beam (matches hero button) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.27 }}
            className="mt-2"
          >
            <div className="relative p-[1.5px] rounded-full overflow-hidden group cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300 inline-flex items-center justify-center">
              {/* Spinning conic border */}
              <span
                className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] pointer-events-none"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0 240deg, ${theme.secondary} 300deg, #ffffff 360deg)`,
                }}
              />
              <button
                type="button"
                onClick={onOpenBooking}
                className="relative z-10 overflow-hidden inline-flex items-center gap-2.5 px-8 sm:px-11 py-3.5 rounded-full font-sans font-semibold text-sm sm:text-base tracking-tight cursor-pointer bg-gradient-to-b from-zinc-800/90 via-zinc-900/95 to-zinc-950 hover:from-zinc-750 hover:via-zinc-850 hover:to-zinc-900 text-white border border-white/20 hover:border-white/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-200"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <Send className="relative z-10 w-4 h-4 text-sky-400" />
                <span className="relative z-10 font-medium">Chat on Telegram</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </motion.div>

          {/* Trust micro-copy */}
          <p className="text-[11px] text-zinc-600 font-sans">
            Typically respond within 24 hours · 100M+ views driven
          </p>

          {/* Bottom highlight */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};
