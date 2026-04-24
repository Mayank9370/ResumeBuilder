import React from 'react';
import { Star, Eye, Check } from 'lucide-react';

const TemplateCard = ({ template, isLocked, onUse, onPreview }) => {
    const [imgError, setImgError] = React.useState(false);

    return (
        <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col h-full transform hover:-translate-y-1">

            {/* Image Container */}
            <div
                className="relative aspect-[210/297] bg-slate-100 overflow-hidden cursor-pointer group-hover:bg-slate-50 transition-colors"
                onClick={() => onPreview(template)}
            >
                {(template.image && !imgError) ? (
                    <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    // Fallback UI
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
                        <div className="w-16 h-16 mb-2 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-300">
                            {template.name.charAt(0)}
                        </div>
                        <span className="text-xs font-medium">No Preview</span>
                    </div>
                )}

                {/* Hover Overlay with Buttons */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center gap-4 pb-6">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview(template);
                        }}
                        className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm shadow-xl hover:bg-slate-800 transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        <Eye size={16} /> Preview
                    </button>
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {isLocked && (
                        <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> PREMIUM
                        </div>
                    )}
                </div>
            </div>

            {/* Simple Footer: Just Title */}
            <div className="p-4 bg-white text-center border-t border-slate-50">
                <h3 className="font-bold text-slate-800 text-base truncate group-hover:text-blue-600 transition-colors" title={template.name}>
                    {template.name}
                </h3>
            </div>
        </div >
    );
};

export default TemplateCard;
