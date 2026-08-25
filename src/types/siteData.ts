export interface HeroConfig {
  headlinePrefix: string;
  headlineAccent: string;
  attributionPrefix: string;
  attributionAuthor: string;
  attributionQuote?: string;
  viewsStat: string;
  ctaText: string;
  ctaSubtext: string;
}

export interface NavbarConfig {
  brandLine1: string;
  brandLine2: string;
  brandLogoImage?: string;
}

export interface AboutConfig {
  badgeText: string;
  heading: string;
  bioParagraph1: string;
  bioParagraph2: string;
  viewsDriven: string;
  turnaroundTime: string;
  ctaText: string;
  portraitImage: string;
  name: string;
  roleTitle: string;
  slotsRemaining?: number;
}

export interface ThumbnailItemData {
  id: string;
  title: string;
  category: string;
  views: string;
  ctrGain: string;
  duration: string;
  channel: string;
  niche: string;
  hook: string;
  beforeCtr: string;
  afterCtr: string;
  strategyBreakdown: string[];
  image?: string;
  avatar?: string;
  link?: string;
  graphicType?: 'constipation' | 'educator' | 'indianoil' | 'finance' | 'custom';
  isCustomGraphic?: boolean;
}

export interface TestimonialStat {
  label: string;
  value: string;
}

export interface TestimonialItemData {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  rating?: number;
  channel?: string;
  subscribers?: string;
  detailedBio?: string;
  impactMetrics?: string[];
  stats?: TestimonialStat[];
  collaborationDuration?: string;
}

export interface LeaderItemData {
  id: string;
  name: string;
  role: string;
  channel: string;
  ctrGain: string;
  image: string;
  quote: string;
  featuredTopic: string;
}

export interface BrandLogoItem {
  id: string;
  name: string;
  subtext?: string;
  badge?: string;
  logo?: string;
}

export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
}

export interface ContactConfig {
  telegramUrl: string;
  whatsappNumber: string;
  discordUsername: string;
  email: string;
}

import type { ThemeId } from './theme';

export interface SiteDataState {
  navbar: NavbarConfig;
  hero: HeroConfig;
  proofLogos: BrandLogoItem[];
  thumbnails: ThumbnailItemData[];
  testimonials: TestimonialItemData[];
  about: AboutConfig;
  leaders: LeaderItemData[];
  faqs?: FaqItemData[];
  contact?: ContactConfig;
  theme?: ThemeId;
}
