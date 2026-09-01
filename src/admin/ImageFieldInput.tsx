import React, { useState, useRef } from 'react';
import { Images, Image as ImageIcon, Crop, Upload, Loader2 } from 'lucide-react';
import { MediaPickerModal } from './MediaPickerModal';
import { ImageCropperModal, type AspectRatioOption } from './ImageCropperModal';
import { type MediaFile } from './AdminDashboard';

interface ImageFieldInputProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  aspect?: 'video' | 'square' | 'portrait';
  mediaFiles: MediaFile[];
  fetchMediaFiles: () => Promise<void>;
  notify: (msg: string, type?: 'success' | 'error') => void;
  handleSaveCroppedMedia: (base64Data: string, fileName: string) => Promise<string | null>;
}

export const ImageFieldInput: React.FC<ImageFieldInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  aspect = 'video',
  mediaFiles,
  fetchMediaFiles,
  notify,
  handleSaveCroppedMedia,
}) => {
  const [uploading, setUploading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>('');
  const [cropFileName, setCropFileName] = useState<string>('image.png');
  const fileRef = useRef<HTMLInputElement>(null);

  const aspectPreset: AspectRatioOption =
    aspect === 'portrait' ? '4:5' : aspect === 'square' ? '1:1' : '16:9';

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      notify(`"${file.name}" exceeds 50MB size limit`, 'error');
      return;
    }
    // Read file and open directly in cropper modal for perfect card fit
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropFileName(file.name);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleOpenCropperForExisting = () => {
    if (!value) return;
    setCropImageSrc(value);
    setCropFileName(value.split('/').pop() || 'image.png');
    setIsCropperOpen(true);
  };

  const handleCroppedSave = async (croppedDataUrl: string, croppedName: string) => {
    setUploading(true);
    const url = await handleSaveCroppedMedia(croppedDataUrl, croppedName);
    if (url) {
      onChange(url);
    }
    setUploading(false);
  };

  const aspectClass =
    aspect === 'portrait'
      ? 'w-10 aspect-[3/4] rounded-lg'
      : aspect === 'square'
      ? 'w-10 h-10 rounded-full'
      : 'w-14 aspect-video rounded-lg';

  return (
    <div className="space-y-1.5 w-full">
      {/* Label & Optional Clear Action (Wraps cleanly without overlapping) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="block text-xs text-zinc-300 font-medium truncate max-w-[70%]">
          {label}
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-zinc-500 hover:text-rose-400 cursor-pointer transition-colors shrink-0"
          >
            Clear
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer transition-colors shrink-0"
          >
            <Images className="w-3 h-3" />
            <span>Browse Library</span>
          </button>
        )}
      </div>

      {/* Input & Buttons Row */}
      <div className="flex items-center gap-2 w-full">
        {/* Visual Thumbnail */}
        <div
          onClick={() => setIsPickerOpen(true)}
          title="Click to change image"
          className={`${aspectClass} bg-zinc-950 border border-white/10 hover:border-emerald-500/50 overflow-hidden flex items-center justify-center shrink-0 shadow-inner cursor-pointer relative group/preview transition-colors`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                <Images className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </>
          ) : (
            <ImageIcon className="w-4 h-4 text-zinc-600 group-hover/preview:text-emerald-400 transition-colors" />
          )}
        </div>

        {/* Text Input with min-w-0 */}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Paste URL or select...'}
          className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-xs text-white font-mono placeholder:text-zinc-600 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none transition-all"
        />

        <input
          type="file"
          ref={fileRef}
          onChange={onFilePick}
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
          className="hidden"
        />

        {/* Action Buttons with shrink-0 and whitespace-nowrap */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Crop Button (active when an image is present) */}
          {value && (
            <button
              type="button"
              onClick={handleOpenCropperForExisting}
              title="Crop / Resize current image to fit card"
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer whitespace-nowrap"
            >
              <Crop className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Crop</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            title="Select from Media Library"
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border border-white/10 whitespace-nowrap"
          >
            <Images className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Library</span>
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            title="Upload & crop new image from device"
            className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-black text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span className="hidden sm:inline">Uploading</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Upload</span>
              </>
            )}
          </button>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => onChange(url)}
        currentUrl={value}
        title={`Select ${label}`}
        initialFiles={mediaFiles}
        onUploaded={fetchMediaFiles}
      />

      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropImageSrc}
        fileName={cropFileName}
        defaultAspect={aspectPreset}
        onSave={handleCroppedSave}
      />
    </div>
  );
};
