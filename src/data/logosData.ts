export interface BrandLogo {
  id: string;
  name: string;
  subtext?: string;
  type: 'text' | 'svg';
  badge?: string;
  logo?: string;
}

export const BRAND_LOGOS: BrandLogo[] = [
  {
    id: 'logo-1',
    name: 'SRIDHAR IAS',
    subtext: 'ACADEMY',
    type: 'text',
    badge: '1.2M+',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
  },
  {
    id: 'logo-2',
    name: 'VEDIC',
    subtext: 'SCIENCE LABS',
    type: 'text',
    badge: '850K',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
  },
  {
    id: 'logo-3',
    name: '24/7',
    subtext: 'MEDIA NETWORK',
    type: 'text',
    badge: '4.5M',
    logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
  },
  {
    id: 'logo-4',
    name: 'InMobi',
    subtext: 'INSIGHTS',
    type: 'text',
    badge: 'Global',
    logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop',
  },
  {
    id: 'logo-5',
    name: 'BIGNAME',
    subtext: 'STUDIOS',
    type: 'text',
    badge: '5.8M',
    logo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop',
  },
  {
    id: 'logo-6',
    name: 'SCALER',
    subtext: 'ACADEMY',
    type: 'text',
    badge: '950K',
    logo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop',
  },
  {
    id: 'logo-7',
    name: 'MEDTECH',
    subtext: 'GLOBAL',
    type: 'text',
    badge: '2.1M',
    logo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop',
  },
  {
    id: 'logo-8',
    name: 'REDPEAK',
    subtext: 'PRODUCTIONS',
    type: 'text',
    badge: '3.4M',
    logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  },
];
