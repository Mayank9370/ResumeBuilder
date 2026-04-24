import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { templates as localTemplates } from '@/modules/resume-builder/constants/templates';
import { mixTemplates } from '@/modules/resume-builder/utils/resumeTemplates';

const ChangeTemplateModal = ({ isOpen, onClose, currentTemplateId, currentColor, onSave }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(currentTemplateId);
    const [selectedColor, setSelectedColor] = useState(currentColor);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (isOpen) {
            setSelectedTemplate(currentTemplateId);
            setSelectedColor(currentColor);
            fetchTemplates();
        }
    }, [isOpen, currentTemplateId, currentColor]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/api/templates?limit=100`);

            // Start with local templates as the base
            let finalTemplates = [...localTemplates];

            if (res.data.success) {
                const dbTemplates = res.data.data;

                // Merge DB info into local templates where matches exist
                // If a DB template exists but isn't in local, add it (dynamic templates)

                // 1. Enrich local templates with DB data
                finalTemplates = finalTemplates.map(localT => {
                    const match = dbTemplates.find(dbT =>
                        (dbT.id && localT.id && dbT.id === localT.id) || // ID Match (Primary)
                        (dbT.name || "").toLowerCase().trim() === (localT.name || "").toLowerCase().trim() ||
                        (dbT.name || "").toLowerCase().trim() === (localT.id || "").toLowerCase().trim()
                    );

                    if (match) {
                        return { ...localT, ...match, image: localT.image || match.imageUrl };
                    }
                    return localT;
                });

                // 2. Add any DB-only templates that don't match local ones
                const dbOnly = dbTemplates.filter(dbT => {
                    return !finalTemplates.some(finalT =>
                        (dbT.id && finalT.id && dbT.id === finalT.id) ||
                        (finalT.name || "").toLowerCase().trim() === (dbT.name || "").toLowerCase().trim()
                    );
                });

                finalTemplates = [...finalTemplates, ...dbOnly];

                // 3. FINAL SAFETY: Deduplicate by ID
                const uniqueIds = new Set();
                finalTemplates = finalTemplates.filter(t => {
                    if (!t.id) return true; // keep strict?
                    if (uniqueIds.has(t.id)) return false;
                    uniqueIds.add(t.id);
                    return true;
                });
            }

            setTemplates(mixTemplates(finalTemplates));

        } catch (error) {
            console.error("Failed to fetch templates", error);
            setTemplates(mixTemplates(localTemplates));
        } finally {
            setLoading(false);
        }
    };

    const colors = [
        { name: "Blue", value: "#3B82F6" },
        { name: "Indigo", value: "#6366F1" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Green", value: "#10B981" },
        { name: "Red", value: "#EF4444" },
        { name: "Orange", value: "#F97316" },
        { name: "Teal", value: "#14B8A6" },
        { name: "Pink", value: "#EC4899" },
        { name: "Gray", value: "#6B7280" },
        { name: "Black", value: "#1F2937" }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white z-10">
                    <h2 className="text-2xl font-bold text-slate-800">Change Template</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">

                    {/* Colors Section */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Colors</h3>
                        <div className="flex flex-wrap gap-4">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`relative w-12 h-12 rounded-full border-2 transition-all ${selectedColor === color.value ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                >
                                    {selectedColor === color.value && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Check size={20} className="text-white drop-shadow-sm" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Templates Section */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Templates</h3>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : templates.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                No templates found. Please add some from the Admin Panel.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedTemplate === template.id ? 'border-blue-600 ring-4 ring-blue-600/10 shadow-xl scale-[1.02]' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg'}`}
                                    >
                                        <div className="aspect-[210/297] bg-slate-200">
                                            <img
                                                src={template.imageUrl || template.image}
                                                alt={template.name}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </div>

                                        {/* Selection Overlay */}
                                        {selectedTemplate === template.id && (
                                            <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-lg animate-in zoom-in duration-200">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}

                                        <div className="p-3 bg-white border-t border-slate-100">
                                            <h4 className={`text-sm font-bold truncate ${selectedTemplate === template.id ? 'text-blue-600' : 'text-slate-700'}`}>
                                                {template.name}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(selectedTemplate, selectedColor)}
                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeTemplateModal;
