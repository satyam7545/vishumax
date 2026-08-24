export type ThemeId = 'design-hub' | 'crimson' | 'violet' | 'cyan' | 'amber';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  primary: string; // e.g. '#00FF6A'
  secondary: string; // e.g. '#00D9A3'
  accentDark: string; // e.g. '#008f5d'
  
  // Hero Glowing Auras
  heroAuraGradient: string;
  heroDiffusionGradient: string;
  
  // CTA & Interactive Elements
  ctaButtonGradient: string;
  ctaButtonHoverGradient: string;
  ctaShadow: string;
  ctaTextColor: string; // 'text-black' | 'text-white'
  
  // Badges & Tags
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  
  // Section Headings & Dividers
  dotColor: string;
  gradientDivider: string;
  
  // Accents & Highlights
  accentText: string;
  accentBg: string;
  accentBorder: string;
  glowColor: string;
  selectionBg: string;
  
  // Preview for Admin Switcher
  previewGradient: string;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  'design-hub': {
    id: 'design-hub',
    name: 'Design Hub Green',
    tagline: 'Vibrant Neon Spring Green to Minty Emerald Teal (#00FF6A → #00D9A3)',
    primary: '#00FF6A',
    secondary: '#00D9A3',
    accentDark: '#006c4b',
    heroAuraGradient:
      'radial-gradient(ellipse 80% 55% at 50% 55%, rgba(0, 255, 106, 0.88) 0%, rgba(0, 217, 163, 0.65) 45%, rgba(0, 70, 48, 0.35) 75%, transparent 100%)',
    heroDiffusionGradient: 'linear-gradient(to right, transparent, rgba(0, 217, 163, 0.35), transparent)',
    ctaButtonGradient: 'linear-gradient(135deg, #00FF6A 0%, #00D9A3 100%)',
    ctaButtonHoverGradient: 'linear-gradient(135deg, #1aff7d 0%, #1ae6b2 100%)',
    ctaShadow: '0 8px 32px rgba(0, 255, 106, 0.55)',
    ctaTextColor: 'text-black',
    badgeBg: 'rgba(0, 255, 106, 0.12)',
    badgeText: '#00FF6A',
    badgeBorder: 'rgba(0, 255, 106, 0.28)',
    dotColor: '#00FF6A',
    gradientDivider: 'linear-gradient(to right, #00FF6A, #00D9A3 40%, #e2e8f0 70%, transparent)',
    accentText: '#00FF6A',
    accentBg: 'rgba(0, 255, 106, 0.12)',
    accentBorder: 'rgba(0, 255, 106, 0.25)',
    glowColor: 'rgba(0, 255, 106, 0.45)',
    selectionBg: '#00FF6A',
    previewGradient: 'linear-gradient(135deg, #00FF6A 0%, #00D9A3 100%)',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Flame',
    tagline: 'High-Impact YouTube Red & Crimson Flame (#EA3829 → #F2552C)',
    primary: '#ea3829',
    secondary: '#f2552c',
    accentDark: '#9b1a0f',
    heroAuraGradient:
      'radial-gradient(ellipse 80% 55% at 50% 55%, rgba(205, 42, 26, 0.95) 0%, rgba(155, 26, 15, 0.75) 45%, rgba(60, 8, 4, 0.35) 75%, transparent 100%)',
    heroDiffusionGradient: 'linear-gradient(to right, transparent, rgba(184, 40, 26, 0.3), transparent)',
    ctaButtonGradient: 'linear-gradient(135deg, #eb442e 0%, #ea3829 100%)',
    ctaButtonHoverGradient: 'linear-gradient(135deg, #ff553f 0%, #ff4233 100%)',
    ctaShadow: '0 8px 30px rgba(235, 68, 46, 0.65)',
    ctaTextColor: 'text-white',
    badgeBg: 'rgba(234, 56, 41, 0.15)',
    badgeText: '#ea3829',
    badgeBorder: 'rgba(234, 56, 41, 0.3)',
    dotColor: '#ea3829',
    gradientDivider: 'linear-gradient(to right, #ea3829, #f2552c 40%, #e2e8f0 70%, transparent)',
    accentText: '#ea3829',
    accentBg: 'rgba(234, 56, 41, 0.12)',
    accentBorder: 'rgba(234, 56, 41, 0.25)',
    glowColor: 'rgba(234, 56, 41, 0.45)',
    selectionBg: '#ea3829',
    previewGradient: 'linear-gradient(135deg, #ea3829 0%, #f2552c 100%)',
  },
  violet: {
    id: 'violet',
    name: 'Electric Violet',
    tagline: 'Cyberpunk Hyper Violet & Neon Magenta (#8B5CF6 → #EC4899)',
    primary: '#8b5cf6',
    secondary: '#ec4899',
    accentDark: '#5b21b6',
    heroAuraGradient:
      'radial-gradient(ellipse 80% 55% at 50% 55%, rgba(139, 92, 246, 0.9) 0%, rgba(236, 72, 153, 0.65) 45%, rgba(60, 20, 90, 0.35) 75%, transparent 100%)',
    heroDiffusionGradient: 'linear-gradient(to right, transparent, rgba(139, 92, 246, 0.3), transparent)',
    ctaButtonGradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    ctaButtonHoverGradient: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
    ctaShadow: '0 8px 32px rgba(139, 92, 246, 0.6)',
    ctaTextColor: 'text-white',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    badgeText: '#a78bfa',
    badgeBorder: 'rgba(139, 92, 246, 0.3)',
    dotColor: '#8b5cf6',
    gradientDivider: 'linear-gradient(to right, #8b5cf6, #ec4899 40%, #e2e8f0 70%, transparent)',
    accentText: '#a78bfa',
    accentBg: 'rgba(139, 92, 246, 0.12)',
    accentBorder: 'rgba(139, 92, 246, 0.25)',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    selectionBg: '#8b5cf6',
    previewGradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan',
    tagline: 'Electric Cyan & Sapphire Cobalt Blue (#00D2FF → #3A7BD5)',
    primary: '#00d2ff',
    secondary: '#3a7bd5',
    accentDark: '#0369a1',
    heroAuraGradient:
      'radial-gradient(ellipse 80% 55% at 50% 55%, rgba(0, 210, 255, 0.88) 0%, rgba(58, 123, 213, 0.65) 45%, rgba(10, 40, 90, 0.35) 75%, transparent 100%)',
    heroDiffusionGradient: 'linear-gradient(to right, transparent, rgba(0, 210, 255, 0.3), transparent)',
    ctaButtonGradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
    ctaButtonHoverGradient: 'linear-gradient(135deg, #33dcff 0%, #5292e5 100%)',
    ctaShadow: '0 8px 32px rgba(0, 210, 255, 0.55)',
    ctaTextColor: 'text-black',
    badgeBg: 'rgba(0, 210, 255, 0.12)',
    badgeText: '#00d2ff',
    badgeBorder: 'rgba(0, 210, 255, 0.28)',
    dotColor: '#00d2ff',
    gradientDivider: 'linear-gradient(to right, #00d2ff, #3a7bd5 40%, #e2e8f0 70%, transparent)',
    accentText: '#00d2ff',
    accentBg: 'rgba(0, 210, 255, 0.12)',
    accentBorder: 'rgba(0, 210, 255, 0.25)',
    glowColor: 'rgba(0, 210, 255, 0.45)',
    selectionBg: '#00d2ff',
    previewGradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
  },
  amber: {
    id: 'amber',
    name: 'Solar Amber',
    tagline: 'Warm Solar Gold & Sunset Tangerine (#F59E0B → #F97316)',
    primary: '#f59e0b',
    secondary: '#f97316',
    accentDark: '#b45309',
    heroAuraGradient:
      'radial-gradient(ellipse 80% 55% at 50% 55%, rgba(245, 158, 11, 0.9) 0%, rgba(249, 115, 22, 0.7) 45%, rgba(80, 40, 5, 0.35) 75%, transparent 100%)',
    heroDiffusionGradient: 'linear-gradient(to right, transparent, rgba(245, 158, 11, 0.3), transparent)',
    ctaButtonGradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    ctaButtonHoverGradient: 'linear-gradient(135deg, #fbbf24 0%, #fb923c 100%)',
    ctaShadow: '0 8px 32px rgba(245, 158, 11, 0.55)',
    ctaTextColor: 'text-black',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    badgeText: '#f59e0b',
    badgeBorder: 'rgba(245, 158, 11, 0.28)',
    dotColor: '#f59e0b',
    gradientDivider: 'linear-gradient(to right, #f59e0b, #f97316 40%, #e2e8f0 70%, transparent)',
    accentText: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    accentBorder: 'rgba(245, 158, 11, 0.25)',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    selectionBg: '#f59e0b',
    previewGradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  },
};

export const DEFAULT_THEME_ID: ThemeId = 'design-hub';
