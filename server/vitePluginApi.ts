import type { Plugin, ViteDevServer } from 'vite';
import { initDatabase } from './db/database.ts';
import { loginAdmin, verifyAdminToken, changeAdminPassword, updateAdminProfile } from './api/auth.ts';
import {
  applySecurityHeaders,
  checkRateLimit,
  checkAuthRateLimit,
  resetAuthRateLimit,
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

export function sqliteApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-sqlite-api',
    configureServer(server: ViteDevServer) {
      // Initialize SQLite database
      initDatabase();

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        applySecurityHeaders(res);
        res.setHeader('Content-Type', 'application/json');

        const ip = getClientIp(req);

        // Global API rate limit: 120 req/min
        const globalLimit = checkRateLimit(`global:${ip}`, 120, 60 * 1000);
        if (!globalLimit.allowed) {
          res.statusCode = 429;
          res.end(
            JSON.stringify({
              success: false,
              error: `Too many requests. Please try again in ${globalLimit.retryAfterSec}s.`,
            })
          );
          return;
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

        const parsedUrl = new URL(req.url, 'http://localhost');
        const pathname = parsedUrl.pathname;
        const method = req.method;

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

          // 2. PUBLIC: POST /api/inquiries (Contact Form with rate limit and validation)
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

          // 3. AUTH: POST /api/auth/login (Strict brute-force rate limit)
          if (pathname === '/api/auth/login' && method === 'POST') {
            const authLimit = checkAuthRateLimit(ip);
            if (!authLimit.allowed) {
              res.statusCode = 429;
              res.end(
                JSON.stringify({
                  success: false,
                  error: `Too many login attempts. Please wait ${authLimit.retryAfterSec}s before retrying.`,
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

            resetAuthRateLimit(ip);
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

          // -------------------------------------------------------------
          // ALL ROUTES BELOW REQUIRE ADMIN AUTHENTICATION
          // -------------------------------------------------------------
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
            if (!oldPassword || !newPassword) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Current and new password are required' }));
              return;
            }

            const result = changeAdminPassword(user.id, oldPassword, newPassword);
            if (!result.success) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: result.error || 'Failed to change password' }));
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

            const result = updateAdminProfile(user.id, email, name);
            if (!result.success) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: result.error || 'Failed to update admin profile' }));
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
        } catch (err: any) {
          console.error('API Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal server error', details: err.message }));
        }
      });
    },
  };
}
