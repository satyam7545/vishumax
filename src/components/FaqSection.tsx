import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { DEFAULT_FAQS } from '../types/defaultSiteData';

interface FaqSectionProps {
  onOpenBooking?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenBooking,
}) => {
  const { siteData, theme } = useSiteData();
  const faqs = siteData.faqs || DEFAULT_FAQS;

  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="w-full py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Heading — Centered */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <h2 className="font-sans font-bold text-4xl sm:text-5xl text-white tracking-tight">
            Frequently Asked <span className="font-serif italic font-normal text-zinc-300">Questions</span>
          </h2>
          {/* Gradient divider */}
          <div
            className="mt-6 h-px w-24 mx-auto"
            style={{ background: theme.gradientDivider }}
          />
        </div>

        {/* FAQ Line-style Accordion */}
        <div className="divide-y divide-zinc-800/80">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.35 }}
              >
                {/* Question Header Button */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-5 sm:py-6 flex items-center gap-4 text-left cursor-pointer select-none group"
                >
                  {/* Icon toggles: theme-colored when open, subtle when closed */}
                  <div
                    style={
                      isOpen
                        ? { background: theme.primary, color: theme.ctaTextColor === 'text-black' ? '#000000' : '#ffffff' }
                        : { borderColor: theme.primary, color: theme.primary }
                    }
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 border ${
                      isOpen
                        ? 'shadow-sm'
                        : 'bg-transparent group-hover:opacity-80'
                    }`}
                  >
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </motion.div>
                  </div>

                  <span
                    className={`font-sans font-semibold text-base sm:text-lg transition-colors duration-200 ${
                      isOpen ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                    }`}
                  >
                    {faq.question}
                  </span>
                </button>

                {/* Animated Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7 pl-11 pr-4 text-sm sm:text-[15px] text-zinc-400 font-sans leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA — converts engaged readers */}
        {onOpenBooking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-10 sm:mt-12 pt-8 border-t border-zinc-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          >
            <div>
              <p className="font-sans font-bold text-white text-sm sm:text-base">
                Still have questions?
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                We're happy to walk you through everything on a quick call.
              </p>
            </div>
            <button
              onClick={onOpenBooking}
              style={{
                background: theme.ctaButtonGradient,
                boxShadow: `0 4px 18px ${theme.glowColor}`,
              }}
              className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md group ${theme.ctaTextColor}`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Let's Talk</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
