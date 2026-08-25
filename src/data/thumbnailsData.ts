import { ASSETS } from '../assets/assets';

export interface ThumbnailItem {
  id: string;
  title: string;
  category: string;
  views: string;
  ctrGain: string;
  duration: string;
  image?: string;
  avatar?: string;
  isCustomGraphic?: boolean;
  graphicType?: 'constipation' | 'educator' | 'indianoil' | 'finance';
  channel: string;
  niche: string;
  hook: string;
  beforeCtr: string;
  afterCtr: string;
  strategyBreakdown: string[];
}

export const THUMBNAILS_DATA: ThumbnailItem[] = [
  // ROW 1
  {
    id: 'thumb-1',
    title: 'Speak like Top 1% Leaders & Executives',
    category: 'Podcast/Interviews',
    views: '4.2M Views',
    ctrGain: '+18.4% CTR',
    duration: '18:42',
    image: ASSETS.thumbnails.speakTop1,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    channel: '@OratoryProtocol',
    niche: 'Public Speaking & Executive Presence',
    hook: 'Curiosity gap with dark moody library aesthetic + high contrast gold headline',
    beforeCtr: '4.8%',
    afterCtr: '14.2%',
    strategyBreakdown: [
      'Eliminated visual clutter and replaced busy studio setup with an intimate library focal point',
      'Engineered a gold gradient typography hierarchy with a subtle neon glow',
      'Positioned the microphone arm to naturally guide the eye to the facial expression'
    ]
  },
  {
    id: 'thumb-2',
    title: 'Why Toppers Choose Radiology in 2026?',
    category: 'Health',
    views: '2.8M Views',
    ctrGain: '+21.2% CTR',
    duration: '22:15',
    image: ASSETS.thumbnails.radiology,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    channel: '@MedEdPinnacle',
    niche: 'NEET PG & Medical Specializations',
    hook: 'Vibrant MRI tech backdrop with open-hand gesture creating instant intrigue',
    beforeCtr: '5.1%',
    afterCtr: '16.3%',
    strategyBreakdown: [
      'Split-screen visual depth with glowing 3D MRI brain scan graphics',
      'Dual-color typography (White + Vibrant Yellow) for maximum mobile legibility',
      'Warm, inviting doctor expression to reduce cognitive resistance'
    ]
  },
  {
    id: 'thumb-3',
    title: 'Inside India\'s Floating Slum (Living on Gutter)',
    category: 'Documentary',
    views: '9.5M Views',
    ctrGain: '+27.5% CTR',
    duration: '14:08',
    image: ASSETS.thumbnails.skydiving,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    channel: '@KKCreate',
    niche: 'Documentary & Investigative',
    hook: 'Dramatic contrast framing with real environmental storytelling',
    beforeCtr: '6.4%',
    afterCtr: '17.6%',
    strategyBreakdown: [
      'Emphasized the genuine human expression with heightened micro-contrast',
      'Cinematic aerial background establishing instant geography and curiosity',
      'Clear high-intent topic packaging with zero visual clutter'
    ]
  },
  {
    id: 'thumb-4',
    title: 'Is CA a Career Trap in 2026?',
    category: 'Finance',
    views: '3.9M Views',
    ctrGain: '+19.8% CTR',
    duration: '26:50',
    image: ASSETS.thumbnails.caTrap,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    channel: '@FinUnfiltered',
    niche: 'Chartered Accountancy & Career Truths',
    hook: 'Dramatic sea of upward-looking students under suspenseful spotlight',
    beforeCtr: '5.2%',
    afterCtr: '15.0%',
    strategyBreakdown: [
      'Dark cinematic crowd lighting evoking emotional tension and shared experience',
      'Bold textured red typographic treatment mimicking high-stakes thriller posters',
      'Zero unnecessary decorative graphics—raw psychological resonance'
    ]
  },

  // ROW 2
  {
    id: 'thumb-5',
    title: 'The Crazy Case of Tech Giants Exposed',
    category: 'Tech',
    views: '5.1M Views',
    ctrGain: '+23.6% CTR',
    duration: '31:12',
    image: ASSETS.thumbnails.doomed25,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    channel: '@TechBreakdown',
    niche: 'Tech Strategy & Industry Exposé',
    hook: 'Piercing monochrome gaze + finger pointing directly at the viewer',
    beforeCtr: '4.9%',
    afterCtr: '16.5%',
    strategyBreakdown: [
      '100% black and white contrast that disrupts the colorful YouTube browse feed',
      'Handwritten distressed typography font to emphasize authenticity over corporate polish',
      'Subheadline to provoke defensive curiosity'
    ]
  },
  {
    id: 'thumb-6',
    title: 'Cure Gut Issues in 2 Minutes (Doctor Protocol)',
    category: 'Health',
    views: '8.4M Views',
    ctrGain: '+31.0% CTR',
    duration: '09:45',
    isCustomGraphic: true,
    graphicType: 'constipation',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop',
    channel: '@HolisticGutMD',
    niche: 'Digestive Health & Rapid Relief',
    hook: 'Clear problem-to-solution diagram with glowing thermal gut visual',
    beforeCtr: '6.1%',
    afterCtr: '25.1%',
    strategyBreakdown: [
      'Immediate pain-point resonance with split before/after anatomical illustration',
      'Bright cyan and orange contrasting badges for extreme clickability on dark mode',
      'Time-based promise ("2 MINUTES") backed by accredited medical posture'
    ]
  },
  {
    id: 'thumb-7',
    title: 'Inside India\'s Biggest Floating City!',
    category: 'Travel',
    views: '4.4M Views',
    ctrGain: '+24.8% CTR',
    duration: '24:19',
    image: ASSETS.thumbnails.speakTop1,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
    channel: '@KKCreate',
    niche: 'Travel & Exploration',
    hook: 'Cinematic waterfront portrait with architectural discovery hook',
    beforeCtr: '5.8%',
    afterCtr: '18.4%',
    strategyBreakdown: [
      'Rich cinematic golden hour grade with crisp subject separation',
      'Natural curiosity prompt framing uncharted culture and engineering',
      'Optimized for mobile browse thumbnails'
    ]
  },
  {
    id: 'thumb-8',
    title: 'Inside 2nd Largest Company of India (Mega Refinery)',
    category: 'Documentary',
    views: '12M Views',
    ctrGain: '+17.9% CTR',
    duration: '38:04',
    isCustomGraphic: true,
    graphicType: 'indianoil',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    channel: '@MegaCorporations',
    niche: 'Energy Sector & National Giants',
    hook: 'Executive in navy suit presenting monumental refinery infrastructure',
    beforeCtr: '4.5%',
    afterCtr: '14.9%',
    strategyBreakdown: [
      'Official brand logo framing (IndianOil) with industrial facility architecture',
      'Executive hand gesture drawing the viewer into the exclusive corporate access',
      'Crisp cinematic color grading matching Netflix-style business documentaries'
    ]
  }
];
