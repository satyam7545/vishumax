import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { DEFAULT_FAQS } from '../types/defaultSiteData';

interface FaqSectionProps {
  onHoverStart?: (text?: string) => void;
  onHoverEnd?: () => void;
  onOpenBooking?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onHoverStart,
  onHoverEnd,
  onOpenBooking,
}) => {
  const { siteData, theme } = useSiteData();
  const faqs = siteData.faqs || DEFAULT_FAQS;

  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="w-full py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Heading — consistent with rest of site */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: theme.dotColor }} />
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Frequently Asked <span className="font-serif italic font-normal text-zinc-300">Questions</span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 ml-5 font-sans">
            Real questions, honest answers.
          </p>
          {/* Gradient divider */}
          <div
            className="mt-5 h-px w-full"
            style={{
              background: theme.gradientDivider,
            }}
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
                  onMouseEnter={() => onHoverStart?.('FAQ')}
                  onMouseLeave={onHoverEnd}
                  className="w-full py-5 sm:py-6 flex items-center gap-4 text-left cursor-pointer select-none group"
                >
                  {/* Icon toggles between + and × with theme fill when open */}
                  <div
                    style={
                      isOpen
                        ? { background: theme.primary, color: theme.ctaTextColor === 'text-black' ? '#000000' : '#ffffff' }
                        : {}
                    }
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen
                        ? 'shadow-xs'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-zinc-200'
                    }`}
                  >
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </motion.div>
                  </div>

                  <span
                    className={`font-sans font-semibold text-sm sm:text-base transition-colors duration-200 ${
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
                      <div className="pb-6 pl-10 pr-4 text-sm text-zinc-400 font-sans leading-relaxed">
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
              onMouseEnter={() => onHoverStart?.('TALK')}
              onMouseLeave={onHoverEnd}
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
