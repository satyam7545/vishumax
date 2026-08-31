import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Loader2,
  Crop as CropIcon,
  Sliders,
} from 'lucide-react';

export type AspectRatioOption = '16:9' | '1:1' | '4:5' | 'free';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  fileName?: string;
  defaultAspect?: AspectRatioOption;
  onSave: (croppedDataUrl: string, fileName: string) => Promise<void> | void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  fileName = 'cropped-image.png',
  defaultAspect = '16:9',
  onSave,
}) => {
  const [aspect, setAspect] = useState<AspectRatioOption>(defaultAspect);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [isProcessing, setIsProcessing] = useState(false);

  // Position offsets for dragging image within crop frame (in image display percentage)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({
    x: 0,
    y: 0,
    startPanX: 0,
    startPanY: 0,
  });

  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Target output dimensions
  const [outputWidth, setOutputWidth] = useState(1920);
  const [outputHeight, setOutputHeight] = useState(1080);

  // Reset state when modal opens or image changes
  useEffect(() => {
    if (isOpen && imageSrc) {
      setAspect(defaultAspect);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });

      if (defaultAspect === '16:9') {
        setOutputWidth(1920);
        setOutputHeight(1080);
      } else if (defaultAspect === '1:1') {
        setOutputWidth(800);
        setOutputHeight(800);
      } else if (defaultAspect === '4:5') {
        setOutputWidth(800);
        setOutputHeight(1000);
      } else {
        setOutputWidth(1280);
        setOutputHeight(720);
      }
    }
  }, [isOpen, imageSrc, defaultAspect]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleAspectChange = (newAspect: AspectRatioOption) => {
    setAspect(newAspect);
    setPan({ x: 0, y: 0 });
    setZoom(1);

    if (newAspect === '16:9') {
      setOutputWidth(1920);
      setOutputHeight(1080);
    } else if (newAspect === '1:1') {
      setOutputWidth(800);
      setOutputHeight(800);
    } else if (newAspect === '4:5') {
      setOutputWidth(800);
      setOutputHeight(1000);
    }
  };

  // Drag to pan image
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: dragStartRef.current.startPanX + dx,
        y: dragStartRef.current.startPanY + dy,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Mouse wheel to zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(0.6, prev + delta), 4));
  };

  // Calculate crop aspect ratio styling
  const getCropBoxAspectStyle = () => {
    if (aspect === '16:9') return 'aspect-[16/9] max-w-[620px] max-h-[350px]';
    if (aspect === '1:1') return 'aspect-square max-w-[360px] max-h-[360px]';
    if (aspect === '4:5') return 'aspect-[4/5] max-w-[320px] max-h-[400px]';
    return 'aspect-[16/9] max-w-[620px] max-h-[350px]';
  };

  // Render crop to high-resolution canvas and export
  const handleCropAndSave = async () => {
    const img = imageRef.current;
    const cropBox = containerRef.current;
    if (!img || !cropBox) return;

    setIsProcessing(true);

    try {
      // Load source image
      const sourceImage = new Image();
      sourceImage.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        sourceImage.onload = () => resolve();
        sourceImage.onerror = reject;
        sourceImage.src = imageSrc;
      });

      const canvas = document.createElement('canvas');
      const targetW = Math.max(100, outputWidth);
      const targetH = Math.max(100, outputHeight);
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas 2D context');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Dimensions of crop box on screen
      const cropRect = cropBox.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      // Transform logic
      ctx.save();
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, targetW, targetH);

      // Scale factor between screen crop box and high-res output canvas
      const scaleX = targetW / cropRect.width;
      const scaleY = targetH / cropRect.height;

      // Position of image relative to crop box
      const relX = (imgRect.left - cropRect.left) * scaleX;
      const relY = (imgRect.top - cropRect.top) * scaleY;
      const drawW = imgRect.width * scaleX;
      const drawH = imgRect.height * scaleY;

      // Apply rotation if needed
      if (rotation !== 0) {
        ctx.translate(targetW / 2, targetH / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-targetW / 2, -targetH / 2);
      }

      ctx.drawImage(sourceImage, relX, relY, drawW, drawH);
      ctx.restore();

      const outputDataUrl = canvas.toDataURL('image/png', 0.95);
      const cleanBaseName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const croppedFileName = `${cleanBaseName}_cropped_${aspect.replace(':', 'x')}.png`;

      await onSave(outputDataUrl, croppedFileName);
      onClose();
    } catch (err) {
      console.error('Error generating cropped image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const modalNode = (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl select-none overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-3xl bg-[#0c0c12] border border-white/20 p-5 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col max-h-[92vh] my-auto overflow-hidden text-zinc-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                <CropIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-white truncate flex items-center gap-2">
                  <span>Crop & Resize Image</span>
                  {imageSize.width > 0 && (
                    <span className="text-[11px] font-mono text-zinc-400 font-normal px-2 py-0.5 rounded-full bg-white/5 border border-white/10 shrink-0">
                      Original: {imageSize.width}×{imageSize.height}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400 truncate">
                  Drag to reposition, use slider to zoom, or select card aspect ratio.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Aspect Ratio Selector Chips */}
          <div className="pt-3 pb-2 flex items-center justify-between gap-3 flex-wrap shrink-0 border-b border-white/5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-zinc-400 font-medium mr-1 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Card Preset:</span>
              </span>

              <button
                type="button"
                onClick={() => handleAspectChange('16:9')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  aspect === '16:9'
                    ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
              >
                16:9 Thumbnail
              </button>

              <button
                type="button"
                onClick={() => handleAspectChange('1:1')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  aspect === '1:1'
                    ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
              >
                1:1 Avatar / Logo
              </button>

              <button
                type="button"
                onClick={() => handleAspectChange('4:5')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  aspect === '4:5'
                    ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
              >
                4:5 Bio Portrait
              </button>

              <button
                type="button"
                onClick={() => handleAspectChange('free')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  aspect === 'free'
                    ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
              >
                Freeform
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition-all"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rotate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                  setRotation(0);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-xs cursor-pointer transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Interactive Crop Viewport Canvas Area */}
          <div
            className="flex-1 min-h-[300px] sm:min-h-[380px] bg-black/80 rounded-2xl border border-white/10 overflow-hidden relative flex items-center justify-center p-4 my-3 cursor-grab active:cursor-grabbing select-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
          >
            {/* The Active Crop Viewport Frame */}
            <div
              ref={containerRef}
              className={`relative w-full ${getCropBoxAspectStyle()} rounded-xl border-2 border-emerald-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.75),0_0_30px_rgba(16,185,129,0.35)] overflow-hidden flex items-center justify-center pointer-events-none transition-[aspect-ratio,max-width,max-height] duration-200`}
            >
              {/* Inner Crosshair / Grid Rule of Thirds Guides */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* The Transformed Source Image */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Source preview"
                onLoad={handleImageLoad}
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  maxWidth: 'none',
                }}
                className="pointer-events-none max-w-none max-h-none transition-transform duration-75 select-none"
              />
            </div>

            {/* Hint Overlay at bottom of viewport */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10.5px] text-zinc-400 pointer-events-none flex items-center gap-1.5">
              <span>Drag to Pan</span>
              <span>•</span>
              <span>Scroll to Zoom</span>
            </div>
          </div>

          {/* Controls Bar: Zoom & Resolution Customizer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 shrink-0">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min="0.6"
                max="3.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-28 sm:w-44 accent-emerald-400 cursor-pointer"
              />

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3.5, z + 0.1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-zinc-400 w-12">{Math.round(zoom * 100)}%</span>
            </div>

            {/* Target Export Dimensions */}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-medium hidden xs:inline">Output Size:</span>
              <div className="flex items-center gap-1 bg-zinc-950 border border-white/10 rounded-xl px-2 py-1">
                <input
                  type="number"
                  value={outputWidth}
                  onChange={(e) => setOutputWidth(parseInt(e.target.value, 10) || 100)}
                  className="w-14 bg-transparent text-white font-mono text-xs focus:outline-none text-right"
                />
                <span className="text-zinc-600">×</span>
                <input
                  type="number"
                  value={outputHeight}
                  onChange={(e) => setOutputHeight(parseInt(e.target.value, 10) || 100)}
                  className="w-14 bg-transparent text-white font-mono text-xs focus:outline-none text-left"
                />
                <span className="text-[10px] text-zinc-500 uppercase font-mono">px</span>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-3 shrink-0 flex-wrap">
            <div className="text-xs text-zinc-400 truncate">
              Preview matches site card framing exactly.
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCropAndSave}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Crop & Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};
