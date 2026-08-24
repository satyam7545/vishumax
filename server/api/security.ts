import type { ServerResponse, IncomingMessage } from 'http';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limiting store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up stale rate limits every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSec = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}

/**
 * XSS & HTML character sanitization
 */
export function sanitizeString(val: unknown, maxLength = 1000): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email.length <= 254 && emailRegex.test(email.trim());
}

export function validateInquiryInput(body: any): { valid: boolean; error?: string; data?: any } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid payload' };
  }

  const name = sanitizeString(body.name, 100);
  const email = sanitizeString(body.email, 255).toLowerCase();
  const company = sanitizeString(body.company, 150);
  const channel_url = sanitizeString(body.channel_url, 300);
  const project_type = sanitizeString(body.project_type, 100);
  const current_ctr = sanitizeString(body.current_ctr, 50);
  const monthly_drops = sanitizeString(body.monthly_drops, 50);
  const budget = sanitizeString(body.budget, 100);
  const message = sanitizeString(body.message, 4000);

  if (!name || name.length < 2) {
    return { valid: false, error: 'Valid name is required (minimum 2 characters)' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'Valid email address is required' };
  }

  return {
    valid: true,
    data: {
      name,
      email,
      company,
      channel_url,
      project_type,
      current_ctr,
      monthly_drops,
      budget,
      message,
    },
  };
}

export function applySecurityHeaders(res: ServerResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}
