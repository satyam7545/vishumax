export interface CMSUser {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at?: string;
}

export interface CMSClient {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  image?: string;
  description?: string;
  audience?: string;
  category?: string;
  social_url?: string;
  badge?: string;
  subtext?: string;
  featured: boolean;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSProject {
  id: string;
  title: string;
  slug: string;
  description?: string;
  client_id?: string;
  category: string;
  cover_image: string;
  avatar?: string;
  link?: string;
  video_duration: string;
  views_count: string;
  ctr_before: string;
  ctr_after: string;
  ctr_gain: string;
  channel: string;
  niche: string;
  hook: string;
  strategy_breakdown: string[];
  graphic_type?: 'constipation' | 'educator' | 'indianoil' | 'finance' | 'custom';
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CMSTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
  channel: string;
  subscribers: string;
  detailed_bio: string;
  impact_metrics: string[];
  stats: {
    label: string;
    value: string;
  }[];
  collaboration_duration?: string;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CMSLeader {
  id: string;
  name: string;
  role: string;
  channel: string;
  ctr_gain: string;
  image: string;
  quote: string;
  featured_topic: string;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSService {
  id: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
  sort_order: number;
  published: boolean;
}

export interface CMSContactInquiry {
  id: number;
  name: string;
  email: string;
  company?: string;
  channel_url: string;
  project_type: string;
  current_ctr: string;
  monthly_drops: string;
  budget?: string;
  message: string;
  status: 'new' | 'reviewed' | 'contacted' | 'archived';
  created_at: string;
}

export interface CMSSiteSettings {
  // Brand & Nav
  brandLine1: string;
  brandLine2: string;
  brandLogoImage?: string;
  faviconUrl?: string;
  
  // Hero
  heroHeadlinePrefix: string;
  heroHeadlineAccent: string;
  heroAttributionPrefix: string;
  heroAttributionAuthor: string;
  heroAttributionQuote?: string;
  heroViewsStat: string;
  heroCtaText: string;
  heroCtaSubtext: string;
  
  // CTA Banner
  ctaBannerHeadline?: string;
  ctaBannerSubtext?: string;
  ctaBannerButtonText?: string;
  
  // About / Profile
  aboutBadgeText: string;
  aboutHeading: string;
  aboutBioParagraph1: string;
  aboutBioParagraph2: string;
  aboutViewsDriven: string;
  aboutTurnaroundTime: string;
  aboutCtaText: string;
  aboutPortraitImage: string;
  aboutName: string;
  aboutRoleTitle: string;
  
  // Availability & Partnerships
  availabilityStatus: string;
  availabilityNote: string;
  slotsRemaining: number;

  // Contact Details & Messaging Channels
  contactEmail: string;
  calendarBookingUrl: string;
  socialTelegram?: string;
  socialWhatsapp?: string;
  socialDiscord?: string;
  socialTwitter: string;
  socialYoutube: string;
  socialLinkedin: string;
  socialInstagram: string;

  // SEO Metadata
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoOgImage: string;
  seoCanonicalUrl: string;

  // Homepage Section Visibility Toggles
  sectionHeroVisible: boolean;
  sectionProofTickerVisible: boolean;
  sectionProjectsVisible: boolean;
  sectionTestimonialsVisible: boolean;
  sectionAboutVisible: boolean;
  sectionLeadersVisible: boolean;

  // Visual Theme
  theme?: string;
}

export interface CMSPublicPayload {
  settings: CMSSiteSettings;
  clients: CMSClient[];
  projects: CMSProject[];
  testimonials: CMSTestimonial[];
  leaders: CMSLeader[];
  services: CMSService[];
}
