import { db, initDatabase } from '../db/database.ts';
import type {
  CMSClient,
  CMSProject,
  CMSTestimonial,
  CMSLeader,
  CMSService,
  CMSContactInquiry,
  CMSSiteSettings,
  CMSPublicPayload
} from '../../src/types/cms.ts';

// 1. GET PUBLIC DATA
export function getPublicCMSData(): CMSPublicPayload {
  const settingsRow = db.prepare('SELECT value FROM site_settings WHERE key = ?').get('global_settings') as { value: string } | undefined;
  const settings: CMSSiteSettings = settingsRow ? JSON.parse(settingsRow.value) : ({} as CMSSiteSettings);

  const clients = db.prepare('SELECT * FROM clients WHERE published = 1 ORDER BY sort_order ASC').all() as any[];
  const formattedClients: CMSClient[] = clients.map((c) => ({
    ...c,
    featured: Boolean(c.featured),
    published: Boolean(c.published),
  }));

  const projects = db.prepare('SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC').all() as any[];
  const formattedProjects: CMSProject[] = projects.map((p) => ({
    ...p,
    strategy_breakdown: p.strategy_breakdown ? JSON.parse(p.strategy_breakdown) : [],
    featured: Boolean(p.featured),
    published: Boolean(p.published),
  }));

  const testimonials = db.prepare('SELECT * FROM testimonials WHERE published = 1 ORDER BY sort_order ASC').all() as any[];
  const formattedTestimonials: CMSTestimonial[] = testimonials.map((t) => ({
    ...t,
    impact_metrics: t.impact_metrics ? JSON.parse(t.impact_metrics) : [],
    stats: t.stats ? JSON.parse(t.stats) : [],
    published: Boolean(t.published),
  }));

  const leaders = db.prepare('SELECT * FROM leaders WHERE published = 1 ORDER BY sort_order ASC').all() as any[];
  const formattedLeaders: CMSLeader[] = leaders.map((l) => ({
    ...l,
    published: Boolean(l.published),
  }));

  const services = db.prepare('SELECT * FROM services WHERE published = 1 ORDER BY sort_order ASC').all() as any[];
  const formattedServices: CMSService[] = services.map((s) => ({
    ...s,
    deliverables: s.deliverables ? JSON.parse(s.deliverables) : [],
    published: Boolean(s.published),
  }));

  return {
    settings,
    clients: formattedClients,
    projects: formattedProjects,
    testimonials: formattedTestimonials,
    leaders: formattedLeaders,
    services: formattedServices,
  };
}

// 2. GET ALL CMS DATA (For Admin Dashboard)
export function getAllCMSData() {
  const publicData = getPublicCMSData();

  // Also include draft items for admin
  const allClients = (db.prepare('SELECT * FROM clients ORDER BY sort_order ASC').all() as any[]).map((c) => ({
    ...c,
    featured: Boolean(c.featured),
    published: Boolean(c.published),
  }));

  const allProjects = (db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all() as any[]).map((p) => ({
    ...p,
    strategy_breakdown: p.strategy_breakdown ? JSON.parse(p.strategy_breakdown) : [],
    featured: Boolean(p.featured),
    published: Boolean(p.published),
  }));

  const allTestimonials = (db.prepare('SELECT * FROM testimonials ORDER BY sort_order ASC').all() as any[]).map((t) => ({
    ...t,
    impact_metrics: t.impact_metrics ? JSON.parse(t.impact_metrics) : [],
    stats: t.stats ? JSON.parse(t.stats) : [],
    published: Boolean(t.published),
  }));

  const allLeaders = (db.prepare('SELECT * FROM leaders ORDER BY sort_order ASC').all() as any[]).map((l) => ({
    ...l,
    published: Boolean(l.published),
  }));

  const allServices = (db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all() as any[]).map((s) => ({
    ...s,
    deliverables: s.deliverables ? JSON.parse(s.deliverables) : [],
    published: Boolean(s.published),
  }));

  const inquiries = db.prepare('SELECT * FROM contact_inquiries ORDER BY created_at DESC').all() as CMSContactInquiry[];

  return {
    settings: publicData.settings,
    clients: allClients,
    projects: allProjects,
    testimonials: allTestimonials,
    leaders: allLeaders,
    services: allServices,
    inquiries,
  };
}

