import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Inbox,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  X,
  Search,
  ArrowUp,
  ArrowDown,
  Globe,
  Menu,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Palette,
  Check,
  Upload,
  UploadCloud,
  Images,
  Copy,
  Eye,
  Loader2,
  CheckSquare,
  Square,
  Send,
  MessageCircle,
  Mail,
  Lock,
  UserCheck,
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { THEMES, DEFAULT_THEME_ID, type ThemeDefinition } from '../types/theme';
import { MediaPickerModal } from './MediaPickerModal';
import type {
  CMSClient,
  CMSProject,
  CMSTestimonial,
  CMSLeader,
  CMSService,
  CMSContactInquiry,
  CMSSiteSettings,
} from '../types/cms';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminUser,
    logout,
    changePassword,
    updateAdminProfile,
    refreshCMSData,
  } = useSiteData();

  const [activeNav, setActiveNav] = useState<
    'overview' | 'projects' | 'clients' | 'testimonials' | 'leaders' | 'media' | 'inquiries' | 'settings' | 'security'
  >('overview');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(true);

  // Full CMS dataset
  const [allData, setAllData] = useState<{
    settings: CMSSiteSettings;
    clients: CMSClient[];
    projects: CMSProject[];
    testimonials: CMSTestimonial[];
    leaders: CMSLeader[];
    services: CMSService[];
    inquiries: CMSContactInquiry[];
  } | null>(null);

  // Media Library State
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [mediaSearch, setMediaSearch] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'contacted' | 'archived'>('all');

  // Modal Editing States
  const [editingProject, setEditingProject] = useState<Partial<CMSProject> | null>(null);
  const [editingClient, setEditingClient] = useState<Partial<CMSClient> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<CMSTestimonial> | null>(null);
  const [editingLeader, setEditingLeader] = useState<Partial<CMSLeader> | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<CMSContactInquiry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string | number; name: string } | null>(null);

  // Security States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adminName, setAdminName] = useState(adminUser?.name || 'Admin');
  const [adminEmail, setAdminEmail] = useState(adminUser?.email || 'admin@vishumax.in');

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getAuthToken = () => localStorage.getItem('vishumax_auth_token') || '';

  // Fetch full CMS data and media files
  const fetchMediaFiles = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/media', {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.files)) {
          setMediaFiles(json.files);
        }
      }
    } catch (err) {
      console.error('Failed to load media files:', err);
    }
  }, []);

  const handleUploadSingleFile = async (file: File): Promise<string | null> => {
    if (file.size > 50 * 1024 * 1024) {
      notify(`"${file.name}" exceeds 50MB size limit`, 'error');
      return null;
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/cms/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({
              name: file.name,
              type: file.type,
              data: base64,
            }),
          });
          const json = await res.json();
          if (res.ok && json.success && json.url) {
            resolve(json.url);
          } else {
            notify(json.error || `Failed to upload ${file.name}`, 'error');
            resolve(null);
          }
        } catch {
          notify(`Network error uploading ${file.name}`, 'error');
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBatchUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploadingMedia(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    let successCount = 0;
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress({ current: i + 1, total: fileArray.length });
      const url = await handleUploadSingleFile(file);
      if (url) successCount++;
    }

    setIsUploadingMedia(false);
    setUploadProgress(null);
    notify(`Successfully uploaded ${successCount} of ${fileArray.length} file(s)!`);
    await fetchMediaFiles();
  };

  const handleBatchDeleteMedia = async () => {
    if (selectedMedia.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedMedia.length} image(s) from the server?`)) return;

    try {
      const res = await fetch('/api/cms/media-batch-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ filenames: selectedMedia }),
      });

      if (res.ok) {
        notify(`Deleted ${selectedMedia.length} image(s) from server`);
        setSelectedMedia([]);
        await fetchMediaFiles();
      } else {
        notify('Failed to delete selected images', 'error');
      }
    } catch {
      notify('Batch delete network error', 'error');
    }
  };

  const handleBatchCopyUrls = () => {
    if (selectedMedia.length === 0) return;
    const urls = mediaFiles
      .filter((f) => selectedMedia.includes(f.id))
      .map((f) => f.url)
      .join('\n');
    navigator.clipboard.writeText(urls);
    notify(`Copied ${selectedMedia.length} image URL(s) to clipboard!`);
  };

  const handleDeleteMedia = async (filename: string) => {
    if (!window.confirm(`Delete image "${filename}" from server?`)) return;
    try {
      const res = await fetch(`/api/cms/media/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (res.ok) {
        notify('Image deleted from server');
        setSelectedMedia((prev) => prev.filter((id) => id !== filename));
        await fetchMediaFiles();
      } else {
        notify('Failed to delete image', 'error');
      }
    } catch {
      notify('Network error', 'error');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    notify('Image URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const fetchAllCMSData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cms/all', {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAllData(json.data);
        }
      }
      await fetchMediaFiles();
    } catch {
      notify('Failed to connect to backend', 'error');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAdminOpen) {
      fetchAllCMSData();
    }
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  const handleClose = () => {
    setIsAdminOpen(false);
    refreshCMSData();
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', ' ');
    }
  };

  // -------------------------------------------------------------
  // API ACTIONS
  // -------------------------------------------------------------

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allData?.settings) return;
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(allData.settings),
      });
      if (res.ok) {
        notify('Site & theme settings updated successfully!');
        await refreshCMSData();
      } else {
        notify('Failed to update settings', 'error');
      }
    } catch {
      notify('Error connecting to backend', 'error');
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      const res = await fetch('/api/cms/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(editingProject),
      });
      if (res.ok) {
        notify('Thumbnail project saved successfully!');
        setEditingProject(null);
        await fetchAllCMSData();
        await refreshCMSData();
      } else {
        notify('Failed to save project', 'error');
      }
    } catch {
      notify('Network error', 'error');
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    try {
      const res = await fetch('/api/cms/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(editingClient),
      });
      if (res.ok) {
        notify('Brand partner saved successfully!');
        setEditingClient(null);
        await fetchAllCMSData();
        await refreshCMSData();
      } else {
        notify('Failed to save brand client', 'error');
      }
    } catch {
      notify('Network error', 'error');
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    try {
      const res = await fetch('/api/cms/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(editingTestimonial),
      });
      if (res.ok) {
        notify('Creator review saved successfully!');
        setEditingTestimonial(null);
        await fetchAllCMSData();
        await refreshCMSData();
      } else {
        notify('Failed to save testimonial', 'error');
      }
    } catch {
      notify('Network error', 'error');
    }
  };

  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeader) return;
    try {
      const res = await fetch('/api/cms/leaders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(editingLeader),
      });
      if (res.ok) {
        notify('Industry leader saved successfully!');
        setEditingLeader(null);
        await fetchAllCMSData();
        await refreshCMSData();
      } else {
        notify('Failed to save leader', 'error');
      }
    } catch {
      notify('Network error', 'error');
    }
  };

  const handleUpdateInquiryStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        notify(`Inquiry marked as ${status}`);
        await fetchAllCMSData();
      }
    } catch {
      notify('Failed to update status', 'error');
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    try {
      const res = await fetch(`/api/cms/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (res.ok) {
        notify(`Item deleted successfully`);
        setDeleteConfirm(null);
        await fetchAllCMSData();
        await refreshCMSData();
      } else {
        notify('Failed to delete item', 'error');
      }
    } catch {
      notify('Error deleting item', 'error');
    }
  };

  const handleReorder = async (table: 'clients' | 'projects' | 'testimonials' | 'leaders', items: any[], index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const orderedIds = newItems.map((item) => item.id);
    try {
      await fetch('/api/cms/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ table, orderedIds }),
      });
      notify('Order updated');
      await fetchAllCMSData();
      await refreshCMSData();
    } catch {
      notify('Failed to reorder', 'error');
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('WARNING: Reset entire database (Thumbnails, Logos, Testimonials, Leaders, Settings) to factory defaults?')) {
      try {
        const res = await fetch('/api/cms/reset', {
          method: 'POST',
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        if (res.ok) {
          notify('Reset database to factory defaults!');
          await fetchAllCMSData();
          await refreshCMSData();
        }
      } catch {
        notify('Failed to reset database', 'error');
      }
    }
  };

  const ImageFieldInput = ({
    label,
    value,
    onChange,
    placeholder,
    aspect = 'video',
  }: {
    label: string;
    value?: string;
    onChange: (val: string) => void;
    placeholder?: string;
    aspect?: 'video' | 'square' | 'portrait';
  }) => {
    const [uploading, setUploading] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const onFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const uploadedUrl = await handleUploadSingleFile(file);
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    };

    const aspectClass =
      aspect === 'portrait'
        ? 'w-10 aspect-[3/4] rounded-lg'
        : aspect === 'square'
        ? 'w-10 h-10 rounded-full'
        : 'w-14 aspect-video rounded-lg';

    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs text-zinc-400 font-medium">{label}</label>
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer transition-colors"
          >
            <Images className="w-3 h-3" />
            <span>Select from Media Library</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className={`${aspectClass} bg-zinc-950 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-inner`}>
            {value ? (
              <img
                src={value}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <ImageIcon className="w-4 h-4 text-zinc-600" />
            )}
          </div>

          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Paste URL or Select / Upload ->'}
            className="flex-1 px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white font-mono placeholder:text-zinc-600 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none transition-all"
          />

          <input
            type="file"
            ref={fileRef}
            onChange={onFilePick}
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            title="Browse Media Library"
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border border-white/10"
          >
            <Images className="w-3.5 h-3.5 text-emerald-400" />
            <span>Library</span>
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-black text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </>
            )}
          </button>
        </div>

        <MediaPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={(url) => onChange(url)}
          currentUrl={value}
          title={`Select ${label}`}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[1000] flex bg-black text-zinc-100 font-sans overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-[1100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold border backdrop-blur-xl ${
              toastType === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
            }`}
          >
            {toastType === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR (Luxury Dark Glassmorphic Studio Theme) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0e]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand & Database Status */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-[0_0_15px_rgba(245,158,11,0.35)] shrink-0">
                <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="7.5" cy="7.5" r="4.2" />
                  <circle cx="16.5" cy="7.5" r="4.2" />
                  <circle cx="7.5" cy="16.5" r="4.2" />
                  <circle cx="16.5" cy="16.5" r="4.2" />
                </svg>
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm text-white tracking-tight">VishuMax Studio</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                  <span>SQLite Active</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            <button
              onClick={() => {
                setActiveNav('overview');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === 'overview'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('projects');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === 'projects'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4" />
                <span>Thumbnails & Works</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-300">
                {allData?.projects.length || 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('clients');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === 'clients'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Proof Brand Logos</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-300">
                {allData?.clients.length || 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('testimonials');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === 'testimonials'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>What Creators Say</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-300">
                {allData?.testimonials.length || 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('leaders');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === 'leaders'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Industry Leaders</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-300">
                {allData?.leaders.length || 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('media');
                fetchMediaFiles();
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === 'media'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Images className="w-4 h-4 text-emerald-400" />
                <span>Media & Uploads</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-300">
                {mediaFiles.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('inquiries');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === 'inquiries'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Inquiries Inbox</span>
              </div>
              {allData?.inquiries && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  {allData.inquiries.filter((i) => i.status === 'new').length} New
                </span>
              )}
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Configuration
            </div>

            <button
              onClick={() => {
                setActiveNav('settings');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === 'settings'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site, Theme & Channels</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('security');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === 'security'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin & Security</span>
            </button>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-zinc-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">{adminUser?.name || 'Admin'}</span>
                <span className="text-[10px] text-zinc-400 font-mono block truncate">{adminUser?.email}</span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-black relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/10 bg-[#0a0a0e]/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-white capitalize font-sans tracking-tight">
              {activeNav === 'overview' && 'Dashboard Overview'}
              {activeNav === 'projects' && 'Thumbnails Showcase & Works'}
              {activeNav === 'clients' && 'Client Roster & Proof Logos'}
              {activeNav === 'testimonials' && 'What Creators Say (Flip Cards)'}
              {activeNav === 'leaders' && 'Industry Leaders Portfolio'}
              {activeNav === 'media' && 'Media Library & Uploads'}
              {activeNav === 'inquiries' && 'Contact Inquiries & Discovery Leads'}
              {activeNav === 'settings' && 'Site Settings, Themes & Messaging Channels'}
              {activeNav === 'security' && 'Admin Account & Security'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Body View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 relative">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-400 space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono">Syncing from SQLite Database...</span>
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD OVERVIEW */}
              {activeNav === 'overview' && allData && (
                <div className="space-y-6 max-w-6xl">
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-2 hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center justify-between text-zinc-400 text-xs">
                        <span>Total Thumbnails</span>
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{allData.projects.length}</div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>All published to live marquee</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-2 hover:border-amber-500/30 transition-all">
                      <div className="flex items-center justify-between text-zinc-400 text-xs">
                        <span>Proof Brands</span>
                        <Layers className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{allData.clients.length}</div>
                      <div className="text-[11px] text-zinc-400">Continuous marquee ticker</div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-2 hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center justify-between text-zinc-400 text-xs">
                        <span>Inquiries Inbox</span>
                        <Inbox className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{allData.inquiries.length}</div>
                      <div className="text-[11px] text-emerald-400">
                        {allData.inquiries.filter((i) => i.status === 'new').length} require response
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-2 hover:border-teal-500/30 transition-all">
                      <div className="flex items-center justify-between text-zinc-400 text-xs">
                        <span>Views Driven</span>
                        <Sparkles className="w-4 h-4 text-teal-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{allData.settings.aboutViewsDriven || '100M+'}</div>
                      <div className="text-[11px] text-zinc-400">Lifetime client impact</div>
                    </div>
                  </div>

                  {/* Recent Inquiries Table Preview */}
                  <div className="p-6 rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white">Recent Discovery Inquiries</h3>
                      <button
                        onClick={() => setActiveNav('inquiries')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                      >
                        View all inquiries ({allData.inquiries.length}) →
                      </button>
                    </div>

                    {allData.inquiries.length === 0 ? (
                      <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                        No inquiries submitted yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-white/10 text-zinc-400">
                              <th className="pb-3 font-semibold">Creator</th>
                              <th className="pb-3 font-semibold">Channel</th>
                              <th className="pb-3 font-semibold">Project Type</th>
                              <th className="pb-3 font-semibold">Status</th>
                              <th className="pb-3 font-semibold">Date</th>
                              <th className="pb-3 text-right font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/80">
                            {allData.inquiries.slice(0, 5).map((inq) => (
                              <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3 font-medium text-white">{inq.name}</td>
                                <td className="py-3 text-zinc-400">{inq.channel_url}</td>
                                <td className="py-3 text-zinc-300">{inq.project_type}</td>
                                <td className="py-3">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                                      inq.status === 'new'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : inq.status === 'reviewed'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : inq.status === 'contacted'
                                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                                    }`}
                                  >
                                    {inq.status}
                                  </span>
                                </td>
                                <td className="py-3 text-zinc-400 font-mono text-[11px]">
                                  {new Date(inq.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 text-right">
                                  <button
                                    onClick={() => setViewingInquiry(inq)}
                                    className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs cursor-pointer transition-colors"
                                  >
                                    Review
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. THUMBNAILS & WORKS MANAGER */}
              {activeNav === 'projects' && allData && (
                <div className="space-y-6 max-w-6xl">
                  {/* Actions Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search showcase thumbnails..."
                          className="pl-9 pr-4 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 w-48 sm:w-64"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setEditingProject({
                          title: '',
                          slug: '',
                          category: 'Documentary',
                          cover_image: '',
                          avatar: '',
                          video_duration: '12:00',
                          views_count: '2.4M Views',
                          ctr_before: '4.5%',
                          ctr_after: '14.8%',
                          ctr_gain: '+19.2% CTR',
                          channel: '@Creator',
                          niche: 'Education',
                          hook: 'High-contrast psychological packaging hook triggering instant curiosity.',
                          strategy_breakdown: [
                            'Focused visual hierarchy with high contrast',
                            'Optimized for mobile YouTube dark mode feed',
                          ],
                          graphic_type: 'custom',
                          featured: true,
                          published: true,
                          sort_order: allData.projects.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Thumbnail Case Study</span>
                    </button>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {['All', 'Documentary', 'Tech', 'Travel', 'Podcast/Interviews', 'Health'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProjectCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          projectCategoryFilter === cat
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                            : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 border border-white/5'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Projects Table */}
                  <div className="rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-zinc-950/60 border-b border-white/10 text-zinc-400">
                            <th className="p-4 font-semibold">Order</th>
                            <th className="p-4 font-semibold">Thumbnail</th>
                            <th className="p-4 font-semibold">Channel & Title</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Views Metric</th>
                            <th className="p-4 font-semibold">CTR Gain</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80">
                          {allData.projects
                            .filter((p) => {
                              const matchesSearch =
                                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (p.channel || '').toLowerCase().includes(searchQuery.toLowerCase());
                              const matchesCat =
                                projectCategoryFilter === 'All' ||
                                (p.category || '').toLowerCase().includes(projectCategoryFilter.toLowerCase());
                              return matchesSearch && matchesCat;
                            })
                            .map((proj, idx) => (
                              <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 font-mono text-zinc-500">
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleReorder('projects', allData.projects, idx, 'up')}
                                      disabled={idx === 0}
                                      className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleReorder('projects', allData.projects, idx, 'down')}
                                      disabled={idx === allData.projects.length - 1}
                                      className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="ml-1 text-[11px]">#{idx + 1}</span>
                                  </div>
                                </td>

                                <td className="p-4">
                                  <div className="w-20 aspect-video rounded-lg overflow-hidden bg-zinc-950 border border-white/10 relative">
                                    {proj.cover_image ? (
                                      <img
                                        src={proj.cover_image}
                                        alt={proj.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-500 font-mono">
                                        No Image
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td className="p-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    {proj.avatar ? (
                                      <img src={proj.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-white/10" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                                        {(proj.channel || 'C')[0]}
                                      </div>
                                    )}
                                    <span className="text-[11px] font-semibold text-zinc-400">{proj.channel || '@Channel'}</span>
                                  </div>
                                  <div className="font-semibold text-white line-clamp-1">{proj.title}</div>
                                </td>

                                <td className="p-4">
                                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium text-[11px]">
                                    {proj.category || 'Documentary'}
                                  </span>
                                </td>

                                <td className="p-4 font-mono font-bold text-white text-[11px]">
                                  {proj.views_count || '1.2M Views'}
                                </td>

                                <td className="p-4 font-mono">
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                                    {proj.ctr_gain || `${proj.ctr_before} → ${proj.ctr_after}`}
                                  </span>
                                </td>

                                <td className="p-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                                      proj.published
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-zinc-800 text-zinc-400'
                                    }`}
                                  >
                                    {proj.published ? 'Live' : 'Draft'}
                                  </span>
                                </td>

                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setEditingProject(proj)}
                                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                      title="Edit project"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm({ type: 'projects', id: proj.id, name: proj.title })}
                                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                      title="Delete project"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PROOF LOGOS / CLIENTS */}
              {activeNav === 'clients' && allData && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-zinc-300">Brand Proof Logos & Marquee Channels</h2>
                    <button
                      onClick={() =>
                        setEditingClient({
                          name: '',
                          slug: '',
                          logo: '',
                          image: '',
                          description: '',
                          audience: '1.2M+ Subs',
                          category: 'Finance',
                          subtext: 'MEDIA',
                          badge: 'PARTNER',
                          sort_order: allData.clients.length + 1,
                          featured: true,
                          published: true,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Brand</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allData.clients.map((client, idx) => (
                      <div
                        key={client.id}
                        className="p-5 rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0">
                            {client.logo ? (
                              <img src={client.logo} alt={client.name} className="w-full h-full object-cover" />
                            ) : (
                              <Layers className="w-5 h-5 text-zinc-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{client.name}</h4>
                            <span className="text-[11px] text-zinc-400 font-mono">{client.audience || client.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleReorder('clients', allData.clients, idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorder('clients', allData.clients, idx, 'down')}
                            disabled={idx === allData.clients.length - 1}
                            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingClient(client)}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'clients', id: client.id, name: client.name })}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. WHAT CREATORS SAY (TESTIMONIALS) */}
              {activeNav === 'testimonials' && allData && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-zinc-300">Creator Flip Card Testimonials</h2>
                    <button
                      onClick={() =>
                        setEditingTestimonial({
                          name: '',
                          role: 'Creator & Founder',
                          company: 'YouTube Channel',
                          channel: 'Channel Name',
                          avatar: '',
                          rating: 5,
                          quote: 'Working with VishuMax completely leveled up our video packaging.',
                          detailed_bio: 'YouTube Creator focused on high growth.',
                          subscribers: '1.2M Subs',
                          impact_metrics: ['+28% CTR Growth', '3.5x More Views'],
                          stats: [{ label: 'CTR Growth', value: '+28%' }],
                          sort_order: allData.testimonials.length + 1,
                          published: true,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Creator Review</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allData.testimonials.map((t, idx) => (
                      <div
                        key={t.id}
                        className="p-5 rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-950 border border-white/10">
                                {t.avatar ? (
                                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-zinc-400">
                                    {t.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                                <span className="text-[11px] text-zinc-400">{t.role}</span>
                              </div>
                            </div>
                            <span className="font-mono text-xs text-amber-400 font-bold">★ {t.rating || 5}.0</span>
                          </div>

                          <p className="text-xs text-zinc-300 italic line-clamp-3">"{t.quote}"</p>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-emerald-400 font-semibold">{t.subscribers || t.company}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleReorder('testimonials', allData.testimonials, idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReorder('testimonials', allData.testimonials, idx, 'down')}
                              disabled={idx === allData.testimonials.length - 1}
                              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingTestimonial(t)}
                              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'testimonials', id: t.id, name: t.name })}
                              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. INDUSTRY LEADERS */}
              {activeNav === 'leaders' && allData && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-zinc-300">Trusted Industry Leaders</h2>
                    <button
                      onClick={() =>
                        setEditingLeader({
                          name: '',
                          role: 'Tech Founder & Investor',
                          channel: 'Channel (1.5M)',
                          ctr_gain: '+24.5% CTR',
                          image: '',
                          quote: 'VishuMax delivers packaging at a world-class level.',
                          featured_topic: 'Strategy',
                          sort_order: allData.leaders.length + 1,
                          published: true,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Leader</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {allData.leaders.map((leader, idx) => (
                      <div
                        key={leader.id}
                        className="rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-emerald-500/30 transition-all"
                      >
                        <div className="aspect-[3/4] w-full bg-zinc-950 relative overflow-hidden">
                          {leader.image ? (
                            <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <Users className="w-8 h-8" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                            {leader.ctr_gain}
                          </div>
                        </div>

                        <div className="p-4 space-y-2">
                          <div>
                            <h4 className="font-bold text-white text-sm">{leader.name}</h4>
                            <span className="text-[11px] text-zinc-400 block">{leader.role}</span>
                            <span className="text-[10px] text-zinc-500 font-mono block">{leader.channel}</span>
                          </div>

                          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-zinc-500">#{idx + 1}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleReorder('leaders', allData.leaders, idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleReorder('leaders', allData.leaders, idx, 'down')}
                                disabled={idx === allData.leaders.length - 1}
                                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingLeader(leader)}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'leaders', id: leader.id, name: leader.name })}
                                className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. MEDIA LIBRARY & UPLOADS */}
              {activeNav === 'media' && (
                <div className="space-y-6 max-w-6xl">
                  {/* Upload Drop Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files) {
                        handleBatchUploadFiles(e.dataTransfer.files);
                      }
                    }}
                    className="p-8 rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border-2 border-dashed border-white/15 hover:border-emerald-500/50 flex flex-col items-center justify-center text-center space-y-3 transition-all cursor-pointer group"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.accept = 'image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) handleBatchUploadFiles(files);
                      };
                      input.click();
                    }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500/40 transition-all shadow-md">
                      {isUploadingMedia ? (
                        <Loader2 className="w-7 h-7 animate-spin" />
                      ) : (
                        <UploadCloud className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        {isUploadingMedia
                          ? `Uploading ${uploadProgress?.current} of ${uploadProgress?.total}...`
                          : 'Click or Drag & Drop Images to Upload'}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Supports PNG, JPG, WebP, SVG, AVIF up to 50MB each.
                      </p>
                    </div>
                  </div>

                  {/* Actions & Filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={mediaSearch}
                        onChange={(e) => setMediaSearch(e.target.value)}
                        placeholder="Search media files..."
                        className="pl-9 pr-4 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 w-48 sm:w-64"
                      />
                    </div>

                    {selectedMedia.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-400 mr-2">
                          {selectedMedia.length} selected
                        </span>
                        <button
                          onClick={handleBatchCopyUrls}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-200 font-medium flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URLs</span>
                        </button>
                        <button
                          onClick={handleBatchDeleteMedia}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-300 font-medium flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Selected</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Media Grid */}
                  {mediaFiles.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-[#0e0e14]/90 border border-white/10 text-zinc-500 text-xs font-mono">
                      No media files uploaded yet. Upload thumbnails above!
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {mediaFiles
                        .filter((f) => f.name.toLowerCase().includes(mediaSearch.toLowerCase()))
                        .map((file) => {
                          const isSelected = selectedMedia.includes(file.id);
                          return (
                            <div
                              key={file.id}
                              className={`group relative rounded-2xl overflow-hidden bg-zinc-950 border transition-all ${
                                isSelected
                                  ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                  : 'border-white/10 hover:border-white/25'
                              }`}
                            >
                              {/* Selection checkbox */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMedia((prev) =>
                                    prev.includes(file.id) ? prev.filter((id) => id !== file.id) : [...prev, file.id]
                                  );
                                }}
                                className="absolute top-2 left-2 z-20 p-1 rounded-lg bg-black/60 backdrop-blur-md text-white cursor-pointer"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-zinc-400" />
                                )}
                              </button>

                              {/* Thumbnail preview */}
                              <div className="aspect-video w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              {/* Card details */}
                              <div className="p-2.5 space-y-1">
                                <span className="text-[11px] font-medium text-white block truncate" title={file.name}>
                                  {file.name}
                                </span>
                                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                                  <span>{(file.size / 1024).toFixed(0)} KB</span>
                                  <span className="uppercase">{file.type}</span>
                                </div>
                              </div>

                              {/* Hover overlay actions */}
                              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2 pointer-events-none group-hover:pointer-events-auto">
                                <button
                                  onClick={() => {
                                    setEditingProject({
                                      title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                                      slug: '',
                                      category: 'Documentary',
                                      cover_image: file.url,
                                      avatar: '',
                                      video_duration: '12:00',
                                      views_count: '2.4M Views',
                                      ctr_before: '4.5%',
                                      ctr_after: '14.8%',
                                      ctr_gain: '+19.2% CTR',
                                      channel: '@Creator',
                                      niche: 'Education',
                                      hook: 'High-contrast psychological packaging hook.',
                                      strategy_breakdown: [
                                        'Focused visual hierarchy with clear contrast',
                                        'Optimized for mobile YouTube dark mode feed',
                                      ],
                                      graphic_type: 'custom',
                                      featured: true,
                                      published: true,
                                      sort_order: (allData?.projects.length || 0) + 1,
                                    });
                                  }}
                                  title="Feature this in Works Showcase"
                                  className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 cursor-pointer transition-colors"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleCopyUrl(file.url)}
                                  title="Copy Image URL"
                                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                                >
                                  {copiedUrl === file.url ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => setPreviewMedia(file)}
                                  title="Preview Image"
                                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMedia(file.id)}
                                  title="Delete Image"
                                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* 8. INQUIRIES INBOX */}
              {activeNav === 'inquiries' && allData && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {(['all', 'new', 'reviewed', 'contacted', 'archived'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setInquiryStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase font-semibold transition-all cursor-pointer ${
                            inquiryStatusFilter === st
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-zinc-950/60 border-b border-white/10 text-zinc-400">
                            <th className="p-4 font-semibold">Creator Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Channel</th>
                            <th className="p-4 font-semibold">Project Type</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Submitted</th>
                            <th className="p-4 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80">
                          {allData.inquiries
                            .filter((i) => (inquiryStatusFilter === 'all' ? true : i.status === inquiryStatusFilter))
                            .map((inq) => (
                              <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 font-semibold text-white">{inq.name}</td>
                                <td className="p-4 text-zinc-300 font-mono text-[11px]">{inq.email}</td>
                                <td className="p-4 text-zinc-400">{inq.channel_url || '—'}</td>
                                <td className="p-4 text-zinc-300">{inq.project_type || '—'}</td>
                                <td className="p-4">
                                  <select
                                    value={inq.status}
                                    onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                                    className="px-2.5 py-1 rounded-xl bg-zinc-950 border border-white/10 text-[10px] font-mono uppercase font-semibold text-white focus:outline-none focus:border-emerald-500/60 cursor-pointer"
                                  >
                                    <option value="new">NEW</option>
                                    <option value="reviewed">REVIEWED</option>
                                    <option value="contacted">CONTACTED</option>
                                    <option value="archived">ARCHIVED</option>
                                  </select>
                                </td>
                                <td className="p-4 font-mono text-zinc-400 text-[11px]">
                                  {new Date(inq.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => setViewingInquiry(inq)}
                                    className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs cursor-pointer transition-colors"
                                  >
                                    Inspect
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. SITE SETTINGS, THEMES & ALL FRONTEND CONTROLS */}
              {activeNav === 'settings' && allData && (
                <div className="space-y-6 max-w-4xl">
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    {/* 1. Theme Selector */}
                    <div className="p-6 rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Palette className="w-4 h-4 text-emerald-400" />
                        <span>Accent Color & Atmospheric Glow Theme</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(Object.values(THEMES) as ThemeDefinition[]).map((th) => {
                          const isSelected = (allData.settings.theme || DEFAULT_THEME_ID) === th.id;
                          return (
                            <button
                              key={th.id}
                              type="button"
                              onClick={() => {
                                setAllData({
                                  ...allData,
                                  settings: { ...allData.settings, theme: th.id },
                                });
                              }}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-emerald-500/10 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                  : 'bg-zinc-950/60 border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="w-4 h-4 rounded-full border border-white/20"
                                  style={{ background: th.primary }}
                                />
                                <span className="text-xs font-semibold text-white">{th.name}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Brand & Header Identity */}
                    <div className="p-6 rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Settings className="w-4 h-4 text-emerald-400" />
                        <span>Brand & Header Identity</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Brand Word 1</label>
                          <input
                            type="text"
                            value={allData.settings.brandLine1 || 'Vishu'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, brandLine1: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Brand Word 2 (Highlighted)</label>
                          <input
                            type="text"
                            value={allData.settings.brandLine2 || 'Max'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, brandLine2: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ImageFieldInput
                          label="Brand Logo Icon (Optional)"
                          value={allData.settings.brandLogoImage || ''}
                          onChange={(val) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, brandLogoImage: val },
                            })
                          }
                          placeholder="Upload or pick logo..."
                          aspect="square"
                        />
                        <ImageFieldInput
                          label="Website Favicon (Browser Tab Icon)"
                          value={allData.settings.faviconUrl || ''}
                          onChange={(val) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, faviconUrl: val },
                            })
                          }
                          placeholder="Upload or pick favicon (.png, .ico, .svg)..."
                          aspect="square"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Navbar Available Spots Count</label>
                          <input
                            type="number"
                            value={allData.settings.slotsRemaining !== undefined ? allData.settings.slotsRemaining : 2}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, slotsRemaining: parseInt(e.target.value, 10) || 0 },
                              })
                            }
                            placeholder="e.g. 2"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                          <span className="text-[10px] text-zinc-500 mt-1 block">Renders "{allData.settings.slotsRemaining || 2} Spots Remaining" radar badge in header</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Hero Section Packaging & Headlines */}
                    <div className="p-6 rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <span>Hero Section Content</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Headline Main Line</label>
                          <input
                            type="text"
                            value={allData.settings.heroHeadlinePrefix || 'We make you believe in'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, heroHeadlinePrefix: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Headline Accent (Italic Serif)</label>
                          <input
                            type="text"
                            value={allData.settings.heroHeadlineAccent || 'Power of packaging.'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, heroHeadlineAccent: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Quote Body</label>
                          <input
                            type="text"
                            value={allData.settings.heroAttributionQuote || "“If people don't click, so you want to give them something to click.”"}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, heroAttributionQuote: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Quote Attribution</label>
                          <input
                            type="text"
                            value={allData.settings.heroAttributionAuthor || 'Mr Beast*'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, heroAttributionAuthor: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Views Metric Counter</label>
                          <input
                            type="text"
                            value={allData.settings.heroViewsStat || 'We generated 80M+ views'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, heroViewsStat: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Hero Primary CTA Button Label</label>
                          <input
                            type="text"
                            value={allData.settings.heroCtaText || 'Book a free discovery call'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, heroCtaText: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. About / Bio Section */}
                    <div className="p-6 rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>About / Bio Section</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Creator Full Name</label>
                          <input
                            type="text"
                            value={allData.settings.aboutName || 'Vishal Gupta'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, aboutName: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium">Bio Section Heading</label>
                          <input
                            type="text"
                            value={allData.settings.aboutHeading || 'About Vishal Gupta'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, aboutHeading: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 mb-1 font-medium">Bio Paragraph 1</label>
                        <textarea
                          rows={2}
                          value={allData.settings.aboutBioParagraph1 || ''}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutBioParagraph1: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 mb-1 font-medium">Bio Paragraph 2</label>
                        <textarea
                          rows={2}
                          value={allData.settings.aboutBioParagraph2 || ''}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutBioParagraph2: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <ImageFieldInput
                        label="Studio Portrait Photo"
                        value={allData.settings.aboutPortraitImage || ''}
                        onChange={(val) =>
                          setAllData({
                            ...allData,
                            settings: { ...allData.settings, aboutPortraitImage: val },
                          })
                        }
                        placeholder="Upload or pick portrait image..."
                        aspect="square"
                      />
                    </div>

                    {/* 5. Direct Messaging & Contact Channels */}
                    <div className="p-6 rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Send className="w-4 h-4 text-sky-400" />
                        <span>Direct Messaging & Contact Channels</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-amber-400" />
                            <span>Contact Email (Footer & Inquiry)</span>
                          </label>
                          <input
                            type="email"
                            value={allData.settings.contactEmail || 'contact@vishumax.in'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, contactEmail: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/60"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-sky-400" />
                            <span>Telegram Username or URL</span>
                          </label>
                          <input
                            type="text"
                            value={allData.settings.socialTelegram || 'vishumax'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, socialTelegram: e.target.value },
                              })
                            }
                            placeholder="username"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/60"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp Phone Number</span>
                          </label>
                          <input
                            type="text"
                            value={allData.settings.socialWhatsapp || '+91 98765 43210'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, socialWhatsapp: e.target.value },
                              })
                            }
                            placeholder="+91..."
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/60"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-400 mb-1 font-medium flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Discord Username</span>
                          </label>
                          <input
                            type="text"
                            value={allData.settings.socialDiscord || 'vishumax'}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, socialDiscord: e.target.value },
                              })
                            }
                            placeholder="username"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/60"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save & Sync All Configurations</span>
                    </button>
                  </form>
                </div>
              )}

              {/* 10. ADMIN ACCOUNT & SECURITY */}
              {activeNav === 'security' && (
                <div className="space-y-6 max-w-2xl">
                  {/* Profile Form */}
                  <div className="p-6 rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>Administrator Profile</span>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const success = await updateAdminProfile(adminEmail, adminName);
                        if (success) {
                          notify('Admin profile updated!');
                        } else {
                          notify('Failed to update profile', 'error');
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Admin Display Name</label>
                        <input
                          type="text"
                          required
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Admin Email Address</label>
                        <input
                          type="email"
                          required
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold cursor-pointer"
                      >
                        Update Profile
                      </button>
                    </form>
                  </div>

                  {/* Password Change */}
                  <div className="p-6 rounded-3xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Change Administrator Password</span>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (newPassword.length < 8) {
                          notify('New password must be at least 8 characters long', 'error');
                          return;
                        }

                        const res = await changePassword(oldPassword, newPassword);
                        if (res.success) {
                          notify('Password updated successfully in database!');
                          setOldPassword('');
                          setNewPassword('');
                        } else {
                          notify(res.error || 'Failed to update password', 'error');
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Current Password</label>
                        <input
                          type="password"
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">New Password (Min 8 characters)</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs shadow-md cursor-pointer"
                      >
                        Update Password in Database
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT/ADD THUMBNAIL PROJECT */}
      {/* ------------------------------------------------------------- */}
      {editingProject && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0a0a0e]/98 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] my-auto space-y-4 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{editingProject.id ? 'Edit Thumbnail Case Study' : 'New Thumbnail Case Study'}</span>
              </h3>
              <button onClick={() => setEditingProject(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Video / Thumbnail Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Inside India's Floating Slum..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                />
              </div>

              {/* Category Selection with Quick Chips */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Category *</label>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {['Documentary', 'Tech', 'Travel', 'Podcast/Interviews', 'Health'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, category: cat })}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-colors ${
                        editingProject.category === cat
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={editingProject.category || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  placeholder="Type or select a category above..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Channel Name / Handle *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.channel || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, channel: e.target.value })}
                    placeholder="e.g. @KKCreate"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Views Count Metric</label>
                  <input
                    type="text"
                    value={editingProject.views_count || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, views_count: e.target.value })}
                    placeholder="e.g. 9.5M Views"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">
                  Attached Redirect Link / Video URL (Opens when user clicks card)
                </label>
                <input
                  type="text"
                  value={editingProject.link || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or custom link"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white placeholder:text-zinc-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageFieldInput
                  label="Channel / Creator Avatar Logo"
                  value={editingProject.avatar || ''}
                  onChange={(val) => setEditingProject({ ...editingProject, avatar: val })}
                  placeholder="Pick avatar or paste URL..."
                  aspect="square"
                />
                <ImageFieldInput
                  label="Thumbnail High-Res Graphic Cover"
                  value={editingProject.cover_image || ''}
                  onChange={(val) => setEditingProject({ ...editingProject, cover_image: val })}
                  placeholder="Pick thumbnail or paste URL..."
                  aspect="video"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 font-medium">CTR Before</label>
                  <input
                    type="text"
                    value={editingProject.ctr_before || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, ctr_before: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs text-zinc-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 font-medium">CTR After</label>
                  <input
                    type="text"
                    value={editingProject.ctr_after || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, ctr_after: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 font-medium">CTR Uplift Badge</label>
                  <input
                    type="text"
                    value={editingProject.ctr_gain || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, ctr_gain: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Packaging Psychology Hook</label>
                <textarea
                  rows={2}
                  value={editingProject.hook || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, hook: e.target.value })}
                  placeholder="Describe the curiosity gap, focal point, and contrast strategy..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.published !== false}
                    onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                    className="rounded border-white/20 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Publish to Live Works Showcase</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs shadow-md cursor-pointer"
                  >
                    Save Thumbnail
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT/ADD BRAND CLIENT */}
      {/* ------------------------------------------------------------- */}
      {editingClient && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-md bg-[#0a0a0e]/98 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-4 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">
                {editingClient.id ? 'Edit Brand Partner' : 'Add Brand Partner'}
              </h3>
              <button onClick={() => setEditingClient(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Brand / Channel Name *</label>
                <input
                  type="text"
                  required
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                />
              </div>

              <ImageFieldInput
                label="Channel Icon / Brand Logo"
                value={editingClient.logo || ''}
                onChange={(val) => setEditingClient({ ...editingClient, logo: val })}
                placeholder="Upload logo or paste image URL..."
                aspect="square"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Subtext (e.g. MEDIA)</label>
                  <input
                    type="text"
                    value={editingClient.subtext || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, subtext: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Audience (e.g. 1.8M)</label>
                  <input
                    type="text"
                    value={editingClient.audience || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, audience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT/ADD TESTIMONIAL */}
      {/* ------------------------------------------------------------- */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-lg bg-[#0a0a0e]/98 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-4 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">
                {editingTestimonial.id ? 'Edit Creator Review' : 'Add Creator Review'}
              </h3>
              <button onClick={() => setEditingTestimonial(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Creator Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Role / Channel *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <ImageFieldInput
                label="Creator Portrait Avatar"
                value={editingTestimonial.avatar || ''}
                onChange={(val) => setEditingTestimonial({ ...editingTestimonial, avatar: val })}
                placeholder="Upload avatar or paste image URL..."
                aspect="square"
              />

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Creator Review / Quote *</label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.quote || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Subscribers / Channel Info</label>
                  <input
                    type="text"
                    value={editingTestimonial.subscribers || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, subscribers: e.target.value })}
                    placeholder="1.2M Subs"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Rating (1 to 5 Stars)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT/ADD INDUSTRY LEADER */}
      {/* ------------------------------------------------------------- */}
      {editingLeader && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-md bg-[#0a0a0e]/98 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-4 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">
                {editingLeader.id ? 'Edit Industry Leader' : 'Add Industry Leader'}
              </h3>
              <button onClick={() => setEditingLeader(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Leader Name *</label>
                <input
                  type="text"
                  required
                  value={editingLeader.name || ''}
                  onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={editingLeader.role || ''}
                    onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">CTR Gain</label>
                  <input
                    type="text"
                    value={editingLeader.ctr_gain || ''}
                    onChange={(e) => setEditingLeader({ ...editingLeader, ctr_gain: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <ImageFieldInput
                label="Portrait Image (3:4 Vertical)"
                value={editingLeader.image || ''}
                onChange={(val) => setEditingLeader({ ...editingLeader, image: val })}
                placeholder="Upload portrait or paste image URL..."
                aspect="portrait"
              />

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Channel / Platform</label>
                <input
                  type="text"
                  value={editingLeader.channel || ''}
                  onChange={(e) => setEditingLeader({ ...editingLeader, channel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Quote / Endorsement</label>
                <textarea
                  rows={2}
                  value={editingLeader.quote || ''}
                  onChange={(e) => setEditingLeader({ ...editingLeader, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingLeader(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: VIEW INQUIRY */}
      {/* ------------------------------------------------------------- */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-lg bg-[#0a0a0e]/98 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-4 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-base text-white">{viewingInquiry.name}</h3>
                <span className="text-xs text-zinc-400 font-mono">{viewingInquiry.email}</span>
              </div>
              <button onClick={() => setViewingInquiry(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-zinc-950 border border-white/10">
                <div>
                  <span className="text-zinc-500 font-medium block">Channel / Social</span>
                  <span className="text-white font-semibold">{viewingInquiry.channel_url || '—'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium block">Project Type</span>
                  <span className="text-white font-semibold">{viewingInquiry.project_type || '—'}</span>
                </div>
              </div>

              {viewingInquiry.message && (
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 space-y-1">
                  <span className="text-zinc-500 font-medium block">Message</span>
                  <p className="text-zinc-200 whitespace-pre-wrap">{viewingInquiry.message}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-[11px] text-zinc-500 font-mono">
                Received: {new Date(viewingInquiry.created_at).toLocaleString()}
              </span>
              <button
                onClick={() => setViewingInquiry(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-sm bg-[#0a0a0e]/98 backdrop-blur-2xl border border-rose-500/30 rounded-3xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-4 text-center text-zinc-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Delete "{deleteConfirm.name}"?</h3>
            <p className="text-xs text-zinc-400">
              This action will permanently delete this item from the SQLite database.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: FULLSCREEN IMAGE PREVIEW */}
      {/* ------------------------------------------------------------- */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] bg-zinc-950 border border-white/15 rounded-3xl p-2 overflow-hidden shadow-2xl">
            <img src={previewMedia.url} alt={previewMedia.name} className="w-full h-full object-contain max-h-[80vh] rounded-2xl" />
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
