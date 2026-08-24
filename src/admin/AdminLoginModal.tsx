import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Key, X, ArrowRight, ShieldCheck, AlertCircle, Database } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, isAuthLoading } = useSiteData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const success = await login(email, password);
    if (!success) {
      setErrorMessage('Invalid administrator credentials. Please check your email and password.');
    }
  };

  const handleClose = React.useCallback(() => {
    setIsLoginModalOpen(false);
    setErrorMessage(null);
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', ' ');
    }
  }, [setIsLoginModalOpen]);

  React.useEffect(() => {
    if (!isLoginModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoginModalOpen, handleClose]);

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-md bg-[#0a0a0e]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-10 my-auto overflow-hidden text-zinc-100"
        >
          {/* Top ambient glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/15 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close admin login"
            className="absolute top-5 right-5 z-30 p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-md"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/15 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-3 relative group">
              <span className="absolute inset-0 rounded-2xl bg-emerald-500/10 blur-sm pointer-events-none" />
              <Lock className="w-6 h-6 relative z-10" />
            </div>
            <h3 className="font-sans font-bold text-xl text-white tracking-tight">Admin Authentication</h3>
            <p className="text-xs text-zinc-400 mt-1">Access the VishuMax Management Studio</p>

            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-3 py-0.5 rounded-full border border-emerald-800/40 shadow-xs">
              <Database className="w-3 h-3" />
              <span>SQLite Database Auth</span>
            </div>
          </div>

          {/* Error alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vishumax.in"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 text-white text-xs font-sans placeholder:text-zinc-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 text-white text-xs font-sans placeholder:text-zinc-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-sans font-bold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-95 mt-2"
            >
              {isAuthLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Admin Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
