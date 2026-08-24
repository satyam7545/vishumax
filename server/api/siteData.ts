import { db } from '../db/database';

export function getSiteDataFromDB(): any | null {
  const row = db.prepare('SELECT value FROM site_settings WHERE key = ?').get('site_data') as { value: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.value);
  } catch {
    return null;
  }
}

export function saveSiteDataToDB(siteData: any): boolean {
  try {
    const json = JSON.stringify(siteData);
    db.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('site_data', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `).run(json);
    return true;
  } catch (err) {
    console.error('Failed to save site data to SQLite:', err);
    return false;
  }
}

export function resetSiteDataInDB(defaultData: any): boolean {
  return saveSiteDataToDB(defaultData);
}
