import { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ThumbnailShowcase } from './components/ThumbnailShowcase';
import { StatsBar } from './components/StatsBar';
import { TestimonialsSection } from './components/TestimonialsSection';
import { IndustryLeadersSection } from './components/IndustryLeadersSection';
import { FaqSection } from './components/FaqSection';
import { BookCallModal } from './components/BookCallModal';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { WorksPage } from './pages/WorksPage';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';

// Code-split heavy admin suite
const AdminDashboard = lazy(() =>
  import('./admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminLoginModal = lazy(() =>
  import('./admin/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal }))
);

function AppContent() {
  const { theme, isAuthenticated, setIsAdminOpen, setIsLoginModalOpen } = useSiteData();

  const [currentView, setCurrentView] = useState<'home' | 'works'>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<string | undefined>(undefined);

  // Route detection & navigation: /works, #works, /admin, #admin
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path === '/admin/' || hash === '#admin') {
        if (isAuthenticated) {
          setIsAdminOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      } else if (path === '/works' || path === '/works/' || hash === '#works') {
        setCurrentView('works');
      } else {
        setCurrentView('home');
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

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
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated, setIsAdminOpen, setIsLoginModalOpen]);

  const handleOpenBooking = (prefillTitle?: string) => {
    setBookingPrefill(prefillTitle);
    setIsBookingOpen(true);
  };

  const navigateToWorks = () => {
    window.location.hash = '#works';
    setCurrentView('works');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.location.hash = '';
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 relative overflow-x-hidden font-sans w-full selection:bg-emerald-500 selection:text-black">
      {currentView === 'works' ? (
        <WorksPage
          onNavigateHome={navigateToHome}
          onOpenBooking={handleOpenBooking}
        />
      ) : (
        <>
          {/* Navigation Header */}
          <Navbar
            onOpenBooking={() => handleOpenBooking()}
            onNavigateToWorks={navigateToWorks}
          />

          {/* UNIFIED HERO & THUMBNAILS TOP BANNER */}
          <div className="relative w-full overflow-hidden bg-black">
            {/* 1. Primary Glowing Aura Arch (Reaches right down across "We make you believe in" text) */}
            <div
              className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 w-[130%] max-w-[1550px] h-[720px] sm:h-[820px] pointer-events-none opacity-75 blur-[60px] transition-all duration-700"
              style={{ background: theme.heroAuraGradient }}
            />

            {/* 2. Soft horizontal ambient diffusion from top */}
            <div
              className="absolute top-0 left-0 right-0 h-[460px] blur-3xl pointer-events-none transition-all duration-700 opacity-45"
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
            <HeroSection onOpenBooking={() => handleOpenBooking()} />

            {/* Full-Width Moving Thumbnail Showcase (Dual Opposite Rows) */}
            <ThumbnailShowcase />
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
              <TestimonialsSection onOpenBooking={() => handleOpenBooking()} />
            </div>

            {/* Trusted by Industry Leaders Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <IndustryLeadersSection onOpenBooking={() => handleOpenBooking()} />
            </div>

            {/* FAQs Accordion Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FaqSection onOpenBooking={() => handleOpenBooking()} />
            </div>
          </div>

          {/* Full-width CTA Banner */}
          <CtaBanner onOpenBooking={() => handleOpenBooking()} />

          {/* Footer */}
          <Footer onOpenBooking={() => handleOpenBooking()} />
        </>
      )}

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
