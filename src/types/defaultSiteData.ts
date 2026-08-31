import type { SiteDataState, FaqItemData } from './siteData';

export const DEFAULT_FAQS: FaqItemData[] = [
  {
    id: 'faq-1',
    question: 'How does your process work?',
    answer:
      'We start by analyzing your channel analytics, niche, and audience psychology. Once you submit a video concept or rough cut, we develop 2–3 high-converting packaging variations engineered for maximum CTR and mobile feed stopping power.',
  },
  {
    id: 'faq-2',
    question: 'How involved do I need to be?',
    answer:
      'As little or as much as you like. You can simply send us your video topic or raw face cuts and let our team handle concept ideation, 3D depth compositing, color grading, and typography—or collaborate on specific creative angles.',
  },
  {
    id: 'faq-3',
    question: 'Do you only do thumbnails?',
    answer:
      'We specialize in complete YouTube packaging—which includes custom thumbnail design, title psychology engineering, A/B split-testing variations, visual branding direction, and ongoing CTR optimization.',
  },
];

export const DEFAULT_SITE_DATA: SiteDataState = {
  navbar: {
    brandLine1: 'Vishu',
    brandLine2: 'Max',
    brandLogoImage: '',
    faviconUrl: '',
  },
  hero: {
    headlinePrefix: 'We make you believe in',
    headlineAccent: 'Power of packaging.',
    attributionPrefix: '—',
    attributionAuthor: 'Mr Beast*',
    viewsStat: 'We generated 80M+ views',
    ctaText: 'Book a free discovery call',
    ctaSubtext: 'Direct review by Vishal Gupta • No generic agency handoff',
  },
  proofLogos: [],
  thumbnails: [],
  testimonials: [],
  about: {
    badgeText: 'Available for Select Channel Partnerships',
    heading: 'About Vishal Gupta',
    bioParagraph1: "I'm a professional graphic designer focused on creating bold, engaging, and visually impactful designs that help brands and creators stand out.",
    bioParagraph2: "I work closely with creators and businesses to turn ideas into compelling visuals. From thumbnails and social media creatives to complete brand designs, I combine creativity, strategy, and attention to detail to deliver designs that get noticed.",
    viewsDriven: '80M+',
    turnaroundTime: '< 24 Hours',
    ctaText: "Let's talk",
    portraitImage: '',
    name: 'Vishal Gupta',
    roleTitle: 'Creative Graphic Designer',
    slotsRemaining: 2,
  },
  leaders: [],
  faqs: DEFAULT_FAQS,
  contact: {
    telegramUrl: 'https://t.me/vishumax',
    whatsappNumber: '+91 98765 43210',
    discordUsername: 'vishumax',
    email: 'contact@vishumax.in',
  },
  theme: 'design-hub',
};
