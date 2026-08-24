import { ASSETS } from '../assets/assets';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  stats: {
    label: string;
    value: string;
  }[];
  detailedBio: string;
  channel: string;
  subscribers: string;
  impactMetrics: string[];
  collaborationDuration: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'GENE ZOLE',
    role: 'E-commerce expert',
    company: 'E-com Scaling Network',
    avatar: ASSETS.testimonials.geneZole.avatar,
    quote: 'I have already worked with several thumbnail designers, but none had such a profound understanding as VishuMax. Not only is they are super cool people, but they enrich our YouTube channel with incredible thumbnails. Clear recommendation from me!',
    rating: 5,
    stats: [
      { label: 'CTR Growth', value: '+204%' },
      { label: 'Total Views', value: '24.5M+' },
      { label: 'Videos Done', value: '48+' }
    ],
    detailedBio: 'Gene Zole is a leading e-commerce strategist helping 7-figure digital brands scale organic acquisition through YouTube documentary-style breakdowns.',
    channel: '@GeneZoleOfficial',
    subscribers: '1.2M Subscribers',
    impactMetrics: [
      'Increased average CTR from 4.2% to 12.8% within 90 days',
      'Engineered the packaging for two 5M+ viral breakout videos',
      'Streamlined concept-to-render pipeline to sub-24hr delivery'
    ],
    collaborationDuration: 'Partnered since 2024 (18 months)'
  },
  {
    id: 'test-2',
    name: 'CARTER TILLER',
    role: 'SVP, Executive Producer',
    company: 'BigName Media',
    avatar: ASSETS.testimonials.carterTiller.avatar,
    quote: "I've worked with VishuMax for years now across numerous channels. They're a great collaborator. They understand our vision and provides insight we could not have. They are true creative professionals and we are very happy with the results.",
    rating: 5,
    stats: [
      { label: 'Network Views', value: '100M+' },
      { label: 'Channels', value: '8 Shows' },
      { label: 'Avg CTR', value: '19.5%' }
    ],
    detailedBio: 'Carter Tiller oversees original digital productions and multi-host series at BigName Media, managing episodic YouTube entertainment formats.',
    channel: 'BigName Productions',
    subscribers: '5.8M Network Reach',
    impactMetrics: [
      'Standardized multi-channel brand guidelines with tailored thumbnail DNA',
      'Consistent top 3 browse ranking across tech and entertainment niches',
      'A/B test win rate exceeding 88% against competing internal designs'
    ],
    collaborationDuration: 'Partnered since 2023 (3+ years)'
  },
  {
    id: 'test-3',
    name: 'BRIAN PHOELKE',
    role: 'YouTube Strategist',
    company: 'GrowthLab Media',
    avatar: ASSETS.testimonials.brianPhoelke.avatar,
    quote: 'I have worked with a lot of thumbnail designers before but none that understand what is most important with people click but VishuMax NAILED it every time with a rising CTR!',
    rating: 5,
    stats: [
      { label: 'A/B Win Rate', value: '92%' },
      { label: 'Peak Video', value: '9.4M' },
      { label: 'Avg CTR Uplift', value: '+31.2%' }
    ],
    detailedBio: 'Brian Phoelke advises tier-1 educational and business creators on retention optimization, thumbnail psychology, and algorithmic browse velocity.',
    channel: 'GrowthLab Advisor',
    subscribers: '850K Subscribers',
    impactMetrics: [
      'Pioneered the "single curiosity focal point" visual framework',
      'Achieved peak CTR of 18.6% on broad-audience longform documentaries',
      'Reduced packaging iteration cycle time by 60%'
    ],
    collaborationDuration: 'Partnered since 2024 (2 years)'
  }
];
