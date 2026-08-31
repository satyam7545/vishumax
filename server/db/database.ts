import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dataDir = path.resolve(process.cwd(), 'server', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'site.db');
const db = new Database(dbPath);

// Enable WAL mode & foreign keys for high performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. Admins table (Admin auth)
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Super Admin',
      role TEXT NOT NULL DEFAULT 'admin',
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
  `);

  // Migrate legacy users table if present
  try {
    const legacyTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (legacyTable) {
      db.exec(`
        INSERT OR IGNORE INTO admins (id, email, password_hash, name, role, created_at, updated_at)
        SELECT id, email, password_hash, name, role, created_at, updated_at FROM users;
      `);
    }
  } catch {
    // Ignore migration error if table does not exist
  }

  // 2. Clients / Brand Proof table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      logo TEXT,
      image TEXT,
      description TEXT,
      audience TEXT,
      category TEXT,
      social_url TEXT,
      badge TEXT,
      subtext TEXT,
      featured INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_clients_published ON clients(published, sort_order);
  `);

  // 3. Projects / YouTube Thumbnails table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      client_id TEXT,
      category TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      avatar TEXT,
      link TEXT,
      video_duration TEXT DEFAULT '10:00',
      views_count TEXT DEFAULT '1M views',
      ctr_before TEXT DEFAULT '4.0%',
      ctr_after TEXT DEFAULT '12.0%',
      ctr_gain TEXT DEFAULT '+18.0%',
      channel TEXT DEFAULT 'Channel',
      niche TEXT DEFAULT 'Tech & Growth',
      hook TEXT,
      strategy_breakdown TEXT, -- JSON array string
      graphic_type TEXT DEFAULT 'custom',
      featured INTEGER DEFAULT 1,
      published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published, sort_order);
  `);

  // Ensure avatar and link columns exist if table already existed
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN avatar TEXT;`);
  } catch {}
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN link TEXT;`);
  } catch {}

  // 4. Testimonials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      quote TEXT NOT NULL,
      avatar TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      channel TEXT,
      subscribers TEXT,
      detailed_bio TEXT,
      impact_metrics TEXT, -- JSON array string
      stats TEXT, -- JSON array string
      collaboration_duration TEXT DEFAULT 'Partnered since 2024',
      published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published, sort_order);
  `);

  // 5. Industry Leaders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leaders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      channel TEXT NOT NULL,
      ctr_gain TEXT NOT NULL,
      image TEXT NOT NULL,
      quote TEXT NOT NULL,
      featured_topic TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_leaders_published ON leaders(published, sort_order);
  `);

  // 6. Services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'Sparkles',
      deliverables TEXT NOT NULL, -- JSON array string
      sort_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1
    );
  `);

  // 7. Contact Inquiries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      channel_url TEXT,
      project_type TEXT,
      current_ctr TEXT,
      monthly_drops TEXT,
      budget TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_inquiries_status ON contact_inquiries(status);
  `);

  // 8. Site Settings table (Key/Value Document Store)
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // -------------------------------------------------------------
  // SEED INITIAL DATA IF TABLES ARE EMPTY
  // -------------------------------------------------------------

  // A. Seed Admin User
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
  if (adminCount.count === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    db.prepare(`
      INSERT INTO admins (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run('admin@vishumax.in', hash, 'Vishal Gupta', 'superadmin');
    console.log('✅ [Database] Seeded Super Admin: admin@vishumax.in / admin123');
  }

  // B. Seed Default Settings
  const settingsRow = db.prepare('SELECT value FROM site_settings WHERE key = ?').get('global_settings');
  if (!settingsRow) {
    const defaultSettings = {
      brandLine1: 'Vishu',
      brandLine2: 'Max',
      brandLogoImage: '',
      faviconUrl: '',
      heroHeadlinePrefix: 'We make you believe in',
      heroHeadlineAccent: 'Power of packaging.',
      heroAttributionPrefix: '—',
      heroAttributionAuthor: 'Mr Beast*',
      heroAttributionQuote: "“If people don't click, so you want to give them something to click.”",
      heroViewsStat: 'We generated 80M+ views',
      heroCtaText: 'Book a free discovery call',
      heroCtaSubtext: 'Direct review by Vishal Gupta • No generic agency handoff',
      aboutBadgeText: 'Available for Select Channel Partnerships',
      aboutHeading: 'About Vishal Gupta',
      aboutBioParagraph1: "I'm a professional graphic designer focused on creating bold, engaging, and visually impactful designs that help brands and creators stand out.",
      aboutBioParagraph2: "I work closely with creators and businesses to turn ideas into compelling visuals. From thumbnails and social media creatives to complete brand designs, I combine creativity, strategy, and attention to detail to deliver designs that get noticed.",
      aboutViewsDriven: '80M+',
      aboutTurnaroundTime: '< 24 Hours',
      aboutCtaText: "Let's talk",
      aboutPortraitImage: '/assets/images/ravi_franklin_portrait_1787307325661.jpg',
      aboutName: 'Vishal Gupta',
      aboutRoleTitle: 'Creative Graphic Designer',
      availabilityStatus: 'Available for Select Partnerships',
      availabilityNote: 'Accepting 2 new YouTube creator channels for Q3 retainer packaging.',
      slotsRemaining: 2,
      contactEmail: 'contact@vishumax.in',
      calendarBookingUrl: 'https://cal.com/vishumax/discovery',
      socialTelegram: 'https://t.me/vishumax',
      socialWhatsapp: '9065033165',
      socialDiscord: 'vishumax',
      socialTwitter: 'https://twitter.com',
      socialYoutube: 'https://youtube.com',
      socialLinkedin: 'https://linkedin.com',
      socialInstagram: 'https://instagram.com',
      seoTitle: 'VishuMax | High-CTR YouTube Packaging & Graphic Design',
      seoDescription: 'High-converting YouTube packaging agency. We create thumbnails for channels generating 80M+ views with proven CTR optimization.',
      seoKeywords: 'youtube thumbnails, ctr optimization, youtube packaging, thumbnail designer, youtube growth, vishumax',
      seoOgImage: '/assets/images/ravi_franklin_portrait_1787307325661.jpg',
      seoCanonicalUrl: 'https://vishumax.in',
      sectionHeroVisible: true,
      sectionProofTickerVisible: true,
      sectionProjectsVisible: true,
      sectionTestimonialsVisible: true,
      sectionAboutVisible: true,
      sectionLeadersVisible: true,
    };

    db.prepare(`
      INSERT INTO site_settings (key, value)
      VALUES ('global_settings', ?)
    `).run(JSON.stringify(defaultSettings));
  }

  // C. Seed Clients / Brand Logos
  const clientCount = db.prepare('SELECT COUNT(*) as count FROM clients').get() as { count: number };
  if (clientCount.count === 0) {
    const initialClients = [
      { id: 'client-1', name: 'SRIDHAR IAS', slug: 'sridhar-ias', subtext: 'ACADEMY', badge: '1.2M', logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', sort_order: 1 },
      { id: 'client-2', name: 'VEDIC', slug: 'vedic', subtext: 'WELLNESS', badge: '850K', logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', sort_order: 2 },
      { id: 'client-3', name: '24/7', slug: 'twenty-four-seven', subtext: 'MEDIA', badge: '2.4M', logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', sort_order: 3 },
      { id: 'client-4', name: 'InMobi', slug: 'inmobi', subtext: 'TECH', badge: '500K+', logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop', sort_order: 4 },
      { id: 'client-5', name: 'BIGNAME', slug: 'bigname', subtext: 'STUDIOS', badge: '3.1M', logo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop', sort_order: 5 },
      { id: 'client-6', name: 'SCALER', slug: 'scaler', subtext: 'EDTECH', badge: '1.8M', logo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop', sort_order: 6 },
      { id: 'client-7', name: 'MEDTECH', slug: 'medtech', subtext: 'HEALTH', badge: '920K', logo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop', sort_order: 7 },
      { id: 'client-8', name: 'REDPEAK', slug: 'redpeak', subtext: 'GROWTH', badge: '4.5M', logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', sort_order: 8 },
    ];

    const insertClient = db.prepare(`
      INSERT INTO clients (id, name, slug, subtext, badge, logo, sort_order, published, featured)
      VALUES (@id, @name, @slug, @subtext, @badge, @logo, @sort_order, 1, 1)
    `);

    for (const client of initialClients) {
      insertClient.run(client);
    }
  }

  // D. Seed Projects / Thumbnails
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  if (projectCount.count === 0) {
    const initialProjects = [
      {
        id: 'thumb-1',
        title: 'How to Speak Like the Top 1%',
        slug: 'how-to-speak-like-the-top-1-percent',
        category: 'Communication / Psychology',
        cover_image: '/assets/images/thumb_speak_top1_1787307474743.jpg',
        video_duration: '14:28',
        views_count: '2.4M views',
        ctr_before: '4.8%',
        ctr_after: '14.2%',
        ctr_gain: '+19.4% CTR',
        channel: 'Leadership Protocol',
        niche: 'Self Improvement',
        hook: 'Cognitive contrast: confident speaker posture with high-impact serif typography triggering instant curiosity.',
        strategy_breakdown: JSON.stringify([
          'Isolated subject extraction with warm rim lighting',
          'High readability dual-color text overlay',
          'Optimized for mobile dark mode feeds'
        ]),
        graphic_type: 'custom',
        sort_order: 1
      },
      {
        id: 'thumb-2',
        title: 'Why Toppers Choose Radiology?',
        slug: 'why-toppers-choose-radiology',
        category: 'Medical / Career Education',
        cover_image: '/assets/images/thumb_radiology_1787307494637.jpg',
        video_duration: '18:45',
        views_count: '1.8M views',
        ctr_before: '3.9%',
        ctr_after: '12.8%',
        ctr_gain: '+22.8% CTR',
        channel: 'DocTalk Academy',
        niche: 'Medical Sciences',
        hook: 'MRI scan visual hook combined with career salary curiosity gap.',
        strategy_breakdown: JSON.stringify([
          'Medical imaging glow accent overlay',
          'Doctor authority cue in scrubs',
          'Clean negative space composition'
        ]),
        graphic_type: 'custom',
        sort_order: 2
      },
      {
        id: 'thumb-3',
        title: 'Extreme Skydiving POV (Narrow Escape)',
        slug: 'extreme-skydiving-pov',
        category: 'Adventure / Action Sports',
        cover_image: '/assets/images/thumb_skydiving_1787307518348.jpg',
        video_duration: '09:12',
        views_count: '5.1M views',
        ctr_before: '6.1%',
        ctr_after: '18.4%',
        ctr_gain: '+20.1% CTR',
        channel: 'Altitude Junkies',
        niche: 'Action & Thrill',
        hook: 'Adrenaline POV framing with motion blur and depth perspective.',
        strategy_breakdown: JSON.stringify([
          'Dynamic wide angle lens distortion',
          'Vivid blue/orange contrast grade',
          'High-stakes facial expression hook'
        ]),
        graphic_type: 'custom',
        sort_order: 3
      },
      {
        id: 'thumb-4',
        title: 'Is CA a Trap in 2026?',
        slug: 'is-ca-a-trap-in-2026',
        category: 'Finance / Career Truth',
        cover_image: '/assets/images/thumb_ca_trap_1787307541561.jpg',
        video_duration: '22:10',
        views_count: '3.2M views',
        ctr_before: '5.2%',
        ctr_after: '16.7%',
        ctr_gain: '+22.1% CTR',
        channel: 'FinUnfiltered',
        niche: 'Finance & Career',
        hook: 'Controversial contrarian hook challenging conventional professional beliefs.',
        strategy_breakdown: JSON.stringify([
          'Dramatic red/black atmospheric grading',
          'Stamp badge texture effect',
          'Provocative question typography hierarchy'
        ]),
        graphic_type: 'custom',
        sort_order: 4
      },
      {
        id: 'thumb-5',
        title: 'Why Your 20s are Doomed',
        slug: 'why-your-20s-are-doomed',
        category: 'Sociology / Deep Dive',
        cover_image: '/assets/images/thumb_25_doomed_1787307562049.jpg',
        video_duration: '28:40',
        views_count: '4.6M views',
        ctr_before: '4.5%',
        ctr_after: '15.9%',
        ctr_gain: '+25.3% CTR',
        channel: 'Modern Mindset',
        niche: 'Philosophy & Society',
        hook: 'Existential curiosity trigger targeted at Gen-Z career uncertainty.',
        strategy_breakdown: JSON.stringify([
          'Noir cinematic lighting and atmospheric rain',
          'Bold geometric font placement',
          'Empathy-driven psychological focal point'
        ]),
        graphic_type: 'custom',
        sort_order: 5
      },
      {
        id: 'thumb-6',
        title: 'Cure Constipation in 2 Minutes',
        slug: 'cure-constipation-in-2-minutes',
        category: 'Health / Rapid Relief',
        cover_image: '',
        video_duration: '06:34',
        views_count: '6.8M views',
        ctr_before: '5.0%',
        ctr_after: '17.3%',
        ctr_gain: '+24.6% CTR',
        channel: 'Health First MD',
        niche: 'Health & Wellness',
        hook: 'Immediate promise of relief with fast time constraint.',
        strategy_breakdown: JSON.stringify([
          'Thermal abdomen scan visual hook',
          'High-contrast timer badge',
          'Instant credibility doctor seal'
        ]),
        graphic_type: 'constipation',
        sort_order: 6
      },
      {
        id: 'thumb-7',
        title: 'AIR 1 Turned Educator (Now Makes Crores)',
        slug: 'air-1-turned-educator',
        category: 'Success Story / Edu-Creator',
        cover_image: '',
        video_duration: '16:50',
        views_count: '2.9M views',
        ctr_before: '4.2%',
        ctr_after: '14.8%',
        ctr_gain: '+25.2% CTR',
        channel: 'Aspirant Insider',
        niche: 'Education & Business',
        hook: 'Aspirational income transformation for competitive exam community.',
        strategy_breakdown: JSON.stringify([
          'Gold star rank badge graphic',
          'Success emotion framing',
          'Case study proof badge styling'
        ]),
        graphic_type: 'educator',
        sort_order: 7
      },
      {
        id: 'thumb-8',
        title: 'Inside Second Largest Company of India',
        slug: 'inside-second-largest-company-of-india',
        category: 'Business / Industrial Mega Tour',
        cover_image: '',
        video_duration: '31:15',
        views_count: '3.8M views',
        ctr_before: '4.6%',
        ctr_after: '13.9%',
        ctr_gain: '+20.2% CTR',
        channel: 'Industry Decoded',
        niche: 'Business & Infrastructure',
        hook: 'Exclusive access tour curiosity for massive industrial facility.',
        strategy_breakdown: JSON.stringify([
          'Official corporate color scheme alignment',
          'Mega refinery scale backdrop',
          'VIP access tag composition'
        ]),
        graphic_type: 'indianoil',
        sort_order: 8
      }
    ];

    const insertProject = db.prepare(`
      INSERT INTO projects (
        id, title, slug, category, cover_image, video_duration,
        views_count, ctr_before, ctr_after, ctr_gain, channel, niche,
        hook, strategy_breakdown, graphic_type, sort_order, published, featured
      )
      VALUES (
        @id, @title, @slug, @category, @cover_image, @video_duration,
        @views_count, @ctr_before, @ctr_after, @ctr_gain, @channel, @niche,
        @hook, @strategy_breakdown, @graphic_type, @sort_order, 1, 1
      )
    `);

    for (const proj of initialProjects) {
      insertProject.run(proj);
    }
  }

  // Backfill avatars for existing project records if missing
  const placeholderAvatars: Record<string, string> = {
    'thumb-1': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    'thumb-2': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    'thumb-3': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    'thumb-4': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    'thumb-5': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    'thumb-6': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop',
    'thumb-7': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
    'thumb-8': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  };
  const updateProjectAvatar = db.prepare("UPDATE projects SET avatar = ? WHERE id = ? AND (avatar IS NULL OR avatar = '')");
  for (const [id, url] of Object.entries(placeholderAvatars)) {
    updateProjectAvatar.run(url, id);
  }

  // E. Seed Testimonials
  const testCount = db.prepare('SELECT COUNT(*) as count FROM testimonials').get() as { count: number };
  if (testCount.count === 0) {
    const initialTestimonials = [
      {
        id: 'test-1',
        name: 'Gene Zole',
        role: 'Lead Creator & Founder',
        company: 'Automotive Insights (1.2M Subs)',
        quote: 'Working with Ravi completely overhauled our YouTube packaging. Our baseline CTR jumped from 4.2% to 11.8% in less than 45 days. The 3D depth and typography hierarchy are unmatched.',
        avatar: '/assets/images/avatar_gene_zole_1787307417052.jpg',
        rating: 5,
        channel: '@GeneZoleOfficial',
        subscribers: '1.2M Subscribers',
        detailed_bio: 'Full-time automotive and engineering creator producing weekly episodic series with 40M+ annual views across YouTube and syndicated platforms.',
        impact_metrics: JSON.stringify([
          '180% average CTR increase on launch day',
          'Over 14M additional organic views generated in 6 months',
          'Zero delay turnaround with complete asset variations'
        ]),
        stats: JSON.stringify([
          { label: 'CTR Growth', value: '+180%' },
          { label: 'Views Added', value: '14M+' },
          { label: 'Drop Count', value: '38+' }
        ]),
        sort_order: 1
      },
      {
        id: 'test-2',
        name: 'Carter Tiller',
        role: 'Host & Executive Producer',
        company: 'Apex Documentaries (850K Subs)',
        quote: 'Ravi doesn’t just design thumbnails — he understands algorithmic packaging and viewer psychology. Every concept feels deliberate, high-end, and engineered for high-intent retention.',
        avatar: '/assets/images/avatar_carter_tiller_1787307435754.jpg',
        rating: 5,
        channel: '@CarterTillerDocs',
        subscribers: '850K Subscribers',
        detailed_bio: 'Investigative storytelling and cinematic deep-dive channel covering geopolitics, technology scandals, and modern economic power dynamics.',
        impact_metrics: JSON.stringify([
          'Doubled average browse feature impression conversions',
          'Engineered viral 4.2M view breakout investigation drop',
          'Consistent A/B test winner across all testing cohorts'
        ]),
        stats: JSON.stringify([
          { label: 'CTR Growth', value: '+210%' },
          { label: 'Views Added', value: '22M+' },
          { label: 'Drop Count', value: '52+' }
        ]),
        sort_order: 2
      },
      {
        id: 'test-3',
        name: 'Brian Phoelke',
        role: 'Managing Director',
        company: 'Venture Scale Media (2.1M Network)',
        quote: 'The speed and consistency are remarkable. We manage multi-channel rosters and Ravi is our secret weapon for guaranteeing our 6-figure production investments get clicked.',
        avatar: '/assets/images/avatar_brian_phoelke_1787307453485.jpg',
        rating: 5,
        channel: '@VentureScaleHub',
        subscribers: '2.1M Network',
        detailed_bio: 'Digital media network operating 4 distinct podcast, finance, and technology channels with a global audience of high-net-worth business operators.',
        impact_metrics: JSON.stringify([
          'Streamlined thumbnail ideation to under 24 hours per drop',
          'Standardized visual identity across 4 separate sub-brands',
          'Highest monetization RPM quarter in network history'
        ]),
        stats: JSON.stringify([
          { label: 'CTR Growth', value: '+195%' },
          { label: 'Views Added', value: '35M+' },
          { label: 'Drop Count', value: '75+' }
        ]),
        sort_order: 3
      }
    ];

    const insertTest = db.prepare(`
      INSERT INTO testimonials (
        id, name, role, company, quote, avatar, rating, channel, subscribers,
        detailed_bio, impact_metrics, stats, sort_order, published
      )
      VALUES (
        @id, @name, @role, @company, @quote, @avatar, @rating, @channel, @subscribers,
        @detailed_bio, @impact_metrics, @stats, @sort_order, 1
      )
    `);

    for (const test of initialTestimonials) {
      insertTest.run(test);
    }
  }

  // F. Seed Leaders
  const leaderCount = db.prepare('SELECT COUNT(*) as count FROM leaders').get() as { count: number };
  if (leaderCount.count === 0) {
    const initialLeaders = [
      {
        id: 'leader-1',
        name: 'Ravi Kapoor',
        role: 'Strategic Consultant & Mentor',
        channel: 'Ravi Kapoor (650K)',
        ctr_gain: '+24.8% CTR',
        image: '/leaders/ravi_kapoor.png',
        quote: 'Their psychological packaging transformed our click-through velocity across all long-form masterclasses.',
        featured_topic: 'Strategic Mentorship & Leadership',
        sort_order: 1,
      },
      {
        id: 'leader-2',
        name: 'Divya Jain',
        role: 'Founder & Keynote Speaker',
        channel: 'Leadership & Impact (420K)',
        ctr_gain: '+19.5% CTR',
        image: '/leaders/divya_jain.png',
        quote: 'Every thumbnail communicates prestige and authority while compelling viewers to stop and click.',
        featured_topic: 'Enterprise Leadership & Vision',
        sort_order: 2,
      },
      {
        id: 'leader-3',
        name: 'Dr. Nachiket Bhatia',
        role: 'CEO & Medical Media Entrepreneur',
        channel: 'Medical Pulse (1.2M)',
        ctr_gain: '+28.4% CTR',
        image: '/leaders/nachiket_bhatia.png',
        quote: 'Our retention and top-of-funnel CTR skyrocketed after switching to their high-intent packaging system.',
        featured_topic: 'Health Tech & Medical Scaling',
        sort_order: 3,
      },
      {
        id: 'leader-4',
        name: 'Dr. Shubham Vatsya',
        role: 'Senior Consultant Gastroenterologist',
        channel: 'GI Clinical Insights (850K)',
        ctr_gain: '+33.2% CTR',
        image: '/leaders/shubham_vatsya.png',
        quote: 'They translate complex clinical subjects into visually irresistible thumbnails that drive millions of views.',
        featured_topic: 'Clinical Science & Public Health',
        sort_order: 4,
      },
      {
        id: 'leader-5',
        name: 'Dr Ramnik Sabharwal',
        role: 'Senior Medical Specialist',
        channel: 'Health & Wellness (540K)',
        ctr_gain: '+22.1% CTR',
        image: '/leaders/ramnik_sabharwal.png',
        quote: 'The clarity, color hierarchy, and emotional pull of each concept has made a massive difference to our reach.',
        featured_topic: 'Integrative Wellness & Medicine',
        sort_order: 5,
      },
      {
        id: 'leader-6',
        name: 'Bhunesh Sharma',
        role: 'Educator & Tech Creator',
        channel: 'Tech & Scale (980K)',
        ctr_gain: '+31.6% CTR',
        image: '/leaders/bhunesh_sharma.png',
        quote: 'Working with them took our average impressions from modest numbers to multiple viral recommendations.',
        featured_topic: 'Technology & EdTech Scaling',
        sort_order: 6,
      },
      {
        id: 'leader-7',
        name: 'Dr. Gayathri Rathod',
        role: 'Physician & Academic Keynote',
        channel: 'Clinical Rounds (620K)',
        ctr_gain: '+26.7% CTR',
        image: '/leaders/gayathri_rathod.png',
        quote: 'Deliberate, high-converting thumbnail compositions that preserve clinical integrity and trust.',
        featured_topic: 'Preventive Healthcare & Academia',
        sort_order: 7,
      },
      {
        id: 'leader-8',
        name: 'Dr. Pulak Vatsya',
        role: 'Surgeon & Academic Specialist',
        channel: 'Surgical Masterclasses (1.1M)',
        ctr_gain: '+35.4% CTR',
        image: '/leaders/pulak_vatsya.png',
        quote: 'The speed, precision, and visual depth they deliver has made them our indispensable creative partner.',
        featured_topic: 'Advanced Surgical Science',
        sort_order: 8,
      },
    ];

    const insertLeader = db.prepare(`
      INSERT INTO leaders (id, name, role, channel, ctr_gain, image, quote, featured_topic, sort_order, published)
      VALUES (@id, @name, @role, @channel, @ctr_gain, @image, @quote, @featured_topic, @sort_order, 1)
    `);

    for (const leader of initialLeaders) {
      insertLeader.run(leader);
    }
  }

  // G. Seed Services
  const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };
  if (serviceCount.count === 0) {
    const initialServices = [
      {
        id: 'serv-1',
        title: 'Full Channel Packaging Retainer',
        description: 'End-to-end dedicated thumbnail design, title brainstorming, and A/B split-testing variations for high-volume creators.',
        icon: 'Sparkles',
        deliverables: JSON.stringify(['8 to 15 thumbnail drops/month', '3 A/B test variations per drop', '< 24h turnarounds', 'Dedicated Slack communication']),
        sort_order: 1
      },
      {
        id: 'serv-2',
        title: 'Channel CTR Overhaul & Audit',
        description: 'Deep audit of your past 50 videos, identifying low-performing outliers and redesigning your top 10 evergreen assets for immediate traffic revival.',
        icon: 'TrendingUp',
        deliverables: JSON.stringify(['50-video packaging analysis', '10 revamped evergreen thumbnails', 'Title matrix sheet', 'CTR baseline benchmark report']),
        sort_order: 2
      },
      {
        id: 'serv-3',
        title: 'Pilot Test Drop (3 Thumbnails)',
        description: 'Try our psychological packaging system on your next 3 upcoming video drops with zero long-term commitment.',
        icon: 'Layers',
        deliverables: JSON.stringify(['3 custom thumbnail drops', '2 title hook angles per video', '3D render enhancements', 'Mobile feed contrast pass']),
        sort_order: 3
      }
    ];

    const insertService = db.prepare(`
      INSERT INTO services (id, title, description, icon, deliverables, sort_order, published)
      VALUES (@id, @title, @description, @icon, @deliverables, @sort_order, 1)
    `);

    for (const serv of initialServices) {
      insertService.run(serv);
    }
  }

  // One-time cleanup: purge any lingering dummy unsplash images from database
  try {
    const row = db.prepare("SELECT value FROM site_settings WHERE key = 'global_settings'").get() as { value: string } | undefined;
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      let updated = false;
      if (parsed.brandLogoImage && parsed.brandLogoImage.includes('unsplash.com')) {
        parsed.brandLogoImage = '';
        updated = true;
      }
      if (updated) {
        db.prepare("UPDATE site_settings SET value = ? WHERE key = 'global_settings'").run(JSON.stringify(parsed));
      }
    }
    db.prepare("UPDATE clients SET logo = NULL WHERE logo LIKE '%unsplash.com%'").run();
  } catch {}
}

export { db };
