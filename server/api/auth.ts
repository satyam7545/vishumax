import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.ts';

import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

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

export function changeAdminPassword(adminId: number, oldPass: string, newPass: string): { success: boolean; error?: string } {
  if (!newPass || newPass.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  const row = db.prepare('SELECT password_hash FROM admins WHERE id = ?').get(adminId) as any;
  if (!row) return { success: false, error: 'Admin account not found.' };

  const isMatch = bcrypt.compareSync(oldPass, row.password_hash);
  if (!isMatch) return { success: false, error: 'Current password is incorrect.' };

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPass, salt);

  db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(newHash, adminId);
  return { success: true };
}

export function updateAdminProfile(adminId: number, email: string, name: string): { success: boolean; error?: string } {
  try {
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedName = name?.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }
    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: 'Name must be at least 2 characters.' };
    }

    db.prepare('UPDATE admins SET email = ?, name = ? WHERE id = ?').run(trimmedEmail, trimmedName, adminId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update profile.' };
  }
}
