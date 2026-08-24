import { useState, useEffect, lazy, Suspense } from 'react';
import { CustomCursor, type CursorMode } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ThumbnailShowcase } from './components/ThumbnailShowcase';
import { StatsBar } from './components/StatsBar';
import { TestimonialsSection } from './components/TestimonialsSection';
import { IndustryLeadersSection } from './components/IndustryLeadersSection';
import { FaqSection } from './components/FaqSection';
import { ThumbnailModal } from './components/ThumbnailModal';
import { BookCallModal } from './components/BookCallModal';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import type { ThumbnailItemData } from './types/siteData';

// Code-split heavy admin suite
const AdminDashboard = lazy(() =>
  import('./admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminLoginModal = lazy(() =>
  import('./admin/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal }))
);

function AppContent() {
  const { theme, isAuthenticated, setIsAdminOpen, setIsLoginModalOpen } = useSiteData();
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [cursorText, setCursorText] = useState<string | undefined>(undefined);

  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailItemData | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<string | undefined>(undefined);

  // Hidden admin access: secret route (/admin or #admin) or keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path === '/admin/' || hash === '#admin') {
        if (isAuthenticated) {
          setIsAdminOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAuthenticated) {
          setIsAdminOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated, setIsAdminOpen, setIsLoginModalOpen]);

  const handleHoverStart = (text?: string) => {
    if (text) {
      setCursorText(text);
      if (text.includes('FLIP')) {
        setCursorMode('flip');
      } else if (text.includes('VIEW') || text.includes('INSPECT')) {
        setCursorMode('view');
      } else {
        setCursorMode('link');
      }
    } else {
      setCursorMode('link');
    }
  };

  const handleHoverEnd = () => {
    setCursorMode('default');
    setCursorText(undefined);
  };

  const handleOpenBooking = (prefillTitle?: string) => {
    setBookingPrefill(prefillTitle);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 relative overflow-x-hidden font-sans w-full selection:bg-emerald-500 selection:text-black">
      {/* Follower Custom Cursor */}
      <CustomCursor cursorMode={cursorMode} cursorText={cursorText} />

      {/* Navigation Header */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onHoverStart={() => handleHoverStart('MENU')}
        onHoverEnd={handleHoverEnd}
      />

      {/* UNIFIED HERO & THUMBNAILS TOP BANNER */}
      <div className="relative w-full overflow-hidden bg-black">
        {/* 1. Primary Glowing Aura (Dynamically adapts to theme) */}
        <div
          className="absolute top-[35%] sm:top-[38%] left-1/2 -translate-x-1/2 w-[160%] max-w-[2200px] h-[950px] pointer-events-none opacity-95 blur-[60px] transition-all duration-700"
          style={{ background: theme.heroAuraGradient }}
        />

        {/* 2. Soft horizontal ambient diffusion */}
        <div
          className="absolute top-[40%] left-0 right-0 h-[600px] blur-3xl pointer-events-none transition-all duration-700"
          style={{ background: theme.heroDiffusionGradient }}
        />

        {/* 3. Smooth bottom linear fade into pure deep dark */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 sm:h-56 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 50%, #000000 100%)',
          }}
        />

        {/* Edge-to-Edge Hero */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />

        {/* Full-Width Moving Thumbnail Showcase (Dual Opposite Rows) */}
        <ThumbnailShowcase
          onSelectThumbnail={(thumb) => setSelectedThumbnail(thumb)}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />
      </div>

      {/* Social Proof Stats Strip */}
      <StatsBar />

      {/* Deep Dark Canvas for Lower Sections with Pattern & Ambient Glows */}
      <div className="relative z-10 bg-black text-zinc-100 pb-20 w-full space-y-20 sm:space-y-28 pt-8 sm:pt-14 overflow-hidden">
        {/* 1. Subtle Dark Grid Pattern */}
        <div className="absolute inset-0 bg-dark-grid opacity-40 pointer-events-none" />

        {/* 2. Delicate Radial Dots Texture */}
        <div className="absolute inset-0 bg-dark-dots opacity-30 pointer-events-none" />

        {/* 3. Ambient Theme Glow Blobs for Visual Depth */}
        <div
          className="absolute top-[8%] left-[-15%] w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
          style={{ background: theme.glowColor }}
        />
        <div
          className="absolute top-[42%] right-[-15%] w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none opacity-15 transition-all duration-700"
          style={{ background: theme.glowColor }}
        />
        <div
          className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-15 transition-all duration-700"
          style={{ background: theme.glowColor }}
        />

        {/* 4. Soft Vignette Mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none opacity-60" />

        {/* Testimonials 3D Flip System + About Vishal Gupta */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsSection
            onOpenBooking={() => handleOpenBooking()}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          />
        </div>

        {/* Trusted by Industry Leaders Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <IndustryLeadersSection
            onOpenBooking={() => handleOpenBooking()}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          />
        </div>

        {/* FAQs Accordion Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqSection
            onOpenBooking={() => handleOpenBooking()}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          />
        </div>
      </div>

      {/* Full-width CTA Banner */}
      <CtaBanner
        onOpenBooking={() => handleOpenBooking()}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      />

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      />

      {/* Interactive Lightbox Modal */}
      <ThumbnailModal
        item={selectedThumbnail}
        onClose={() => setSelectedThumbnail(null)}
        onBookCall={(title) => handleOpenBooking(title)}
      />

      {/* Interactive Booking Strategy Modal */}
      <BookCallModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        prefillThumbnail={bookingPrefill}
      />

      {/* Admin Authentication Login Modal (Password & Email protected) */}
      <Suspense fallback={null}>
        <AdminLoginModal />
        <AdminDashboard />
      </Suspense>
    </div>
  );
}

export function App() {
  return (
    <SiteDataProvider>
      <AppContent />
    </SiteDataProvider>
  );
}

export default App;
