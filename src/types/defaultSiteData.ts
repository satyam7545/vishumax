import type { SiteDataState, FaqItemData } from './siteData';
import { THUMBNAILS_DATA } from '../data/thumbnailsData';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';
import { LEADERS_DATA } from '../data/leadersData';
import { BRAND_LOGOS } from '../data/logosData';
import { ASSETS } from '../assets/assets';

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
    brandLogoImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop',
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
  proofLogos: BRAND_LOGOS,
  thumbnails: THUMBNAILS_DATA,
  testimonials: TESTIMONIALS_DATA,
  about: {
    badgeText: 'Available for Select Channel Partnerships',
    heading: 'About Ravi Franklin',
    bioParagraph1: "I'm a professional graphic designer with 10+ years of industry experience and a specialist in YouTube thumbnail design for the past 3+ years.",
    bioParagraph2: "I've worked with creators across every niche, delivering high-quality, eye-catching thumbnails that boost click-through rates. I'm known for fast turnaround, friendly communication, and designs that balance creativity with strategy. Let's create something that stands out.",
    viewsDriven: '80M+',
    turnaroundTime: '< 24 Hours',
    ctaText: "Let's talk",
    portraitImage: ASSETS.raviPortrait,
    name: 'Ravi Franklin',
    roleTitle: 'Lead Packaging Strategist',
  },
  leaders: LEADERS_DATA,
  faqs: DEFAULT_FAQS,
  theme: 'design-hub',
};
