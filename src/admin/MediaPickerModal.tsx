import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { type MediaFile } from './AdminDashboard';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, file?: MediaFile) => void;
  title?: string;
  currentUrl?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media from Library',
  currentUrl = '',
}) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media files from server
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/media', {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMediaFiles(data.files || []);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedFile(null);
      setSearch('');
    }
  }, [isOpen, fetchMedia]);

  // Handle single file upload inside modal
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const token = localStorage.getItem('admin_token') || '';

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/cms/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (res.ok) {
          const json = await res.json();
          if (i === 0 && json.url) {
            // Auto select uploaded image
            onSelect(json.url);
            onClose();
            return;
          }
        }
      }
      await fetchMedia();
    } catch (err) {
      console.error('Error uploading media:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredFiles = mediaFiles.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-3xl bg-[#0e0e14] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
            <div>
              <h3 className="font-sans font-bold text-lg sm:text-xl text-white tracking-tight flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <span>{title}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Choose an image from your server media library or upload a new high-res graphic.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Actions Bar */}
          <div className="py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media by filename..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950/90 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            {/* Upload Button */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
                multiple
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Image</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Media Grid */}
          <div className="flex-1 overflow-y-auto min-h-[260px] pr-1 py-1">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <span className="text-xs font-mono">Loading media assets...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-500">
                <ImageIcon className="w-8 h-8 stroke-[1.5] text-zinc-600" />
                <span className="text-xs">No media files found. Upload images to get started.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFile?.id === file.id || (!selectedFile && currentUrl === file.url);

                  return (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      onDoubleClick={() => {
                        onSelect(file.url, file);
                        onClose();
                      }}
                      className={`group relative aspect-video rounded-2xl overflow-hidden bg-black border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={file.url}
                        alt={file.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Selected Check Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Bottom Info Bar */}
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                        <p className="text-[11px] font-sans font-medium text-white truncate drop-shadow-sm">
                          {file.name}
                        </p>
                        <p className="text-[9px] font-mono text-zinc-400">
                          {(file.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
            <div className="text-xs text-zinc-400 truncate">
              {selectedFile ? (
                <span className="text-emerald-400 font-medium font-mono">
                  Selected: {selectedFile.name}
                </span>
              ) : (
                <span>Click an image to select, or double-click to confirm</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedFile}
                onClick={() => {
                  if (selectedFile) {
                    onSelect(selectedFile.url, selectedFile);
                    onClose();
                  }
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Use Selected Image</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
