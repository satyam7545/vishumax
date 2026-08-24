import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';

export type CursorMode = 'default' | 'view' | 'flip' | 'zoom' | 'link';

interface CustomCursorProps {
  cursorMode: CursorMode;
  cursorText?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursorMode, cursorText }) => {
  const { theme } = useSiteData();
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  );

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, isTouch]);

  if (isTouch || !isVisible) return null;

  const isExpanded = cursorMode !== 'default';

  return (
    <>
      {/* Follower Dot / Label Capsule */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          animate={{
            width: isExpanded ? 72 : 10,
            height: isExpanded ? 72 : 10,
            backgroundColor: theme.primary,
            borderColor: isExpanded ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)',
            scale: isExpanded ? 1 : 1,
          }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          style={{
            boxShadow: `0 0 14px ${theme.glowColor}`,
          }}
          className={`rounded-full flex items-center justify-center backdrop-blur-sm border ${
            isExpanded ? (theme.ctaTextColor === 'text-black' ? 'text-black' : 'text-white') : ''
          }`}
        >
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[10px] font-bold tracking-widest font-mono uppercase select-none text-center px-1"
            >
              {cursorText || (cursorMode === 'flip' ? 'FLIP' : cursorMode === 'view' ? 'VIEW' : 'OPEN')}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};