// 3. SETTINGS
export function saveSettings(settings: CMSSiteSettings): boolean {
  try {
    const stmt = db.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('global_settings', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error('Error saving settings:', err);
    return false;
  }
}

// 4. CLIENTS CRUD
export function upsertClient(client: Partial<CMSClient>): boolean {
  try {
    const id = client.id || `client-${Date.now()}`;
    const slug = client.slug || client.name?.toLowerCase().replace(/\s+/g, '-') || `client-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO clients (
        id, name, slug, logo, image, description, audience, category, social_url, badge, subtext, featured, sort_order, published, updated_at
      )
      VALUES (
        @id, @name, @slug, @logo, @image, @description, @audience, @category, @social_url, @badge, @subtext, @featured, @sort_order, @published, CURRENT_TIMESTAMP
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug,
        logo = excluded.logo,
        image = excluded.image,
        description = excluded.description,
        audience = excluded.audience,
        category = excluded.category,
        social_url = excluded.social_url,
        badge = excluded.badge,
        subtext = excluded.subtext,
        featured = excluded.featured,
        sort_order = excluded.sort_order,
        published = excluded.published,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run({
      id,
      name: client.name || 'New Client',
      slug,
      logo: client.logo || '',
      image: client.image || '',
      description: client.description || '',
      audience: client.audience || '',
      category: client.category || 'Creator Media',
      social_url: client.social_url || '',
      badge: client.badge || '',
      subtext: client.subtext || '',
      featured: client.featured ? 1 : 0,
      sort_order: client.sort_order || 0,
      published: client.published !== false ? 1 : 0,
    });
    return true;
  } catch (err) {
    console.error('Error saving client:', err);
    return false;
  }
}

export function deleteClient(id: string): boolean {
  try {
    db.prepare('DELETE FROM clients WHERE id = ?').run(id);
    return true;
  } catch (err) {
    console.error('Error deleting client:', err);
    return false;
  }
}

// 5. PROJECTS CRUD
export function upsertProject(project: Partial<CMSProject>): boolean {
  try {
    const id = project.id || `proj-${Date.now()}`;
    const slug = project.slug || project.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `proj-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO projects (
        id, title, slug, description, client_id, category, cover_image, video_duration, views_count,
        ctr_before, ctr_after, ctr_gain, channel, niche, hook, strategy_breakdown, graphic_type,
        featured, published, sort_order, updated_at
      )
      VALUES (
        @id, @title, @slug, @description, @client_id, @category, @cover_image, @video_duration, @views_count,
        @ctr_before, @ctr_after, @ctr_gain, @channel, @niche, @hook, @strategy_breakdown, @graphic_type,
        @featured, @published, @sort_order, CURRENT_TIMESTAMP
      )
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        slug = excluded.slug,
        description = excluded.description,
        client_id = excluded.client_id,
        category = excluded.category,
        cover_image = excluded.cover_image,
        video_duration = excluded.video_duration,
        views_count = excluded.views_count,
        ctr_before = excluded.ctr_before,
        ctr_after = excluded.ctr_after,
        ctr_gain = excluded.ctr_gain,
        channel = excluded.channel,
        niche = excluded.niche,
        hook = excluded.hook,
        strategy_breakdown = excluded.strategy_breakdown,
        graphic_type = excluded.graphic_type,
        featured = excluded.featured,
        published = excluded.published,
        sort_order = excluded.sort_order,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run({
      id,
      title: project.title || 'New Thumbnail Case Study',
      slug,
      description: project.description || '',
      client_id: project.client_id || null,
      category: project.category || 'Education & Strategy',
      cover_image: project.cover_image || '',
      video_duration: project.video_duration || '12:00',
      views_count: project.views_count || '1M views',
      ctr_before: project.ctr_before || '4.0%',
      ctr_after: project.ctr_after || '14.0%',
      ctr_gain: project.ctr_gain || '+18.0%',
      channel: project.channel || 'Creator Channel',
      niche: project.niche || 'Growth',
      hook: project.hook || '',
      strategy_breakdown: JSON.stringify(project.strategy_breakdown || []),
      graphic_type: project.graphic_type || 'custom',
      featured: project.featured ? 1 : 0,
      published: project.published !== false ? 1 : 0,
      sort_order: project.sort_order || 0,
    });
    return true;
  } catch (err) {
    console.error('Error saving project:', err);
    return false;
  }
}

export function deleteProject(id: string): boolean {
  try {
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return true;
  } catch (err) {
    console.error('Error deleting project:', err);
    return false;
  }
}

// 6. TESTIMONIALS CRUD
export function upsertTestimonial(testimonial: Partial<CMSTestimonial>): boolean {
  try {
    const id = testimonial.id || `test-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO testimonials (
        id, name, role, company, quote, avatar, rating, channel, subscribers,
        detailed_bio, impact_metrics, stats, collaboration_duration, published, sort_order, updated_at
      )
      VALUES (
        @id, @name, @role, @company, @quote, @avatar, @rating, @channel, @subscribers,
        @detailed_bio, @impact_metrics, @stats, @collaboration_duration, @published, @sort_order, CURRENT_TIMESTAMP
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        role = excluded.role,
        company = excluded.company,
        quote = excluded.quote,
        avatar = excluded.avatar,
        rating = excluded.rating,
        channel = excluded.channel,
        subscribers = excluded.subscribers,
        detailed_bio = excluded.detailed_bio,
        impact_metrics = excluded.impact_metrics,
        stats = excluded.stats,
        collaboration_duration = excluded.collaboration_duration,
        published = excluded.published,
        sort_order = excluded.sort_order,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run({
      id,
      name: testimonial.name || 'Creator Partner',
      role: testimonial.role || 'Creator',
      company: testimonial.company || 'Media',
      quote: testimonial.quote || '',
      avatar: testimonial.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      rating: testimonial.rating || 5,
      channel: testimonial.channel || '',
      subscribers: testimonial.subscribers || '',
      detailed_bio: testimonial.detailed_bio || '',
      impact_metrics: JSON.stringify(testimonial.impact_metrics || []),
      stats: JSON.stringify(testimonial.stats || []),
      collaboration_duration: testimonial.collaboration_duration || 'Partnered since 2024',
      published: testimonial.published !== false ? 1 : 0,
      sort_order: testimonial.sort_order || 0,
    });
    return true;
  } catch (err) {
    console.error('Error saving testimonial:', err);
    return false;
  }
}

export function deleteTestimonial(id: string): boolean {
  try {
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    return true;
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    return false;
  }
}

// 7. LEADERS CRUD
export function upsertLeader(leader: Partial<CMSLeader>): boolean {
  try {
    const id = leader.id || `leader-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO leaders (
        id, name, role, channel, ctr_gain, image, quote, featured_topic, sort_order, published, updated_at
      )
      VALUES (
        @id, @name, @role, @channel, @ctr_gain, @image, @quote, @featured_topic, @sort_order, @published, CURRENT_TIMESTAMP
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        role = excluded.role,
        channel = excluded.channel,
        ctr_gain = excluded.ctr_gain,
        image = excluded.image,
        quote = excluded.quote,
        featured_topic = excluded.featured_topic,
        sort_order = excluded.sort_order,
        published = excluded.published,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run({
      id,
      name: leader.name || 'Industry Leader',
      role: leader.role || 'Executive',
      channel: leader.channel || 'Media Channel',
      ctr_gain: leader.ctr_gain || '+20% CTR',
      image: leader.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      quote: leader.quote || '',
      featured_topic: leader.featured_topic || 'Growth Strategy',
      sort_order: leader.sort_order || 0,
      published: leader.published !== false ? 1 : 0,
    });
    return true;
  } catch (err) {
    console.error('Error saving leader:', err);
    return false;
  }
}

export function deleteLeader(id: string): boolean {
  try {
    db.prepare('DELETE FROM leaders WHERE id = ?').run(id);
    return true;
  } catch (err) {
    console.error('Error deleting leader:', err);
    return false;
  }
}

// 8. SERVICES CRUD
export function upsertService(service: Partial<CMSService>): boolean {
  try {
    const id = service.id || `serv-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO services (id, title, description, icon, deliverables, sort_order, published)
      VALUES (@id, @title, @description, @icon, @deliverables, @sort_order, @published)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        icon = excluded.icon,
        deliverables = excluded.deliverables,
        sort_order = excluded.sort_order,
        published = excluded.published
    `);

    stmt.run({
      id,
      title: service.title || 'Service Offering',
      description: service.description || '',
      icon: service.icon || 'Sparkles',
      deliverables: JSON.stringify(service.deliverables || []),
      sort_order: service.sort_order || 0,
      published: service.published !== false ? 1 : 0,
    });
    return true;
  } catch (err) {
    console.error('Error saving service:', err);
    return false;
  }
}

export function deleteService(id: string): boolean {
  try {
    db.prepare('DELETE FROM services WHERE id = ?').run(id);
    return true;
  } catch (err) {
    console.error('Error deleting service:', err);
    return false;
  }
}

// 9. INQUIRIES
export function createInquiry(data: Partial<CMSContactInquiry>): boolean {
  try {
    const stmt = db.prepare(`
      INSERT INTO contact_inquiries (
        name, email, company, channel_url, project_type, current_ctr, monthly_drops, budget, message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.name,
      data.email,
      data.company || '',
      data.channel_url || '',
      data.project_type || 'Monthly Retainer (8 Drops)',
      data.current_ctr || '4-6%',
      data.monthly_drops || '4-8 videos',
      data.budget || '',
      data.message || ''
    );
    return true;
  } catch (err) {
    console.error('Error creating inquiry:', err);
    return false;
  }
}

export function updateInquiryStatus(id: number, status: 'new' | 'reviewed' | 'contacted' | 'archived'): boolean {
  try {
    db.prepare('UPDATE contact_inquiries SET status = ? WHERE id = ?').run(status, id);
    return true;
  } catch (err) {
    console.error('Error updating inquiry status:', err);
    return false;
  }
}

export function deleteInquiry(id: number): boolean {
  try {
    db.prepare('DELETE FROM contact_inquiries WHERE id = ?').run(id);
    return true;
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return false;
  }
}

// 10. REORDER HELPER
const ALLOWED_REORDER_TABLES = new Set(['clients', 'projects', 'testimonials', 'leaders', 'services']);

export function updateTableOrder(tableName: 'clients' | 'projects' | 'testimonials' | 'leaders' | 'services', orderedIds: string[]): boolean {
  if (!ALLOWED_REORDER_TABLES.has(tableName) || !Array.isArray(orderedIds)) {
    return false;
  }
  try {
    const updateStmt = db.prepare(`UPDATE ${tableName} SET sort_order = ? WHERE id = ?`);
    const transaction = db.transaction((ids: string[]) => {
      ids.forEach((id, index) => {
        updateStmt.run(index + 1, id);
      });
    });
    transaction(orderedIds);
    return true;
  } catch (err) {
    console.error(`Error reordering ${tableName}:`, err);
    return false;
  }
}

// 11. RESET ALL DATABASE TO DEFAULTS
export function resetCMSDataToDefaults(): boolean {
  try {
    db.exec(`
      DELETE FROM clients;
      DELETE FROM projects;
      DELETE FROM testimonials;
      DELETE FROM leaders;
      DELETE FROM services;
      DELETE FROM contact_inquiries;
      DELETE FROM site_settings;
    `);
    // Re-run initialization to re-seed defaults
    initDatabase();
    return true;
  } catch (err) {
    console.error('Error resetting database:', err);
    return false;
  }
}
