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
      setErrorMessage('Invalid administrator credentials. Please verify your email and password.');
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
          className="fixed inset-0 bg-black/85 backdrop-blur-lg"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#101014] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-auto overflow-hidden"
        >
          {/* Top ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ea3829]/15 blur-3xl pointer-events-none rounded-full" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close admin login"
            className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ea3829] to-[#ff503e] flex items-center justify-center text-white shadow-glow-red mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-white tracking-tight">Admin Authentication</h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/30">
              <Database className="w-3 h-3" />
              <span>SQLite Database Auth</span>
            </div>
          </div>

          {/* Error alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2"
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black border border-white/15 focus:border-[#ea3829] text-white text-xs font-sans placeholder:text-zinc-600 focus:outline-none transition-colors"
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black border border-white/15 focus:border-[#ea3829] text-white text-xs font-sans placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ea3829] to-[#ff503e] hover:from-[#ff4233] hover:to-[#ff614f] text-white font-bold text-xs tracking-wider uppercase shadow-glow-red flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
