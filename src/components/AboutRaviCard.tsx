import React from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';

export const AboutRaviCard: React.FC = () => {
  const { siteData } = useSiteData();

  return (
    <motion.div
      id="about"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full relative overflow-hidden py-4 sm:py-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
        {/* Left: Bio & Description */}
        <div className={`${siteData.about.portraitImage ? 'md:col-span-7 lg:col-span-8' : 'md:col-span-12'} flex flex-col justify-center space-y-4`}>
          <div>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {siteData.about.heading && siteData.about.heading !== 'About Ravi Franklin'
                ? siteData.about.heading
                : `About ${siteData.about.name || 'Vishal Gupta'}`}
            </h3>

            <p className="mt-4 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
              {siteData.about.bioParagraph1}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
              {siteData.about.bioParagraph2}
            </p>
          </div>
        </div>

        {/* Right: Studio Portrait Photo (Only rendered when uploaded) */}
        {siteData.about.portraitImage && (
          <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-[4/4.5] rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src={siteData.about.portraitImage}
                alt={siteData.about.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
