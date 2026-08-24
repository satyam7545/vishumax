import { ASSETS } from '../assets/assets';

export interface ThumbnailItem {
  id: string;
  title: string;
  category: string;
  views: string;
  ctrGain: string;
  duration: string;
  image?: string;
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
    title: 'Speak like Top 1%',
    category: 'Communication / Self-Improvement',
    views: '4.2M views',
    ctrGain: '+18.4% CTR',
    duration: '18:42',
    image: ASSETS.thumbnails.speakTop1,
    channel: 'The Art of Oratory',
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
    title: 'WHY TOPPERS CHOOSE RADIOLOGY?',
    category: 'Medical / Career Education',
    views: '2.8M views',
    ctrGain: '+21.2% CTR',
    duration: '22:15',
    image: ASSETS.thumbnails.radiology,
    channel: 'MedEd Pinnacle',
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
    title: 'EXTREME SKYDIVING POV!',
    category: 'Action / Adventure / Thrill',
    views: '6.7M views',
    ctrGain: '+27.5% CTR',
    duration: '14:08',
    image: ASSETS.thumbnails.skydiving,
    channel: 'Adrenaline Drop',
    niche: 'Extreme Sports & First Person POV',
    hook: 'Wide-angle fish-eye exhilaration with oxygen mask at 25,000 feet',
    beforeCtr: '6.4%',
    afterCtr: '17.6%',
    strategyBreakdown: [
      'Emphasized the genuine adrenaline facial expression with heightened micro-contrast',
      'Curved sky horizon with vibrant cloud layer for depth perception',
      'Red warning pill badge "THEY SAID DON\'T DO IT!" for extreme urgency'
    ]
  },
  {
    id: 'thumb-4',
    title: 'CA IS A TRAP?',
    category: 'Finance / Career Exposé',
    views: '3.9M views',
    ctrGain: '+19.8% CTR',
    duration: '26:50',
    image: ASSETS.thumbnails.caTrap,
    channel: 'Commerce Reality',
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
    title: '20s are Doomed',
    category: 'Philosophy / Career Truths',
    views: '5.1M views',
    ctrGain: '+23.6% CTR',
    duration: '31:12',
    image: ASSETS.thumbnails.doomed25,
    channel: 'Raw Mindset',
    niche: 'Life Strategy & Young Professionals',
    hook: 'Piercing monochrome gaze + finger pointing directly at the viewer',
    beforeCtr: '4.9%',
    afterCtr: '16.5%',
    strategyBreakdown: [
      '100% black and white contrast that disrupts the colorful YouTube browse feed',
      'Handwritten distressed typography font to emphasize authenticity over corporate polish',
      'Subheadline "THE TRUTH NO ONE WANTS TO HEAR" to provoke defensive curiosity'
    ]
  },
  {
    id: 'thumb-6',
    title: 'CURE CONSTIPATION IN 2 MINUTES',
    category: 'Health / Gut Science',
    views: '8.4M views',
    ctrGain: '+31.0% CTR',
    duration: '09:45',
    isCustomGraphic: true,
    graphicType: 'constipation',
    channel: 'Holistic Gut MD',
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
    title: 'AIR 1 Turned Educator Now Makes Crores',
    category: 'EdTech / Creator Economy',
    views: '4.7M views',
    ctrGain: '+24.8% CTR',
    duration: '24:19',
    isCustomGraphic: true,
    graphicType: 'educator',
    channel: 'Founder Talks',
    niche: 'EdTech Scalability & High Earners',
    hook: 'Smiling doctor in surgical scrubs with explosive career transition milestone',
    beforeCtr: '5.8%',
    afterCtr: '18.4%',
    strategyBreakdown: [
      'Juxtaposition of sterile clinical scrubs with explosive creator revenue milestone',
      'Golden highlight badges with verified ranking badge ("AIR 1")',
      'High-energy studio glow with aspirational modern campus backdrop'
    ]
  },
  {
    id: 'thumb-8',
    title: 'Inside Second Largest Company of India',
    category: 'Corporate / Business Documentary',
    views: '3.6M views',
    ctrGain: '+17.9% CTR',
    duration: '38:04',
    isCustomGraphic: true,
    graphicType: 'indianoil',
    channel: 'Inside Mega Corporations',
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
