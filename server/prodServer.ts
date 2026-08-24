import http from 'http';
import path from 'path';
import fs from 'fs';
import { initDatabase } from './db/database.ts';
import { loginAdmin, verifyAdminToken, changeAdminPassword, updateAdminProfile } from './api/auth.ts';
import {
  applySecurityHeaders,
  checkRateLimit,
  getClientIp,
  validateInquiryInput,
} from './api/security.ts';
import {
  saveUploadedMedia,
  listMediaFiles,
  deleteMediaFile,
  deleteMultipleMediaFiles,
} from './api/mediaManager.ts';
import {
  getPublicCMSData,
  getAllCMSData,
  saveSettings,
  upsertClient,
  deleteClient,
  upsertProject,
  deleteProject,
  upsertTestimonial,
  deleteTestimonial,
  upsertLeader,
  deleteLeader,
  upsertService,
  deleteService,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
  updateTableOrder,
  resetCMSDataToDefaults,
} from './api/cmsData.ts';

const PORT = parseInt(process.env.PORT || '3000', 10);
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

// MIME types for static asset serving
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

// Initialize database
initDatabase();

const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);

  const ip = getClientIp(req);
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Global API rate limit: 120 req/min
  if (pathname.startsWith('/api/')) {
    const globalLimit = checkRateLimit(`global:${ip}`, 120, 60 * 1000);
    if (!globalLimit.allowed) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: `Too many requests. Please try again in ${globalLimit.retryAfterSec}s.`,
        })
      );
      return;
    }
  }

  // Helper to parse JSON body with 50MB limit
  const getBody = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      let body = '';
      let bytes = 0;
      const maxBytes = 50 * 1024 * 1024; // 50MB

      req.on('data', (chunk) => {
        bytes += chunk.length;
        if (bytes > maxBytes) {
          res.statusCode = 413;
          res.end(JSON.stringify({ success: false, error: 'Payload too large (max 50MB)' }));
          reject(new Error('Payload too large'));
          return;
        }
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });

      req.on('error', (err) => {
        reject(err);
      });
    });
  };

  // Helper to verify Bearer Token
  const getAuthUser = () => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    return verifyAdminToken(token);
  };

  // -------------------------------------------------------------
  // API ROUTING
  // -------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    try {
      // 1. PUBLIC: GET /api/cms/public-data
      if (pathname === '/api/cms/public-data' && method === 'GET') {
        const data = getPublicCMSData();
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, data }));
        return;
      }

      // Legacy support: GET /api/site-data
      if (pathname === '/api/site-data' && method === 'GET') {
        const data = getPublicCMSData();
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, data }));
        return;
      }

      // 2. PUBLIC: POST /api/inquiries (Contact form with rate limit and validation)
      if (pathname === '/api/inquiries' && method === 'POST') {
        const limit = checkRateLimit(`inquiry:${ip}`, 5, 10 * 60 * 1000);
        if (!limit.allowed) {
          res.statusCode = 429;
          res.end(
            JSON.stringify({
              success: false,
              error: `Too many submissions. Please wait ${limit.retryAfterSec}s before sending another message.`,
            })
          );
          return;
        }

        const rawBody = await getBody();
        const validation = validateInquiryInput(rawBody);
        if (!validation.valid) {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: validation.error }));
          return;
        }

        const created = createInquiry(validation.data);
        res.statusCode = created ? 200 : 500;
        res.end(JSON.stringify({ success: created }));
        return;
      }

      // 3. AUTH: POST /api/auth/login (Rate limited)
      if (pathname === '/api/auth/login' && method === 'POST') {
        const loginLimit = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
        if (!loginLimit.allowed) {
          res.statusCode = 429;
          res.end(
            JSON.stringify({
              success: false,
              error: `Too many login attempts. Please wait ${loginLimit.retryAfterSec}s before retrying.`,
            })
          );
          return;
        }

        const { email, password } = await getBody();
        if (!email || !password) {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'Email and password are required' }));
          return;
        }

        const result = loginAdmin(email, password);
        if (!result) {
          res.statusCode = 401;
          res.end(JSON.stringify({ success: false, error: 'Invalid email or password' }));
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, user: result.user, token: result.token }));
        return;
      }

      // 4. AUTH: GET /api/auth/me
      if (pathname === '/api/auth/me' && method === 'GET') {
        const user = getAuthUser();
        if (!user) {
          res.statusCode = 401;
          res.end(JSON.stringify({ authenticated: false }));
          return;
        }
        res.statusCode = 200;
        res.end(JSON.stringify({ authenticated: true, user }));
        return;
      }

      // Admin verification for protected routes
      const user = getAuthUser();
      if (!user) {
        res.statusCode = 401;
        res.end(JSON.stringify({ success: false, error: 'Unauthorized: Admin login required' }));
        return;
      }

      // 5. ADMIN: GET /api/cms/all
      if (pathname === '/api/cms/all' && method === 'GET') {
        const data = getAllCMSData();
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, data }));
        return;
      }

      // 6. ADMIN: POST /api/cms/settings
      if (pathname === '/api/cms/settings' && method === 'POST') {
        const body = await getBody();
        const saved = saveSettings(body);
        res.statusCode = saved ? 200 : 500;
        res.end(JSON.stringify({ success: saved }));
        return;
      }

      // 7. ADMIN: POST /api/cms/clients
      if (pathname === '/api/cms/clients' && method === 'POST') {
        const body = await getBody();
        const saved = upsertClient(body);
        res.statusCode = saved ? 200 : 500;
        res.end(JSON.stringify({ success: saved }));
        return;
      }

      // 8. ADMIN: DELETE /api/cms/clients/:id
      if (pathname.startsWith('/api/cms/clients/') && method === 'DELETE') {
        const id = pathname.replace('/api/cms/clients/', '');
        const deleted = deleteClient(id);
        res.statusCode = deleted ? 200 : 500;
        res.end(JSON.stringify({ success: deleted }));
        return;
      }

      // 9. ADMIN: POST /api/cms/projects
      if (pathname === '/api/cms/projects' && method === 'POST') {
        const body = await getBody();
        const saved = upsertProject(body);
        res.statusCode = saved ? 200 : 500;
        res.end(JSON.stringify({ success: saved }));
        return;
      }

      // 10. ADMIN: DELETE /api/cms/projects/:id
      if (pathname.startsWith('/api/cms/projects/') && method === 'DELETE') {
        const id = pathname.replace('/api/cms/projects/', '');
        const deleted = deleteProject(id);
        res.statusCode = deleted ? 200 : 500;
        res.end(JSON.stringify({ success: deleted }));
        return;
      }

      // 11. ADMIN: POST /api/cms/testimonials
      if (pathname === '/api/cms/testimonials' && method === 'POST') {
        const body = await getBody();
        const saved = upsertTestimonial(body);
        res.statusCode = saved ? 200 : 500;
        res.end(JSON.stringify({ success: saved }));
        return;
      }

      // 12. ADMIN: DELETE /api/cms/testimonials/:id
      if (pathname.startsWith('/api/cms/testimonials/') && method === 'DELETE') {
        const id = pathname.replace('/api/cms/testimonials/', '');
        const deleted = deleteTestimonial(id);
        res.statusCode = deleted ? 200 : 500;
        res.end(JSON.stringify({ success: deleted }));
        return;
      }

      // 13. ADMIN: POST /api/cms/leaders
      if (pathname === '/api/cms/leaders' && method === 'POST') {
        const body = await getBody();
        const saved = upsertLeader(body);
        res.statusCode = saved ? 200 : 500;
        res.end(JSON.stringify({ success: saved }));
        return;
      }

      // 14. ADMIN: DELETE /api/cms/leaders/:id
      if (pathname.startsWith('/api/cms/leaders/') && method === 'DELETE') {
        const id = pathname.replace('/api/cms/leaders/', '');
        const deleted = deleteLeader(id);
        res.statusCode = deleted ? 200 : 500;
        res.end(JSON.stringify({ success: deleted }));
        return;
      }

      // 15. ADMIN: POST /api/cms/services
      if (pathname === '/api/cms/services' && method === 'POST') {
        const body = await getBody();
        const saved = upsertService(body);
        res.statusCode = saved ? 200 : 500;
        res.end(JSON.stringify({ success: saved }));
        return;
      }

      // 16. ADMIN: DELETE /api/cms/services/:id
      if (pathname.startsWith('/api/cms/services/') && method === 'DELETE') {
        const id = pathname.replace('/api/cms/services/', '');
        const deleted = deleteService(id);
        res.statusCode = deleted ? 200 : 500;
        res.end(JSON.stringify({ success: deleted }));
        return;
      }

      // 17. ADMIN: PATCH /api/inquiries/:id/status
      if (pathname.startsWith('/api/inquiries/') && pathname.endsWith('/status') && method === 'PATCH') {
        const parts = pathname.split('/');
        const id = parseInt(parts[3], 10);
        const { status } = await getBody();
        const updated = updateInquiryStatus(id, status);
        res.statusCode = updated ? 200 : 500;
        res.end(JSON.stringify({ success: updated }));
        return;
      }

      // 18. ADMIN: DELETE /api/inquiries/:id
      if (pathname.startsWith('/api/inquiries/') && method === 'DELETE') {
        const id = parseInt(pathname.replace('/api/inquiries/', ''), 10);
        const deleted = deleteInquiry(id);
        res.statusCode = deleted ? 200 : 500;
        res.end(JSON.stringify({ success: deleted }));
        return;
      }

      // 19. ADMIN: POST /api/cms/reorder
      if (pathname === '/api/cms/reorder' && method === 'POST') {
        const { table, orderedIds } = await getBody();
        const reordered = updateTableOrder(table, orderedIds);
        res.statusCode = reordered ? 200 : 500;
        res.end(JSON.stringify({ success: reordered }));
        return;
      }

      // 20. ADMIN: POST /api/cms/reset
      if (pathname === '/api/cms/reset' && method === 'POST') {
        const reset = resetCMSDataToDefaults();
        res.statusCode = reset ? 200 : 500;
        res.end(JSON.stringify({ success: reset }));
        return;
      }

      // 21. ADMIN: POST /api/auth/change-password
      if (pathname === '/api/auth/change-password' && method === 'POST') {
        const { oldPassword, newPassword } = await getBody();
        if (!oldPassword || !newPassword || newPassword.length < 6) {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'New password must be at least 6 characters' }));
          return;
        }

        const changed = changeAdminPassword(user.id, oldPassword, newPassword);
        if (!changed) {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'Incorrect current password' }));
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, message: 'Password updated successfully' }));
        return;
      }

      // 22. ADMIN: POST /api/auth/profile
      if (pathname === '/api/auth/profile' && method === 'POST') {
        const { email, name } = await getBody();
        if (!email || !name) {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'Email and name are required' }));
          return;
        }

        const updated = updateAdminProfile(user.id, email, name);
        if (!updated) {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'Failed to update admin profile (email may be in use)' }));
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, message: 'Admin profile updated' }));
        return;
      }

      // 23. ADMIN: GET /api/cms/media
      if (pathname === '/api/cms/media' && method === 'GET') {
        const files = listMediaFiles();
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, files }));
        return;
      }

      // 24. ADMIN: POST /api/cms/upload
      if (pathname === '/api/cms/upload' && method === 'POST') {
        const { name, type, data } = await getBody();
        if (!name || !data) {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'File name and data are required' }));
          return;
        }

        const result = saveUploadedMedia(name, type || 'image/png', data);
        res.statusCode = result.success ? 200 : 400;
        res.end(JSON.stringify(result));
        return;
      }

      // 25. ADMIN: DELETE /api/cms/media/:filename
      if (pathname.startsWith('/api/cms/media/') && method === 'DELETE') {
        const filename = pathname.replace('/api/cms/media/', '');
        const deleted = deleteMediaFile(filename);
        res.statusCode = deleted ? 200 : 404;
        res.end(JSON.stringify({ success: deleted }));
        return;
      }

      // 26. ADMIN: POST /api/cms/media/batch-delete
      if (pathname === '/api/cms/media/batch-delete' && method === 'POST') {
        const { filenames } = await getBody();
        if (!Array.isArray(filenames) || filenames.length === 0) {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'Array of filenames required' }));
          return;
        }

        const result = deleteMultipleMediaFiles(filenames);
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, deletedCount: result.deletedCount }));
        return;
      }

      // Route not matched
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
      return;
    } catch (err: any) {
      console.error('API Error:', err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal server error', details: err.message }));
      return;
    }
  }

  // -------------------------------------------------------------
  // STATIC ASSET SERVING (Production SPA & Uploads)
  // -------------------------------------------------------------
  const sanitizedPath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.resolve(DIST_DIR, sanitizedPath === '/' || sanitizedPath === '\\' ? 'index.html' : `.${sanitizedPath}`);

  // If file not in DIST_DIR and is in /uploads/, check PUBLIC_DIR
  if (!fs.existsSync(filePath) && sanitizedPath.startsWith('/uploads/')) {
    const publicUploadPath = path.resolve(PUBLIC_DIR, `.${sanitizedPath}`);
    if (fs.existsSync(publicUploadPath) && publicUploadPath.startsWith(PUBLIC_DIR)) {
      filePath = publicUploadPath;
    }
  }

  // Prevent path traversal outside allowed directories
  if (!filePath.startsWith(DIST_DIR) && !filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  // If file doesn't exist or is directory, fallback to index.html (SPA routing)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // Cache control
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } else {
    res.statusCode = 404;
    res.end('Not Found. Please run `npm run build` before starting production server.');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 [VishuMax] Production server running at http://localhost:${PORT}`);
});
