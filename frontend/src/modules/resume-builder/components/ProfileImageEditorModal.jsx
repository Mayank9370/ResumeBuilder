import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import getCroppedImg from '@/modules/resume-builder/utils/imageCropUtils';

const ProfileImageEditorModal = ({ isOpen, onClose, imageSrc, onConfirm }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(1); // Profile pictures are usually square
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onConfirm(croppedBlob);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[600px] relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <h3 className="text-lg font-bold text-slate-800">Edit Photo</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative flex-1 bg-slate-900 overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit="contain"
            // Ensure crop area is circular visually for profile, but square technically
            cropShape="round" 
            showGrid={false}
          />
        </div>

        {/* Controls Footer */}
        <div className="px-6 py-6 bg-white border-t border-slate-100 space-y-6">
          
          {/* Zoom Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
               <span>Zoom</span>
               <span>{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut size={16} className="text-slate-400" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <ZoomIn size={16} className="text-slate-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
               onClick={() => { setZoom(1); setRotation(0); setCrop({x:0, y:0}); }}
               className="mr-auto text-sm text-slate-500 font-medium hover:text-slate-700 flex items-center gap-1 px-2 py-2"
               title="Reset"
            >
              <RotateCcw size={14} /> Reset
            </button>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-70 flex items-center gap-2"
            >
              {isProcessing ? (
                 <>Saving...</>
              ) : (
                 <><Check size={16} /> Apply Photo</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageEditorModal;
