import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Briefcase,
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
  Check
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { THEMES, DEFAULT_THEME_ID } from '../types/theme';
import type {
  CMSClient,
  CMSProject,
  CMSTestimonial,
  CMSLeader,
  CMSService,
  CMSContactInquiry,
  CMSSiteSettings,
} from '../types/cms';

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
    'overview' | 'projects' | 'clients' | 'testimonials' | 'leaders' | 'services' | 'inquiries' | 'settings' | 'security'
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

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'contacted' | 'archived'>('all');

  // Modal Editing States
  const [editingProject, setEditingProject] = useState<Partial<CMSProject> | null>(null);
  const [editingClient, setEditingClient] = useState<Partial<CMSClient> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<CMSTestimonial> | null>(null);
  const [editingLeader, setEditingLeader] = useState<Partial<CMSLeader> | null>(null);
  const [editingService, setEditingService] = useState<Partial<CMSService> | null>(null);
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

  // Fetch full CMS data
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
        notify('Site settings & SEO saved to SQLite database!');
        await refreshCMSData();
      } else {
        notify('Failed to save settings', 'error');
      }
    } catch {
      notify('Network error', 'error');
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
        notify('Project saved to database!');
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
        notify('Client / Brand logo saved!');
        setEditingClient(null);
        await fetchAllCMSData();
        await refreshCMSData();
      } else {
        notify('Failed to save client', 'error');
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
        notify('Testimonial saved to database!');
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
        notify('Industry leader saved to database!');
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

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      const res = await fetch('/api/cms/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(editingService),
      });
      if (res.ok) {
        notify('Service package saved to database!');
        setEditingService(null);
        await fetchAllCMSData();
        await refreshCMSData();
      } else {
        notify('Failed to save service', 'error');
      }
    } catch {
      notify('Network error', 'error');
    }
  };

  const handleUpdateInquiryStatus = async (id: number, status: 'new' | 'reviewed' | 'contacted' | 'archived') => {
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
        await refreshCMSData();
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

  const handleReorder = async (table: 'clients' | 'projects' | 'testimonials' | 'leaders' | 'services', items: any[], index: number, direction: 'up' | 'down') => {
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
    if (window.confirm('WARNING: Reset entire database (Projects, Clients, Testimonials, Leaders, Settings) to factory defaults?')) {
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

  return (
    <div className="fixed inset-0 z-[1000] flex bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-[1100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border ${
              toastType === 'success'
                ? 'bg-emerald-600/95 border-emerald-400 text-white'
                : 'bg-rose-600/95 border-rose-400 text-white'
            }`}
          >
            {toastType === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR (Clean Slate Studio Theme) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-slate-700/60 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand & Database Status */}
          <div className="p-5 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md font-bold">
                TF
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Studio CMS</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SQLite Active</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'overview'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'projects'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4" />
                <span>Featured Projects</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300">
                {allData?.projects.length || 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('clients');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'clients'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Proof Brands & Clients</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300">
                {allData?.clients.length || 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('testimonials');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'testimonials'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Testimonials</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300">
                {allData?.testimonials.length || 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('leaders');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'leaders'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Industry Leaders</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300">
                {allData?.leaders.length || 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('services');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'services'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>Services & Offerings</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300">
                {allData?.services.length || 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('inquiries');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'inquiries'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
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

            <div className="pt-2 pb-1 px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Configuration
            </div>

            <button
              onClick={() => {
                setActiveNav('settings');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'settings'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site & SEO Settings</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('security');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'security'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin & Security</span>
            </button>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-700/60 space-y-3 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0">
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">{adminUser?.name || 'Admin'}</span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">{adminUser?.email}</span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0f172a]">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-[#1e293b]/60 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-white capitalize">
              {activeNav === 'overview' && 'Dashboard Overview'}
              {activeNav === 'projects' && 'Featured Case Studies & Thumbnails'}
              {activeNav === 'clients' && 'Client Roster & Proof Logos'}
              {activeNav === 'testimonials' && 'Client Testimonials & Flip Cards'}
              {activeNav === 'leaders' && 'Industry Leaders Portfolio'}
              {activeNav === 'services' && 'Service Packages'}
              {activeNav === 'inquiries' && 'Contact Inquiries & Leads'}
              {activeNav === 'settings' && 'Site Settings, SEO & Visibility'}
              {activeNav === 'security' && 'Admin Account & Security'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Body View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono">Syncing from SQLite Database...</span>
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD OVERVIEW */}
              {activeNav === 'overview' && allData && (
                <div className="space-y-6 max-w-6xl">
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>Total Case Studies</span>
                        <ImageIcon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{allData.projects.length}</div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>All published to live site</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>Proof Brands</span>
                        <Layers className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{allData.clients.length}</div>
                      <div className="text-[11px] text-slate-400">Continuous marquee ticker</div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>Inquiries Inbox</span>
                        <Inbox className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{allData.inquiries.length}</div>
                      <div className="text-[11px] text-emerald-400">
                        {allData.inquiries.filter((i) => i.status === 'new').length} require response
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>Views Driven</span>
                        <Sparkles className="w-4 h-4 text-rose-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">{allData.settings.aboutViewsDriven}</div>
                      <div className="text-[11px] text-slate-400">Lifetime client impact</div>
                    </div>
                  </div>

                  {/* Recent Inquiries Table Preview */}
                  <div className="p-6 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white">Recent Discovery Inquiries</h3>
                      <button
                        onClick={() => setActiveNav('inquiries')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        View all inquiries ({allData.inquiries.length}) →
                      </button>
                    </div>

                    {allData.inquiries.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500 font-mono">
                        No inquiries submitted yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-700 text-slate-400">
                              <th className="pb-3 font-semibold">Creator</th>
                              <th className="pb-3 font-semibold">Channel</th>
                              <th className="pb-3 font-semibold">Project Type</th>
                              <th className="pb-3 font-semibold">Status</th>
                              <th className="pb-3 font-semibold">Date</th>
                              <th className="pb-3 text-right font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {allData.inquiries.slice(0, 5).map((inq) => (
                              <tr key={inq.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="py-3 font-medium text-white">{inq.name}</td>
                                <td className="py-3 text-slate-400">{inq.channel_url}</td>
                                <td className="py-3 text-slate-300">{inq.project_type}</td>
                                <td className="py-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                                      inq.status === 'new'
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : inq.status === 'reviewed'
                                        ? 'bg-amber-500/20 text-amber-300'
                                        : inq.status === 'contacted'
                                        ? 'bg-indigo-500/20 text-indigo-300'
                                        : 'bg-slate-700 text-slate-400'
                                    }`}
                                  >
                                    {inq.status}
                                  </span>
                                </td>
                                <td className="py-3 text-slate-400 font-mono text-[11px]">
                                  {new Date(inq.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 text-right">
                                  <button
                                    onClick={() => setViewingInquiry(inq)}
                                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
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

              {/* 2. FEATURED PROJECTS MANAGER */}
              {activeNav === 'projects' && allData && (
                <div className="space-y-6 max-w-6xl">
                  {/* Actions Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search projects..."
                          className="pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setEditingProject({
                          title: '',
                          slug: '',
                          category: 'Growth & Strategy',
                          cover_image: '',
                          video_duration: '12:00',
                          views_count: '1.5M views',
                          ctr_before: '4.5%',
                          ctr_after: '14.8%',
                          ctr_gain: '+19.2% CTR',
                          channel: 'Channel Name',
                          niche: 'Education',
                          hook: 'Contrarian psychological angle attracting high-intent mobile clicks.',
                          strategy_breakdown: [
                            'Focused visual hierarchy with clear contrast',
                            'Optimized for mobile YouTube feed dark mode',
                          ],
                          graphic_type: 'custom',
                          featured: true,
                          published: true,
                          sort_order: allData.projects.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Case Study</span>
                    </button>
                  </div>

                  {/* Projects Table */}
                  <div className="rounded-2xl bg-[#1e293b] border border-slate-700/60 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400">
                            <th className="p-4 font-semibold">Order</th>
                            <th className="p-4 font-semibold">Thumbnail</th>
                            <th className="p-4 font-semibold">Title & Channel</th>
                            <th className="p-4 font-semibold">CTR Gain</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {allData.projects
                            .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((proj, idx) => (
                              <tr key={proj.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="p-4 font-mono text-slate-500">
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleReorder('projects', allData.projects, idx, 'up')}
                                      disabled={idx === 0}
                                      className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleReorder('projects', allData.projects, idx, 'down')}
                                      disabled={idx === allData.projects.length - 1}
                                      className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="ml-1">{idx + 1}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="w-20 aspect-video rounded-lg bg-black border border-slate-700 overflow-hidden flex items-center justify-center">
                                    {proj.cover_image ? (
                                      <img src={proj.cover_image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[9px] font-mono text-slate-500">Custom</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="font-semibold text-white truncate max-w-xs">{proj.title}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    {proj.channel} • {proj.views_count}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                    {proj.ctr_gain}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                                      proj.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                                    }`}
                                  >
                                    {proj.published ? 'Published' : 'Draft'}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setEditingProject(proj)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirm({ type: 'projects', id: proj.id, name: proj.title })
                                      }
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
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

              {/* 3. PROOF BRANDS & CLIENTS MANAGER */}
              {activeNav === 'clients' && allData && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Manage the proof ticker items and brand partners displayed across the header marquee.
                    </p>
                    <button
                      onClick={() =>
                        setEditingClient({
                          name: 'NEW CLIENT',
                          slug: `client-${Date.now()}`,
                          subtext: 'MEDIA',
                          badge: '1M+',
                          published: true,
                          featured: true,
                          sort_order: allData.clients.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Brand Partner</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allData.clients.map((client, idx) => (
                      <div
                        key={client.id}
                        className="p-4 rounded-2xl bg-[#1e293b] border border-slate-700/60 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleReorder('clients', allData.clients, idx, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-white disabled:opacity-20"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleReorder('clients', allData.clients, idx, 'down')}
                              disabled={idx === allData.clients.length - 1}
                              className="text-slate-500 hover:text-white disabled:opacity-20"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">{client.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {client.subtext} • Badge: <span className="text-rose-400">{client.badge}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingClient(client)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ type: 'clients', id: client.id, name: client.name })
                            }
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. TESTIMONIALS MANAGER */}
              {activeNav === 'testimonials' && allData && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Manage the 3D flip card reviews and verified creator dossiers.
                    </p>
                    <button
                      onClick={() =>
                        setEditingTestimonial({
                          name: 'CREATOR PARTNER',
                          role: 'Lead Creator & Founder',
                          company: 'Media Network (1M Subs)',
                          quote: 'VishuMax took our YouTube packaging to the next level with consistent CTR growth!',
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                          rating: 5,
                          channel: '@CreatorOfficial',
                          subscribers: '1M Subscribers',
                          detailed_bio: 'High volume creator running weekly episodic entertainment and education series.',
                          impact_metrics: [
                            '180% average CTR increase on launch day',
                            'Over 14M organic views generated in 6 months',
                          ],
                          stats: [
                            { label: 'CTR Growth', value: '+180%' },
                            { label: 'Views Added', value: '14M+' },
                            { label: 'Drop Count', value: '38+' },
                          ],
                          published: true,
                          sort_order: allData.testimonials.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {allData.testimonials.map((test) => (
                      <div
                        key={test.id}
                        className="p-5 rounded-2xl bg-[#1e293b] border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={test.avatar}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover border border-slate-600"
                          />
                          <div>
                            <div className="font-bold text-sm text-white">{test.name}</div>
                            <div className="text-xs text-slate-400">
                              {test.role} • {test.company}
                            </div>
                            <p className="text-xs text-slate-300 mt-1 line-clamp-1 italic font-sans">
                              "{test.quote}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingTestimonial(test)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ type: 'testimonials', id: test.id, name: test.name })
                            }
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. INDUSTRY LEADERS MANAGER */}
              {activeNav === 'leaders' && allData && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Manage the 4 vertical portrait cards in the Industry Leaders section.
                    </p>
                    <button
                      onClick={() =>
                        setEditingLeader({
                          name: 'Industry Leader',
                          role: 'Founder & Venture Investor',
                          channel: 'Leadership Protocol (1M)',
                          ctr_gain: '+24.5% CTR',
                          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
                          quote: 'VishuMax delivers exceptional creative direction.',
                          featured_topic: 'Executive Strategy',
                          published: true,
                          sort_order: allData.leaders.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Industry Leader</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allData.leaders.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 rounded-2xl bg-[#1e293b] border border-slate-700/60 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={lead.image}
                            alt=""
                            className="w-12 h-16 rounded-xl object-cover border border-slate-600 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-sm text-white">{lead.name}</div>
                            <div className="text-xs text-slate-400">{lead.role}</div>
                            <div className="text-[11px] font-mono text-emerald-400 font-bold">{lead.ctr_gain}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingLeader(lead)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ type: 'leaders', id: lead.id, name: lead.name })
                            }
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. SERVICES MANAGER */}
              {activeNav === 'services' && allData && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Manage packaging retainers and service packages.
                    </p>
                    <button
                      onClick={() =>
                        setEditingService({
                          title: 'Custom Packaging Retainer',
                          description: 'Dedicated thumbnail design and A/B split-testing variations.',
                          icon: 'Sparkles',
                          deliverables: ['8 Drops per month', '3 variations per drop', '< 24h turnaround'],
                          published: true,
                          sort_order: allData.services.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {allData.services.map((serv) => (
                      <div
                        key={serv.id}
                        className="p-5 rounded-2xl bg-[#1e293b] border border-slate-700/60 flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-white">{serv.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{serv.description}</p>
                          <ul className="mt-3 space-y-1 text-xs text-slate-300">
                            {serv.deliverables.map((del, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                <span>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/40">
                          <button
                            onClick={() => setEditingService(serv)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ type: 'services', id: serv.id, name: serv.title })
                            }
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. INQUIRIES INBOX */}
              {activeNav === 'inquiries' && allData && (
                <div className="space-y-6 max-w-6xl">
                  {/* Status Filters */}
                  <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                    {(['all', 'new', 'reviewed', 'contacted', 'archived'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setInquiryStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                          inquiryStatusFilter === st
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {st} (
                        {st === 'all'
                          ? allData.inquiries.length
                          : allData.inquiries.filter((i) => i.status === st).length}
                        )
                      </button>
                    ))}
                  </div>

                  {/* Table */}
                  <div className="rounded-2xl bg-[#1e293b] border border-slate-700/60 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400">
                            <th className="p-4 font-semibold">Name & Email</th>
                            <th className="p-4 font-semibold">Channel Handle</th>
                            <th className="p-4 font-semibold">Project & CTR</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 text-right font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {allData.inquiries
                            .filter((i) => inquiryStatusFilter === 'all' || i.status === inquiryStatusFilter)
                            .map((inq) => (
                              <tr key={inq.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="p-4">
                                  <div className="font-bold text-white">{inq.name}</div>
                                  <div className="text-slate-400 font-mono text-[11px]">{inq.email}</div>
                                </td>
                                <td className="p-4 font-mono text-slate-300">{inq.channel_url}</td>
                                <td className="p-4">
                                  <div className="text-slate-200">{inq.project_type}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    Current CTR: {inq.current_ctr}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <select
                                    value={inq.status}
                                    onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                                    className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] font-mono text-white focus:outline-none"
                                  >
                                    <option value="new">NEW</option>
                                    <option value="reviewed">REVIEWED</option>
                                    <option value="contacted">CONTACTED</option>
                                    <option value="archived">ARCHIVED</option>
                                  </select>
                                </td>
                                <td className="p-4 font-mono text-slate-400 text-[11px]">
                                  {new Date(inq.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => setViewingInquiry(inq)}
                                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                                  >
                                    View Message
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

              {/* 8. SITE SETTINGS & SEO */}
              {activeNav === 'settings' && allData && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-5xl">
                  {/* Visual Theme & Brand Color Palette */}
                  <div className="p-6 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">Visual Theme & Brand Color Palette</h3>
                          <p className="text-xs text-slate-400">Choose the active website color scheme, glowing hero aura, and gradient accents.</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-mono text-emerald-400 font-semibold">
                        {(allData.settings.theme || DEFAULT_THEME_ID).toUpperCase()} ACTIVE
                      </span>
                    </div>

                    {/* Theme Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                      {Object.values(THEMES).map((themeItem) => {
                        const isSelected = (allData.settings.theme || DEFAULT_THEME_ID) === themeItem.id;
                        return (
                          <div
                            key={themeItem.id}
                            onClick={() =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, theme: themeItem.id },
                              })
                            }
                            className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between select-none ${
                              isSelected
                                ? 'bg-slate-900/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl'
                                : 'bg-slate-900/50 border-slate-700/70 hover:border-slate-500 hover:bg-slate-900/80'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                {/* Live Gradient Swatch */}
                                <div
                                  className="w-14 h-6 rounded-lg shadow-md border border-white/20"
                                  style={{ background: themeItem.previewGradient }}
                                />
                                {isSelected ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                                    <Check className="w-3 h-3" /> Selected
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-500 font-medium">Click to select</span>
                                )}
                              </div>

                              <h4 className="font-bold text-xs text-white flex items-center gap-2">
                                <span>{themeItem.name}</span>
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                                {themeItem.tagline}
                              </p>
                            </div>

                            {/* Color Chips Preview */}
                            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-300">
                                <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ background: themeItem.primary }} />
                                <span>{themeItem.primary}</span>
                                <span className="text-slate-600">→</span>
                                <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ background: themeItem.secondary }} />
                                <span>{themeItem.secondary}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hero Settings */}
                  <div className="p-6 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-4">
                    <h3 className="font-bold text-sm text-white">Hero Statement & Quote Settings</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Navbar Line 1</label>
                        <input
                          type="text"
                          value={allData.settings.brandLine1}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, brandLine1: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Navbar Line 2</label>
                        <input
                          type="text"
                          value={allData.settings.brandLine2}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, brandLine2: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Navbar Brand Logo Image URL</label>
                        <div className="flex gap-3 items-center">
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/... or /logo.png"
                            value={allData.settings.brandLogoImage || ''}
                            onChange={(e) =>
                              setAllData({
                                ...allData,
                                settings: { ...allData.settings, brandLogoImage: e.target.value },
                              })
                            }
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                          {allData.settings.brandLogoImage && (
                            <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                              <img
                                src={allData.settings.brandLogoImage}
                                alt="Logo Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Appears in top navbar next to brand name and in the footer.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Headline Main Part</label>
                      <textarea
                        rows={2}
                        value={allData.settings.heroHeadlinePrefix}
                        onChange={(e) =>
                          setAllData({
                            ...allData,
                            settings: { ...allData.settings, heroHeadlinePrefix: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Headline Underlined Accent</label>
                      <input
                        type="text"
                        value={allData.settings.heroHeadlineAccent}
                        onChange={(e) =>
                          setAllData({
                            ...allData,
                            settings: { ...allData.settings, heroHeadlineAccent: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Attribution Tag</label>
                        <input
                          type="text"
                          value={allData.settings.heroAttributionAuthor}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, heroAttributionAuthor: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Views Milestone Subtitle</label>
                        <input
                          type="text"
                          value={allData.settings.heroViewsStat}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, heroViewsStat: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Profile Settings */}
                  <div className="p-6 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-4">
                    <h3 className="font-bold text-sm text-white">About Profile Section</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Section Heading (e.g. About Vishal Gupta)</label>
                        <input
                          type="text"
                          value={allData.settings.aboutHeading || ''}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutHeading: e.target.value },
                            })
                          }
                          placeholder={`About ${allData.settings.aboutName || 'Vishal Gupta'}`}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Status Badge Text</label>
                        <input
                          type="text"
                          value={allData.settings.aboutBadgeText || ''}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutBadgeText: e.target.value },
                            })
                          }
                          placeholder="Available for Select Channel Partnerships"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={allData.settings.aboutName}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutName: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Role / Title</label>
                        <input
                          type="text"
                          value={allData.settings.aboutRoleTitle}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutRoleTitle: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Portrait Image URL</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={allData.settings.aboutPortraitImage || ''}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutPortraitImage: e.target.value },
                            })
                          }
                          placeholder="https://images.unsplash.com/... or image URL"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                        {allData.settings.aboutPortraitImage && (
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                            <img
                              src={allData.settings.aboutPortraitImage}
                              alt="Portrait Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Bio Paragraph 1</label>
                      <textarea
                        rows={2}
                        value={allData.settings.aboutBioParagraph1}
                        onChange={(e) =>
                          setAllData({
                            ...allData,
                            settings: { ...allData.settings, aboutBioParagraph1: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Bio Paragraph 2</label>
                      <textarea
                        rows={2}
                        value={allData.settings.aboutBioParagraph2}
                        onChange={(e) =>
                          setAllData({
                            ...allData,
                            settings: { ...allData.settings, aboutBioParagraph2: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Views Driven Stat</label>
                        <input
                          type="text"
                          value={allData.settings.aboutViewsDriven}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutViewsDriven: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Turnaround Stat</label>
                        <input
                          type="text"
                          value={allData.settings.aboutTurnaroundTime}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutTurnaroundTime: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Button Label</label>
                        <input
                          type="text"
                          value={allData.settings.aboutCtaText || ''}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              settings: { ...allData.settings, aboutCtaText: e.target.value },
                            })
                          }
                          placeholder="Let's talk"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEO Metadata */}
                  <div className="p-6 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-4">
                    <h3 className="font-bold text-sm text-white">SEO & Social Meta Tags</h3>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={allData.settings.seoTitle}
                        onChange={(e) =>
                          setAllData({
                            ...allData,
                            settings: { ...allData.settings, seoTitle: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Meta Description</label>
                      <textarea
                        rows={2}
                        value={allData.settings.seoDescription}
                        onChange={(e) =>
                          setAllData({
                            ...allData,
                            settings: { ...allData.settings, seoDescription: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Meta Keywords</label>
                      <input
                        type="text"
                        value={allData.settings.seoKeywords}
                        onChange={(e) =>
                          setAllData({
                            ...allData,
                            settings: { ...allData.settings, seoKeywords: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                  >
                    Save All Site & SEO Settings to SQLite
                  </button>
                </form>
              )}

              {/* 9. ADMIN SECURITY */}
              {activeNav === 'security' && (
                <div className="space-y-6 max-w-3xl">
                  {/* Profile Edit */}
                  <div className="p-6 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-4">
                    <h3 className="font-bold text-sm text-white">Administrator Profile</h3>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await updateAdminProfile(adminEmail, adminName);
                        if (res.success) {
                          notify('Profile updated in SQLite database');
                        } else {
                          notify(res.error || 'Failed to update profile', 'error');
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Admin Name</label>
                          <input
                            type="text"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Login Email</label>
                          <input
                            type="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                      >
                        Save Profile
                      </button>
                    </form>
                  </div>

                  {/* Password Change */}
                  <div className="p-6 rounded-2xl bg-[#1e293b] border border-slate-700/60 space-y-4">
                    <h3 className="font-bold text-sm text-white">Change Admin Password (Bcrypt Hash)</h3>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const res = await changePassword(oldPassword, newPassword);
                        if (res.success) {
                          notify('Password updated in database!');
                          setOldPassword('');
                          setNewPassword('');
                        } else {
                          notify(res.error || 'Failed to update password', 'error');
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Current Password</label>
                        <input
                          type="password"
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">New Password (Min 6 chars)</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
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
      {/* MODAL: EDIT/ADD PROJECT */}
      {/* ------------------------------------------------------------- */}
      {editingProject && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#1e293b] border border-slate-700 rounded-3xl p-6 shadow-2xl my-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-sm text-white">
                {editingProject.id ? 'Edit Case Study Project' : 'New Case Study Project'}
              </h3>
              <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Project / Video Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Channel Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.channel || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, channel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Views Count</label>
                  <input
                    type="text"
                    value={editingProject.views_count || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, views_count: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">CTR Before</label>
                  <input
                    type="text"
                    value={editingProject.ctr_before || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, ctr_before: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">CTR After</label>
                  <input
                    type="text"
                    value={editingProject.ctr_after || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, ctr_after: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">CTR Uplift Badge</label>
                  <input
                    type="text"
                    value={editingProject.ctr_gain || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, ctr_gain: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Thumbnail Cover Image URL</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 aspect-video rounded-lg bg-black border border-slate-700 overflow-hidden shrink-0">
                    {editingProject.cover_image && (
                      <img src={editingProject.cover_image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={editingProject.cover_image || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, cover_image: e.target.value })}
                    placeholder="/assets/images/... or https://..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Packaging Psychology Hook</label>
                <textarea
                  rows={2}
                  value={editingProject.hook || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, hook: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT/ADD CLIENT */}
      {/* ------------------------------------------------------------- */}
      {editingClient && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1e293b] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-sm text-white">
                {editingClient.id ? 'Edit Brand Partner' : 'Add Brand Partner'}
              </h3>
              <button onClick={() => setEditingClient(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Channel Icon / Logo URL</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                    {editingClient.logo ? (
                      <img src={editingClient.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-500 font-bold">Logo</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={editingClient.logo || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, logo: e.target.value })}
                    placeholder="https://... or /assets/images/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Subtext (e.g. MEDIA)</label>
                  <input
                    type="text"
                    value={editingClient.subtext || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, subtext: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Badge (e.g. 1.2M)</label>
                  <input
                    type="text"
                    value={editingClient.badge || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-rose-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
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
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-[#1e293b] border border-slate-700 rounded-3xl p-6 shadow-2xl my-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-sm text-white">
                {editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setEditingTestimonial(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Creator Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Company / Channel Title</label>
                <input
                  type="text"
                  value={editingTestimonial.company || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Front Face Quote *</label>
                <textarea
                  rows={2}
                  required
                  value={editingTestimonial.quote || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={editingTestimonial.avatar || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Back Dossier Biography</label>
                <textarea
                  rows={2}
                  value={editingTestimonial.detailed_bio || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, detailed_bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT/ADD LEADER */}
      {/* ------------------------------------------------------------- */}
      {editingLeader && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1e293b] border border-slate-700 rounded-3xl p-6 shadow-2xl my-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-sm text-white">
                {editingLeader.id ? 'Edit Industry Leader' : 'Add Industry Leader'}
              </h3>
              <button onClick={() => setEditingLeader(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Leader Name *</label>
                  <input
                    type="text"
                    required
                    value={editingLeader.name || ''}
                    onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Role / Company *</label>
                  <input
                    type="text"
                    required
                    value={editingLeader.role || ''}
                    onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">CTR Gain Badge</label>
                  <input
                    type="text"
                    value={editingLeader.ctr_gain || ''}
                    onChange={(e) => setEditingLeader({ ...editingLeader, ctr_gain: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Topic Tag</label>
                  <input
                    type="text"
                    value={editingLeader.featured_topic || ''}
                    onChange={(e) => setEditingLeader({ ...editingLeader, featured_topic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Portrait Image URL</label>
                <input
                  type="text"
                  value={editingLeader.image || ''}
                  onChange={(e) => setEditingLeader({ ...editingLeader, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Quote</label>
                <textarea
                  rows={2}
                  value={editingLeader.quote || ''}
                  onChange={(e) => setEditingLeader({ ...editingLeader, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingLeader(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT/ADD SERVICE */}
      {/* ------------------------------------------------------------- */}
      {editingService && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1e293b] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-sm text-white">
                {editingService.id ? 'Edit Service Package' : 'Add Service Package'}
              </h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Save Service
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
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#1e293b] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <h3 className="font-bold text-sm text-white">{viewingInquiry.name}</h3>
                <span className="text-xs text-slate-400 font-mono">{viewingInquiry.email}</span>
              </div>
              <button onClick={() => setViewingInquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900">
                <div>
                  <span className="text-slate-400 block text-[10px]">Channel URL:</span>
                  <span className="text-white font-mono">{viewingInquiry.channel_url}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Baseline CTR:</span>
                  <span className="text-emerald-400 font-mono font-bold">{viewingInquiry.current_ctr}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase mb-1">Message / Channel Goal:</span>
                <p className="p-3 rounded-xl bg-slate-900 text-slate-200 leading-relaxed">
                  {viewingInquiry.message || 'No additional notes provided.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={viewingInquiry.status}
                  onChange={(e) => {
                    handleUpdateInquiryStatus(viewingInquiry.id, e.target.value as any);
                    setViewingInquiry({ ...viewingInquiry, status: e.target.value as any });
                  }}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="new">NEW</option>
                  <option value="reviewed">REVIEWED</option>
                  <option value="contacted">CONTACTED</option>
                  <option value="archived">ARCHIVED</option>
                </select>
              </div>

              <a
                href={`mailto:${viewingInquiry.email}?subject=Discovery Strategy Session with VishuMax`}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
              >
                <span>Reply via Email</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#1e293b] border border-slate-700 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Confirm Deletion</h4>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to permanently delete <strong className="text-white">"{deleteConfirm.name}"</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Delete from DB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
