import React from 'react';
import { Layout, Check } from 'lucide-react';

import { templates as sharedTemplates } from '@/modules/resume-builder/constants/templates';
import { mixTemplates } from '@/modules/resume-builder/utils/resumeTemplates';

const TemplateSidebar = ({ selectedTemplate, onChange, isOpen, onClose }) => {
    // V12 Fix: Use shared source of truth + Mixing Logic
    const templates = mixTemplates(sharedTemplates);

    return (
        <div className={`
            fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:relative lg:translate-x-0 lg:w-full lg:shadow-none lg:bg-transparent
        `}>
            <div className="h-full flex flex-col bg-white lg:rounded-xl lg:border lg:shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Layout size={18} /> Templates
                    </h3>
                    <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
                        Close
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {templates.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => { onChange(t.id); if (window.innerWidth < 1024) onClose(); }}
                            className={`
                                cursor-pointer group relative rounded-lg border-2 text-left transition-all p-3 hover:shadow-md
                                ${selectedTemplate === t.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : 'border-transparent hover:border-gray-200 bg-white shadow-sm'}
                            `}
                        >
                            <div className={`h-16 w-full rounded mb-3 overflow-hidden border border-slate-100 bg-slate-50 relative`}>
                                {t.image ? (
                                    <img 
                                        src={t.image} 
                                        alt={t.name} 
                                        className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity" 
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono ${t.color || 'bg-slate-50'}`}>
                                        Preview
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`font-bold text-sm ${selectedTemplate === t.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                        {t.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                                        {t.preview}
                                    </p>
                                </div>
                                {selectedTemplate === t.id && (
                                    <div className="bg-blue-500 text-white rounded-full p-0.5">
                                        <Check size={12} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplateSidebar;
