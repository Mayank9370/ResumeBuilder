import React from 'react';
import { X, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

const AIOptionsModal = ({ isOpen, onClose, originalText, options, onSelect }) => {
    // FIX 1: Use Index for selection to handle duplicate text values correctly
    const [selectedIndex, setSelectedIndex] = React.useState(null);

    // Reset selection when modal opens
    React.useEffect(() => {
        if (isOpen) setSelectedIndex(null);
    }, [isOpen]);

    if (!isOpen) return null;

    // Helper to strip HTML for clean display (Display Only)
    const stripHtml = (html) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const handleApply = () => {
        // FIX 2: Apply based on index
        if (selectedIndex !== null && options[selectedIndex]) {
            onSelect(options[selectedIndex]);
        }
    };

    return createPortal(
        // FIX 3: Massive Z-Index (9999) to overpower any header/sidebar stacking context
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] border border-slate-100">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-2xl">✨</span> AI Enhancements
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Select the best version for your resume</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - Original (Cleaned Display) */}
                    <div className="w-1/3 bg-slate-50/50 p-6 border-r border-slate-100 overflow-y-auto hidden md:block">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Original Text</h3>
                            <span className="text-xs text-slate-400 bg-slate-200/50 px-2 py-1 rounded">Read Only</span>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium break-words min-w-0">
                            {originalText ? stripHtml(originalText) : <span className="text-slate-400 italic">No original text provided.</span>}
                        </div>
                    </div>

                    {/* Main - Options (Selectable) */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 md:hidden">Select an Option</h3>

                        <div className="grid gap-4">
                            {options.map((option, index) => {
                                // FIX 1: Compare Index
                                const isSelected = selectedIndex === index;
                                return (
                                    <div
                                        key={index}
                                        tabIndex={0}
                                        role="button"
                                        aria-pressed={isSelected}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setSelectedIndex(index);
                                            }
                                        }}
                                        className={`group relative border-2 rounded-xl p-5 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-violet-200 ${isSelected
                                                ? 'border-violet-600 bg-violet-50/30 shadow-md ring-1 ring-violet-600'
                                                : 'border-slate-100 hover:border-violet-300 hover:shadow-sm bg-white'
                                            }`}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${isSelected
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-700'
                                                }`}>
                                                Option {index + 1}
                                            </span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? 'border-violet-600 bg-violet-600'
                                                    : 'border-slate-300 group-hover:border-violet-400'
                                                }`}>
                                                {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                                            </div>
                                        </div>
                                        {/* Strip HTML for clean comparison */}
                                        <p className={`text-sm leading-relaxed whitespace-pre-line ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                            {stripHtml(option)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer - Explicit Action */}
                <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center z-10">
                    <p className="text-xs text-slate-500 hidden sm:block">
                        This will replace your current summary content.
                    </p>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={selectedIndex === null}
                            className="flex-1 sm:flex-none px-8 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-violet-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm flex items-center justify-center gap-2"
                        >
                            <Check size={18} />
                            Apply Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AIOptionsModal;
