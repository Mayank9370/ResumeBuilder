import React, { useEffect, useState } from 'react';
import { FiUploadCloud } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { Edit3, Trash2, FileText, MoreVertical, Copy, Globe, Lock, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { templates } from '@/modules/resume-builder/constants/templates';
import { useDispatch, useSelector } from 'react-redux';
import { setImportFlowStep, resetImportFlow } from '@/modules/resume-builder/state/uiSlice';
import ImportTemplateSelector from '@/modules/resume-builder/components/ImportTemplateSelector';

const MyResumes = () => {
    // Existing Builder State
    const [allResume, setAllResume] = useState([]);
    // Re-declare necessary state that might have been lost in the big block replace
    const [activeTab, setActiveTab] = useState('builder');
    const [currentPage, setCurrentPage] = useState(1);
    const RESUMES_PER_PAGE = 8;
    const [sourceResumes, setSourceResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSource, setLoadingSource] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    // Unified Loading State
    const [initializing, setInitializing] = useState(true);

    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BASE_URL;

    // --- IMPORT LOGIC ---
    const fileInputRef = React.useRef(null);
    const dispatch = useDispatch();
    const { importFlow } = useSelector((state) => state.ui || { importFlow: { step: null, selectedTemplateId: null } });

    const handleImportClick = () => {
        dispatch(setImportFlowStep('template_selection'));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        dispatch(setImportFlowStep('parsing'));
        // Toast Loading
        const loadingToast = toast.loading("Analyzing your resume... This takes about 10-15 seconds.");

        const formData = new FormData();
        formData.append("resumeFile", file);

        const selectedTemplateId = importFlow?.selectedTemplateId || "minimalist";
        formData.append("template", selectedTemplateId);

        try {
            const res = await axios.post(`${backendURL}/api/resume/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Resume Parsed Successfully!", { id: loadingToast });
                if (res.data.warning) {
                    toast(res.data.warning, { icon: '⚠️', duration: 5000 });
                }
                // Redirect
                const resumeId = res.data.resume.id || res.data.resume._id;
                dispatch(setImportFlowStep('done'));
                dispatch(resetImportFlow());
                navigate(`/resume/builder/${resumeId}?templateId=${selectedTemplateId}`);
            }
        } catch (err) {
            console.error("Import Error:", err);
            toast.error(err.response?.data?.message || "Failed to parse resume", { id: loadingToast });
            dispatch(resetImportFlow());
        } finally {
            // Reset Input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    // --------------------

    const safe = (fn, fallback) => {
        try { return fn(); } catch { return fallback; }
    };

    const createResume = () => navigate(`/resume/builder`);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!backendURL) {
                toast.error("Backend URL is not configured");
                setLoading(false);
                return;
            }

            setInitializing(true);
            try {
                // Parallel Fetch
                const [builderRes, sourceRes] = await Promise.allSettled([
                    axios.get(`${backendURL}/api/resumes`, { withCredentials: true }),
                    axios.get(`${backendURL}/api/resumes/source-resumes`, { withCredentials: true })
                ]);

                // Builder Processing
                let builderData = [];
                if (builderRes.status === 'fulfilled' && Array.isArray(builderRes.value?.data?.resumes)) {
                    builderData = builderRes.value.data.resumes;
                }
                setAllResume(builderData);

                // Source Processing
                let sourceData = [];
                if (sourceRes.status === 'fulfilled' && Array.isArray(sourceRes.value?.data?.resumes)) {
                    sourceData = sourceRes.value.data.resumes;
                }
                setSourceResumes(sourceData);

                // Smart Tab Logic:
                // 1. Check URL param first (Deep Link)
                const params = new URLSearchParams(window.location.search);
                const tabParam = params.get('tab');

                if (tabParam === 'library') {
                    setActiveTab('uploads');
                } else if (builderData.length === 0 && sourceData.length > 0) {
                    // 2. Default to Library (Uploads) if they have uploads but no drafts
                    setActiveTab('uploads');
                } else {
                    // 3. Fallback to Builder
                    setActiveTab('builder');
                }

            } catch (e) {
                console.error("Unified fetch error", e);
            } finally {
                setLoading(false);
                setLoadingSource(false);
                setInitializing(false);
            }
        };

        fetchAllData();
    }, []);

    const handleDeleteClick = (id) => {
        if (window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
            deleteResume(id);
        }
    };

    const deleteResume = async (id) => {
        try {
            await axios.delete(`${backendURL}/api/resumes/${id}`, { withCredentials: true });
            setAllResume(prev => prev.filter(r => r._id !== id));
            toast.success("Resume deleted");
        } catch {
            toast.error("Failed to delete resume");
        }
    };

    const handleSoftDelete = async (id) => {
        if (window.confirm("Deleting this resume will remove it from reuse. Past interviews and applications will NOT be affected.")) {
            try {
                await axios.delete(`${backendURL}/api/resumes/source-resumes/${id}`, { withCredentials: true });
                setSourceResumes(prev => prev.filter(r => r.id !== id));
                toast.success("Resume deleted");
            } catch (e) {
                toast.error(e.response?.data?.message || "Delete failed");
            }
        }
    };

    const handleRename = async (id) => {
        if (!editName.trim()) return;
        try {
            await axios.patch(`${backendURL}/api/resumes/source-resumes/${id}`, { display_name: editName }, { withCredentials: true });
            setSourceResumes(prev => prev.map(r => r.id === id ? { ...r, display_name: editName } : r));
            setEditingId(null);
            toast.success("Renamed successfully");
        } catch (e) {
            toast.error(e.response?.data?.message || "Rename failed");
        }
    };

    const startEditing = (r) => {
        setEditingId(r.id);
        setEditName(r.display_name || r.original_filename);
    };

    const resumePlaceholder = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500 pt-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-28 px-6 pb-12">
            {/* IMPORT FLOW */}
            <ImportTemplateSelector 
                onClose={() => dispatch(resetImportFlow())}
                onNext={() => {
                    dispatch(setImportFlowStep('file_upload'));
                    if (fileInputRef.current) fileInputRef.current.click();
                }}
            />

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                style={{ display: 'none' }}
            />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 max-w-7xl mx-auto border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Resumes</h1>
                    <p className="text-slate-500 mt-2">Manage your created and uploaded resumes.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={createResume}
                        className="flex items-center gap-2 bg-slate-900 text-white py-2.5 px-6 rounded-full shadow-lg shadow-slate-900/20 hover:bg-slate-800 font-medium transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                        <FaPlus size={16} /> Create New
                    </button>
                    {/* IMPORT BUTTON */}
                    <button
                        onClick={handleImportClick}
                        className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 py-2.5 px-6 rounded-full shadow-sm hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 font-medium transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                        <FiUploadCloud size={18} /> Import Resume
                    </button>
                </div>
            </div>

            {/* TABS */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex space-x-1 rounded-xl bg-slate-200/50 p-1 w-fit">
                    <button
                        onClick={() => setActiveTab('builder')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'builder'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <span>Drafts (Builder)</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'builder' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                            {allResume.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('uploads')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'uploads'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <span>Library (Ready to Use)</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'uploads' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                            {sourceResumes.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto">
                {activeTab === 'builder' ? (
                    // BUILDER RESUMES (Existing Logic)
                    allResume.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                            {/* Empty State */}
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">No resumes yet</h3>
                            <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">
                                Start by creating a new resume from scratch or import your existing one.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={createResume}
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white py-2.5 px-6 rounded-lg hover:bg-indigo-700"
                                >
                                    <FaPlus size={18} /> Create Resume
                                </button>
                                <button
                                    onClick={handleImportClick}
                                    className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-300 py-2.5 px-6 rounded-lg hover:bg-slate-50"
                                >
                                    <FiUploadCloud size={18} /> Import Existing
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {/* Pagination Logic for Data */}
                                {allResume
                                    .slice(
                                        (currentPage - 1) * RESUMES_PER_PAGE,
                                        currentPage * RESUMES_PER_PAGE
                                    )
                                    .map((res) => (
                                        <div
                                            key={res?._id}
                                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-[280px] relative group"
                                        >
                                            {/* Preview Image */}
                                            <div
                                                onClick={() => navigate(`/resume/builder/${res?._id}`)}
                                                className="relative h-40 cursor-pointer bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100"
                                            >
                                                {(() => {
                                                    const templateObj = templates.find(t => t.id === res.template) || templates.find(t => t.id === "minimalist");
                                                    const imageSrc = templateObj?.image || resumePlaceholder;
                                                    return (
                                                        <img
                                                            src={imageSrc}
                                                            className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                                                            onError={(e) => (e.target.src = resumePlaceholder)}
                                                            alt="Resume Preview"
                                                        />
                                                    );
                                                })()}
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            {/* Info */}
                                            <div className="p-4 flex flex-col justify-between flex-grow">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3
                                                            onClick={() => navigate(`/resume/builder/${res?._id}`)}
                                                            className="font-medium text-slate-900 cursor-pointer hover:text-indigo-600 truncate pr-2"
                                                            title={res?.title || "Untitled Resume"}
                                                        >
                                                            {res?.title || "Untitled Resume"}
                                                        </h3>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                        {safe(() => res.personal_info.profession, "No profession")}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-2">
                                                        Last edited: {new Date(res.updatedAt || Date.now()).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                                                    <button
                                                        onClick={() => navigate(`/resume/builder/${res?._id}`)}
                                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
                                                    >
                                                        <Edit3 size={12} /> Edit Resume
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(res._id);
                                                        }}
                                                        className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1"
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            {/* Pagination Controls */}
                            {allResume.length > RESUMES_PER_PAGE && (
                                <div className="flex justify-center items-center gap-4 mt-12">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white text-slate-600 shadow-sm font-medium"
                                    >
                                        <ChevronLeft size={16} /> Previous
                                    </button>
                                    <span className="text-sm font-medium text-slate-600">
                                        Page {currentPage} of {Math.ceil(allResume.length / RESUMES_PER_PAGE)}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        disabled={currentPage >= Math.ceil(allResume.length / RESUMES_PER_PAGE)}
                                        className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white text-slate-600 shadow-sm font-medium"
                                    >
                                        Next <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    )
                ) : (
                    // UPLOADED RESUMES (SourceResume)
                    <div className="space-y-6">
                        {/* Info Banner */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-blue-900 text-sm">Reusable Resume Library</h3>
                                <p className="text-xs text-blue-700 mt-1">
                                    Upload once, reuse everywhere (Mock Interview, Smart Apply).
                                    <span className="font-bold ml-1">Limit: 5 Resumes.</span>
                                </p>
                            </div>
                            <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 border border-blue-100">
                                {sourceResumes.length} / 5 Used
                            </div>
                        </div>

                        {sourceResumes.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUploadCloud size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900">No saved resumes</h3>
                                <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">
                                    Upload a resume during a Mock Interview or Job Application to save it here.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sourceResumes.map(r => (
                                    <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                                                    {r.file_type}
                                                </div>
                                                <div className="min-w-0 flex-1 max-w-full">
                                                    {editingId === r.id ? (
                                                        <input
                                                            autoFocus
                                                            className="w-full border border-indigo-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                                                            value={editName}
                                                            onChange={e => setEditName(e.target.value)}
                                                            onBlur={() => handleRename(r.id)}
                                                            onKeyDown={e => e.key === 'Enter' && handleRename(r.id)}
                                                        />
                                                    ) : (
                                                        <h4 className="font-semibold text-slate-900 text-sm truncate" title={r.original_filename}>
                                                            {r.display_name || r.original_filename}
                                                        </h4>
                                                    )}
                                                    <p className="text-xs text-slate-500 truncate">{new Date(r.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-3 mt-auto">
                                            {editingId === r.id ? (
                                                <button onClick={() => handleRename(r.id)} className="text-xs font-semibold text-green-600 hover:underline">
                                                    Save
                                                </button>
                                            ) : (
                                                <button onClick={() => startEditing(r)} className="text-xs font-semibold text-gray-500 hover:text-indigo-600 flex items-center gap-1">
                                                    <Edit3 size={12} /> Rename
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleSoftDelete(r.id)}
                                                className="text-xs font-semibold text-gray-500 hover:text-red-500 flex items-center gap-1 ml-2"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyResumes;
