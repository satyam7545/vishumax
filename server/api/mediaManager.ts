import fs from 'fs';
import path from 'path';

const PUBLIC_UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
const DIST_UPLOADS_DIR = path.resolve(process.cwd(), 'dist', 'uploads');

// Ensure upload directories exist
function ensureUploadDirs() {
  if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
    fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
  }
  const distDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distDir) && !fs.existsSync(DIST_UPLOADS_DIR)) {
    fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
  }
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif']);

export function saveUploadedMedia(originalName: string, _mimeType: string, base64Data: string): { success: boolean; url?: string; item?: MediaItem; error?: string } {
  try {
    ensureUploadDirs();

    // Clean base64 header if present (e.g. data:image/png;base64,...)
    const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    // 50MB limit
    if (buffer.length > 50 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 50MB limit' };
    }

    const ext = path.extname(originalName).toLowerCase() || '.png';
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return { success: false, error: 'Only image files (.png, .jpg, .jpeg, .webp, .svg, .gif, .avif) are allowed' };
    }

    // Sanitize base name
    const rawBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50) || 'upload';
    const timestamp = Date.now();
    const finalFilename = `${rawBase}_${timestamp}${ext}`;

    const publicPath = path.join(PUBLIC_UPLOADS_DIR, finalFilename);
    fs.writeFileSync(publicPath, buffer);

    // Also copy to dist/uploads if dist directory exists
    const distDir = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      if (!fs.existsSync(DIST_UPLOADS_DIR)) {
        fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
      }
      fs.writeFileSync(path.join(DIST_UPLOADS_DIR, finalFilename), buffer);
    }

    const publicUrl = `/uploads/${finalFilename}`;
    const item: MediaItem = {
      id: finalFilename,
      name: originalName,
      url: publicUrl,
      size: buffer.length,
      type: ext.replace('.', ''),
      createdAt: new Date().toISOString(),
    };

    return { success: true, url: publicUrl, item };
  } catch (err: any) {
    console.error('Failed to save uploaded media:', err);
    return { success: false, error: err.message || 'Failed to write file' };
  }
}

export function listMediaFiles(): MediaItem[] {
  ensureUploadDirs();
  const items: MediaItem[] = [];

  try {
    if (fs.existsSync(PUBLIC_UPLOADS_DIR)) {
      const files = fs.readdirSync(PUBLIC_UPLOADS_DIR);
      for (const file of files) {
        const fullPath = path.join(PUBLIC_UPLOADS_DIR, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (ALLOWED_EXTENSIONS.has(ext)) {
            items.push({
              id: file,
              name: file,
              url: `/uploads/${file}`,
              size: stat.size,
              type: ext.replace('.', ''),
              createdAt: stat.mtime.toISOString(),
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to list media files:', err);
  }

  // Sort newest first
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function deleteMediaFile(filename: string): boolean {
  try {
    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    const publicPath = path.join(PUBLIC_UPLOADS_DIR, safeFilename);
    const distPath = path.join(DIST_UPLOADS_DIR, safeFilename);

    let deleted = false;
    if (fs.existsSync(publicPath)) {
      fs.unlinkSync(publicPath);
      deleted = true;
    }
    if (fs.existsSync(distPath)) {
      fs.unlinkSync(distPath);
      deleted = true;
    }
    return deleted;
  } catch (err) {
    console.error('Failed to delete media file:', err);
    return false;
  }
}

export function deleteMultipleMediaFiles(filenames: string[]): { deletedCount: number } {
  let count = 0;
  for (const filename of filenames) {
    if (deleteMediaFile(filename)) {
      count++;
    }
  }
  return { deletedCount: count };
}
