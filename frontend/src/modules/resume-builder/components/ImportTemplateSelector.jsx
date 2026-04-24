import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setImportTemplate } from '@/modules/resume-builder/state/uiSlice';
import { templates } from '@/modules/resume-builder/constants/templates';
import { X, Check, ArrowRight, UploadCloud, FileText, ArrowLeft } from 'lucide-react';

const ImportTemplateSelector = ({ onClose, onNext }) => {
    const dispatch = useDispatch();
    const { importFlow } = useSelector((state) => state.ui || { importFlow: { step: null, selectedTemplateId: null } });

    // Local state for the two-step flow inside the modal
    const [internalStep, setInternalStep] = useState('select'); // 'select' | 'upload'
    const [selectedId, setSelectedId] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleSelect = (templateId) => {
        setSelectedId(templateId);
        dispatch(setImportTemplate(templateId));
    };

    const handleContinueToUpload = () => {
        if (!selectedId) return;
        setInternalStep('upload');
    };

    const handleFileSelected = useCallback(() => {
        // Trigger the parent's onNext which sets step to file_upload and triggers the hidden file input
        onNext();
    }, [onNext]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            // We need to trigger the parent's file input with this file
            // The cleanest way: trigger onNext which opens the native picker
            // But since we have drag-drop, we need a different approach
            handleFileSelected();
        }
    }, [handleFileSelected]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOver(false);
    }, []);

    // Reset internal state when modal closes
    const handleClose = () => {
        setInternalStep('select');
        setSelectedId(null);
        onClose();
    };

    const handleBack = () => {
        setInternalStep('select');
    };

    if (importFlow?.step !== 'template_selection') return null;

    const visibleTemplates = templates.filter(t => !t.hiddenFromGallery);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
                style={{ animation: 'fadeInScale 0.2s ease-out' }}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        {internalStep === 'upload' && (
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                title="Back to template selection"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-500" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                {internalStep === 'select' ? 'Step 1: Choose a Template' : 'Step 2: Upload Your Resume'}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                {internalStep === 'select'
                                    ? 'Select the template you want your imported resume to use.'
                                    : 'Upload your existing resume file to import and style it.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Step indicators */}
                        <div className="hidden sm:flex items-center gap-2 mr-4">
                            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                                internalStep === 'select'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-emerald-100 text-emerald-700'
                            }`}>
                                {internalStep === 'upload' ? <Check size={12} /> : <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>}
                                Template
                            </div>
                            <div className="w-6 h-px bg-slate-300" />
                            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                                internalStep === 'upload'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-slate-100 text-slate-400'
                            }`}>
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                                    internalStep === 'upload' ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-white'
                                }`}>2</span>
                                Upload
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {internalStep === 'select' ? (
                    <>
                        {/* Template Grid */}
                        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                                {visibleTemplates.map(template => {
                                    const isSelected = selectedId === template.id;
                                    return (
                                        <div
                                            key={template.id}
                                            onClick={() => handleSelect(template.id)}
                                            className={`
                                                relative bg-white rounded-xl overflow-hidden cursor-pointer
                                                transition-all duration-200 flex flex-col
                                                border-2 group
                                                ${isSelected
                                                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-200 scale-[1.02]'
                                                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1'
                                                }
                                            `}
                                        >
                                            {/* Selected checkmark */}
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 z-10 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                                                    style={{ animation: 'fadeInScale 0.2s ease-out' }}
                                                >
                                                    <Check size={16} className="text-white" strokeWidth={3} />
                                                </div>
                                            )}

                                            {/* Template Image */}
                                            <div className="aspect-[210/297] bg-slate-100 overflow-hidden relative">
                                                {template.image ? (
                                                    <img
                                                        src={template.image}
                                                        alt={template.name}
                                                        className={`w-full h-full object-cover object-top transition-all duration-300 ${
                                                            isSelected ? 'scale-105' : 'group-hover:scale-105'
                                                        }`}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                        <FileText size={40} />
                                                        <span className="text-xs mt-2 font-medium">No Preview</span>
                                                    </div>
                                                )}

                                                {/* Hover overlay with Select prompt */}
                                                {!isSelected && (
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                        <div className="bg-white text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 flex items-center gap-2">
                                                            <Check size={16} /> Select
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className={`p-3 text-center border-t transition-colors ${
                                                isSelected ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-50'
                                            }`}>
                                                <h3 className={`font-bold text-sm truncate transition-colors ${
                                                    isSelected ? 'text-indigo-700' : 'text-slate-800'
                                                }`}>
                                                    {template.name}
                                                </h3>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="p-5 border-t border-slate-200 bg-white flex items-center justify-between sticky bottom-0">
                            <p className="text-sm text-slate-500">
                                {selectedId
                                    ? <span className="flex items-center gap-2">
                                        <Check size={16} className="text-emerald-500" />
                                        <span><strong className="text-slate-900">{visibleTemplates.find(t => t.id === selectedId)?.name}</strong> selected</span>
                                      </span>
                                    : 'Select a template to continue'
                                }
                            </p>
                            <button
                                onClick={handleContinueToUpload}
                                disabled={!selectedId}
                                className={`
                                    px-8 py-3 rounded-full font-bold text-base shadow-lg transition-all duration-200 flex items-center gap-2
                                    ${selectedId
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:-translate-y-0.5'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    }
                                `}
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    /* Step 2: File Upload */
                    <div className="p-8 flex-1 flex flex-col items-center justify-center bg-slate-50">
                        <div className="w-full max-w-lg">
                            {/* Selected template reminder */}
                            <div className="bg-white rounded-xl p-4 mb-6 flex items-center gap-4 border border-slate-200 shadow-sm">
                                {(() => {
                                    const t = visibleTemplates.find(t => t.id === selectedId);
                                    return t ? (
                                        <>
                                            <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                                                {t.image && (
                                                    <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Selected Template</p>
                                                <p className="text-lg font-bold text-slate-900">{t.name}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <Check size={18} className="text-emerald-600" />
                                                </div>
                                            </div>
                                        </>
                                    ) : null;
                                })()}
                            </div>

                            {/* Upload Area */}
                            <div
                                onClick={handleFileSelected}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`
                                    relative cursor-pointer rounded-2xl border-2 border-dashed p-12
                                    flex flex-col items-center justify-center text-center
                                    transition-all duration-200
                                    ${dragOver
                                        ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                                        : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'
                                    }
                                `}
                            >
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-colors ${
                                    dragOver ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <UploadCloud size={40} />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {dragOver ? 'Drop your file here' : 'Upload Your Resume'}
                                </h3>
                                <p className="text-slate-500 text-sm mb-5 max-w-sm">
                                    Drag and drop your resume file here, or click to browse from your computer.
                                </p>

                                <div className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold text-base shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                                    <UploadCloud size={18} />
                                    Choose File
                                </div>

                                <p className="text-xs text-slate-400 mt-4">
                                    Supported formats: PDF, DOCX, DOC, TXT
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Keyframe animation */}
            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ImportTemplateSelector;
