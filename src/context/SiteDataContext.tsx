import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  SiteDataState,
  ThumbnailItemData,
  TestimonialItemData,
  LeaderItemData,
  BrandLogoItem,
} from '../types/siteData';

import { DEFAULT_SITE_DATA } from '../types/defaultSiteData';
import type { CMSPublicPayload } from '../types/cms';
import { THEMES, DEFAULT_THEME_ID, type ThemeId, type ThemeDefinition } from '../types/theme';

const AUTH_TOKEN_KEY = 'vishumax_auth_token';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

interface SiteDataContextType {
  siteData: SiteDataState;
  theme: ThemeDefinition;
  themeId: ThemeId;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  isAuthLoading: boolean;

  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  updateAdminProfile: (email: string, name: string) => Promise<{ success: boolean; error?: string }>;

  // Refresh
  refreshCMSData: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextType | null>(null);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteDataState>(DEFAULT_SITE_DATA);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Helper to map CMS payload to SiteDataState
  const mapCMSPayloadToSiteData = (cms: CMSPublicPayload): SiteDataState => {
    const s = cms.settings;

    const thumbnails: ThumbnailItemData[] = cms.projects.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      views: p.views_count,
      ctrGain: p.ctr_gain,
      duration: p.video_duration,
      channel: p.channel,
      niche: p.niche,
      hook: p.hook,
      beforeCtr: p.ctr_before,
      afterCtr: p.ctr_after,
      strategyBreakdown: p.strategy_breakdown,
      image: p.cover_image,
      avatar: p.avatar,
      link: p.link,
      graphicType: p.graphic_type,
      isCustomGraphic: p.graphic_type !== 'custom' && !p.cover_image,
    }));

    const proofLogos: BrandLogoItem[] = cms.clients.map((c) => ({
      id: c.id,
      name: c.name,
      subtext: c.subtext,
      badge: c.badge,
      logo: c.logo || c.image || undefined,
    }));

    const testimonials: TestimonialItemData[] = cms.testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      quote: t.quote,
      avatar: t.avatar,
      rating: t.rating,
      channel: t.channel,
      subscribers: t.subscribers,
      detailedBio: t.detailed_bio,
      impactMetrics: t.impact_metrics,
      stats: t.stats,
      collaborationDuration: t.collaboration_duration || 'Partnered since 2024',
    }));

    const leaders: LeaderItemData[] = cms.leaders.map((l) => ({
      id: l.id,
      name: l.name,
      role: l.role,
      channel: l.channel,
      ctrGain: l.ctr_gain,
      image: l.image,
      quote: l.quote,
      featuredTopic: l.featured_topic,
    }));

    // Update document title and SEO meta dynamically
    if (s?.seoTitle) {
      document.title = s.seoTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && s?.seoDescription) {
      metaDesc.setAttribute('content', s.seoDescription);
    }

    return {
      navbar: {
        brandLine1: s?.brandLine1 !== undefined ? s.brandLine1 : DEFAULT_SITE_DATA.navbar.brandLine1,
        brandLine2: s?.brandLine2 !== undefined ? s.brandLine2 : DEFAULT_SITE_DATA.navbar.brandLine2,
        brandLogoImage: s?.brandLogoImage !== undefined ? s.brandLogoImage : DEFAULT_SITE_DATA.navbar.brandLogoImage,
      },
      hero: {
        headlinePrefix: s?.heroHeadlinePrefix !== undefined ? s.heroHeadlinePrefix : DEFAULT_SITE_DATA.hero.headlinePrefix,
        headlineAccent: s?.heroHeadlineAccent !== undefined ? s.heroHeadlineAccent : DEFAULT_SITE_DATA.hero.headlineAccent,
        attributionPrefix: s?.heroAttributionPrefix !== undefined ? s.heroAttributionPrefix : DEFAULT_SITE_DATA.hero.attributionPrefix,
        attributionAuthor: s?.heroAttributionAuthor !== undefined ? s.heroAttributionAuthor : DEFAULT_SITE_DATA.hero.attributionAuthor,
        attributionQuote: s?.heroAttributionQuote || "“If people don't click, so you want to give them something to click.”",
        viewsStat: s?.heroViewsStat !== undefined ? s.heroViewsStat : DEFAULT_SITE_DATA.hero.viewsStat,
        ctaText: s?.heroCtaText !== undefined ? s.heroCtaText : DEFAULT_SITE_DATA.hero.ctaText,
        ctaSubtext: s?.heroCtaSubtext !== undefined ? s.heroCtaSubtext : DEFAULT_SITE_DATA.hero.ctaSubtext,
      },
      about: {
        badgeText: s?.aboutBadgeText !== undefined ? s.aboutBadgeText : DEFAULT_SITE_DATA.about.badgeText,
        heading: s?.aboutHeading !== undefined ? s.aboutHeading : DEFAULT_SITE_DATA.about.heading,
        bioParagraph1: s?.aboutBioParagraph1 !== undefined ? s.aboutBioParagraph1 : DEFAULT_SITE_DATA.about.bioParagraph1,
        bioParagraph2: s?.aboutBioParagraph2 !== undefined ? s.aboutBioParagraph2 : DEFAULT_SITE_DATA.about.bioParagraph2,
        viewsDriven: s?.aboutViewsDriven !== undefined ? s.aboutViewsDriven : DEFAULT_SITE_DATA.about.viewsDriven,
        turnaroundTime: s?.aboutTurnaroundTime !== undefined ? s.aboutTurnaroundTime : DEFAULT_SITE_DATA.about.turnaroundTime,
        ctaText: s?.aboutCtaText !== undefined ? s.aboutCtaText : DEFAULT_SITE_DATA.about.ctaText,
        portraitImage: s?.aboutPortraitImage !== undefined ? s.aboutPortraitImage : DEFAULT_SITE_DATA.about.portraitImage,
        name: s?.aboutName !== undefined ? s.aboutName : DEFAULT_SITE_DATA.about.name,
        roleTitle: s?.aboutRoleTitle !== undefined ? s.aboutRoleTitle : DEFAULT_SITE_DATA.about.roleTitle,
        slotsRemaining: s?.slotsRemaining !== undefined ? s.slotsRemaining : 2,
      },
      proofLogos: proofLogos.length > 0 ? proofLogos : (cms.clients ? [] : DEFAULT_SITE_DATA.proofLogos),
      thumbnails: thumbnails.length > 0 ? thumbnails : (cms.projects ? [] : DEFAULT_SITE_DATA.thumbnails),
      testimonials: testimonials.length > 0 ? testimonials : (cms.testimonials ? [] : DEFAULT_SITE_DATA.testimonials),
      leaders: leaders.length > 0 ? leaders : (cms.leaders ? [] : DEFAULT_SITE_DATA.leaders),
      faqs: DEFAULT_SITE_DATA.faqs,
      contact: {
        telegramUrl: s?.socialTelegram || 'https://t.me/vishumax',
        whatsappNumber: s?.socialWhatsapp || '+91 98765 43210',
        discordUsername: s?.socialDiscord || 'vishumax',
        email: s?.contactEmail || 'contact@vishumax.in',
      },
      theme: (s?.theme as ThemeId) || DEFAULT_SITE_DATA.theme || DEFAULT_THEME_ID,
    };
  };

  // 1. Fetch live CMS data from SQLite database
  const refreshCMSData = async () => {
    try {
      const res = await fetch('/api/cms/public-data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSiteData(mapCMSPayloadToSiteData(json.data));
        }
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    refreshCMSData();
  }, []);

  // 2. Check for active authenticated admin session
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return;

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated && json.user) {
            setIsAuthenticated(true);
            setAdminUser(json.user);
          } else {
            localStorage.removeItem(AUTH_TOKEN_KEY);
          }
        } else {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      } catch {
        // ignore
      }
    };
    checkAuth();
  }, []);

  // 3. Check URL hash for #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token && isAuthenticated) {
          setIsAdminOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAuthenticated]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        localStorage.setItem(AUTH_TOKEN_KEY, json.token);
        setIsAuthenticated(true);
        setAdminUser(json.user);
        setIsLoginModalOpen(false);
        setIsAdminOpen(true);
        setIsAuthLoading(false);
        return true;
      }
    } catch {
      // login error
    }
    setIsAuthLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(false);
    setAdminUser(null);
    setIsAdminOpen(false);
    setIsLoginModalOpen(false);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to update password' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const updateAdminProfile = async (email: string, name: string) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, name }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setAdminUser((prev) => (prev ? { ...prev, email, name } : null));
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to update profile' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const currentThemeId = (siteData.theme as ThemeId) || DEFAULT_THEME_ID;
  const currentTheme = THEMES[currentThemeId] || THEMES[DEFAULT_THEME_ID];

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent-primary', currentTheme.primary);
    document.documentElement.style.setProperty('--color-accent-secondary', currentTheme.secondary);
    document.documentElement.style.setProperty('--color-accent-glow', currentTheme.glowColor);
  }, [currentTheme]);

  return (
    <SiteDataContext.Provider
      value={{
        siteData,
        theme: currentTheme,
        themeId: currentThemeId,
        isAdminOpen,
        setIsAdminOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAuthenticated,
        adminUser,
        isAuthLoading,
        login,
        logout,
        changePassword,
        updateAdminProfile,
        refreshCMSData,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
