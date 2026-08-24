export interface LeaderItem {
  id: string;
  name: string;
  role: string;
  channel: string;
  ctrGain: string;
  image: string;
  quote: string;
  featuredTopic: string;
}

export const LEADERS_DATA: LeaderItem[] = [
  {
    id: 'leader-1',
    name: 'Ravi Kapoor',
    role: 'Strategic Consultant & Mentor',
    channel: 'Ravi Kapoor (650K)',
    ctrGain: '+24.8% CTR',
    image: '/leaders/ravi_kapoor.png',
    quote: 'Their psychological packaging transformed our click-through velocity across all long-form masterclasses.',
    featuredTopic: 'Strategic Mentorship & Leadership',
  },
  {
    id: 'leader-2',
    name: 'Divya Jain',
    role: 'Founder & Keynote Speaker',
    channel: 'Leadership & Impact (420K)',
    ctrGain: '+19.5% CTR',
    image: '/leaders/divya_jain.png',
    quote: 'Every thumbnail communicates prestige and authority while compelling viewers to stop and click.',
    featuredTopic: 'Enterprise Leadership & Vision',
  },
  {
    id: 'leader-3',
    name: 'Dr. Nachiket Bhatia',
    role: 'CEO & Medical Media Entrepreneur',
    channel: 'Medical Pulse (1.2M)',
    ctrGain: '+28.4% CTR',
    image: '/leaders/nachiket_bhatia.png',
    quote: 'Our retention and top-of-funnel CTR skyrocketed after switching to their high-intent packaging system.',
    featuredTopic: 'Health Tech & Medical Scaling',
  },
  {
    id: 'leader-4',
    name: 'Dr. Shubham Vatsya',
    role: 'Senior Consultant Gastroenterologist',
    channel: 'GI Clinical Insights (850K)',
    ctrGain: '+33.2% CTR',
    image: '/leaders/shubham_vatsya.png',
    quote: 'They translate complex clinical subjects into visually irresistible thumbnails that drive millions of views.',
    featuredTopic: 'Clinical Science & Public Health',
  },
  {
    id: 'leader-5',
    name: 'Dr Ramnik Sabharwal',
    role: 'Senior Medical Specialist',
    channel: 'Health & Wellness (540K)',
    ctrGain: '+22.1% CTR',
    image: '/leaders/ramnik_sabharwal.png',
    quote: 'The clarity, color hierarchy, and emotional pull of each concept has made a massive difference to our reach.',
    featuredTopic: 'Integrative Wellness & Medicine',
  },
  {
    id: 'leader-6',
    name: 'Bhunesh Sharma',
    role: 'Educator & Tech Creator',
    channel: 'Tech & Scale (980K)',
    ctrGain: '+31.6% CTR',
    image: '/leaders/bhunesh_sharma.png',
    quote: 'Working with them took our average impressions from modest numbers to multiple viral recommendations.',
    featuredTopic: 'Technology & EdTech Scaling',
  },
  {
    id: 'leader-7',
    name: 'Dr. Gayathri Rathod',
    role: 'Physician & Academic Keynote',
    channel: 'Clinical Rounds (620K)',
    ctrGain: '+26.7% CTR',
    image: '/leaders/gayathri_rathod.png',
    quote: 'Deliberate, high-converting thumbnail compositions that preserve clinical integrity and trust.',
    featuredTopic: 'Preventive Healthcare & Academia',
  },
  {
    id: 'leader-8',
    name: 'Dr. Pulak Vatsya',
    role: 'Surgeon & Academic Specialist',
    channel: 'Surgical Masterclasses (1.1M)',
    ctrGain: '+35.4% CTR',
    image: '/leaders/pulak_vatsya.png',
    quote: 'The speed, precision, and visual depth they deliver has made them our indispensable creative partner.',
    featuredTopic: 'Advanced Surgical Science',
  },
];
