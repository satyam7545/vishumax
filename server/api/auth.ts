import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'vishumax_jwt_secret_key_2026';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  last_login?: string;
}

export function loginAdmin(email: string, password: string): { user: AdminUser; token: string } | null {
  const row = db.prepare('SELECT * FROM admins WHERE email = ? COLLATE NOCASE').get(email) as any;
  if (!row) return null;

  const isMatch = bcrypt.compareSync(password, row.password_hash);
  if (!isMatch) return null;

  // Update last login
  db.prepare('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(row.id);

  const user: AdminUser = {
    id: row.id,
    email: row.email,
    name: row.name,
    last_login: new Date().toISOString(),
  };

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  return { user, token };
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    const row = db.prepare('SELECT id, email, name FROM admins WHERE id = ?').get(decoded.id) as any;
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      name: row.name,
    };
  } catch {
    return null;
  }
}

export function changeAdminPassword(adminId: number, oldPass: string, newPass: string): boolean {
  const row = db.prepare('SELECT password_hash FROM admins WHERE id = ?').get(adminId) as any;
  if (!row) return false;

  const isMatch = bcrypt.compareSync(oldPass, row.password_hash);
  if (!isMatch) return false;

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPass, salt);

  db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(newHash, adminId);
  return true;
}

export function updateAdminProfile(adminId: number, email: string, name: string): boolean {
  try {
    db.prepare('UPDATE admins SET email = ?, name = ? WHERE id = ?').run(email, name, adminId);
    return true;
  } catch {
    return false;
  }
}
