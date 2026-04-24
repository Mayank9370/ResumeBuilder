import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/modules/resume-builder/components/DashboardHeader';
import TemplateGallery from '@/modules/resume-builder/components/TemplateGallery';
import axios from 'axios';
import { Edit3, Trash2 } from 'lucide-react';
import { templates } from '@/modules/resume-builder/constants/templates';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setImportFlowStep, resetImportFlow } from '@/modules/resume-builder/state/uiSlice';
import ImportTemplateSelector from '@/modules/resume-builder/components/ImportTemplateSelector';

const ResumeDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recentResumes, setRecentResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { importFlow } = useSelector((state) => state.ui || { importFlow: { step: null, selectedTemplateId: null } });

  const fileInputRef = useRef(null);

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
    
    // Pass selected template
    const selectedTemplateId = importFlow?.selectedTemplateId || "minimalist";
    formData.append("template", selectedTemplateId);

    try {
      const res = await axios.post(`${VITE_BASE_URL}/api/resumes/upload`, formData, {
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

  // Use Auth Context
  const { user: contextUser, loading: contextLoading } = useAuth();

  // Redirect to Mock Interview if draft exists
  useEffect(() => {
    if (contextLoading) return;
    try {
      const draft = sessionStorage.getItem("mockInterviewDraft");
      if (draft && contextUser) {
        console.log("[ResumeDashboard] Redirecting to Mock Interview Resume Draft");
        navigate('/mock-interview');
      }
    } catch (e) {
      console.error("Draft redirect error", e);
    }
  }, [contextLoading, contextUser, navigate]);

  // Helper for safe nested access
  const safe = (fn, fallback) => {
    try { return fn(); } catch { return fallback; }
  };

  const resumePlaceholder = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop";

  // Fetch Recent Resumes
  useEffect(() => {
    if (contextLoading) return;

    const fetchData = async () => {
      setUser(contextUser);

      if (!contextUser) {
        setRecentResumes([]);
        setLoading(false);
        return;
      }

      try {
        const resumesRes = await axios.get(`${VITE_BASE_URL}/api/resumes`, { withCredentials: true });

        if (resumesRes.data?.resumes) {
          // Sort by updatedAt desc and take top 4
          const sorted = resumesRes.data.resumes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setRecentResumes(sorted.slice(0, 4)); // Show only top 4
        }
      } catch (error) {
        console.error("Dashboard data fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [VITE_BASE_URL, contextUser, contextLoading]);

  const handleCreate = () => {
    document.getElementById('template-gallery').scrollIntoView({ behavior: 'smooth' });
  };

  const handleRenameClick = (id, currentTitle, e) => {
    e.stopPropagation();
    const newTitle = window.prompt("Enter new resume name:", currentTitle);
    if (newTitle && newTitle.trim() !== "" && newTitle !== currentTitle) {
      renameResume(id, newTitle);
    }
  };

  const renameResume = async (id, newTitle) => {
    try {
      await axios.patch(`${VITE_BASE_URL}/api/resumes/${id}`, { title: newTitle }, { withCredentials: true });
      setRecentResumes(prev => prev.map(r => (r._id || r.id) === id ? { ...r, title: newTitle } : r));
      toast.success("Resume renamed");
    } catch (error) {
      console.error("Rename error", error);
      toast.error("Failed to rename resume");
    }
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      deleteResume(id);
    }
  };

  const deleteResume = async (id) => {
    try {
      await axios.delete(`${VITE_BASE_URL}/api/resumes/${id}`, { withCredentials: true });
      setRecentResumes(prev => prev.filter(r => (r._id || r.id) !== id));
      toast.success("Resume deleted");
    } catch (error) {
      console.error("Delete error", error);
      toast.error("Failed to delete resume");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">

      <DashboardHeader
        user={user}
        resumeCount={recentResumes.length}
        onCreate={handleCreate}
        onImport={handleImportClick}
      />

      {/* IMPORT FLOW */}
      <ImportTemplateSelector 
        onClose={() => dispatch(resetImportFlow())}
        onNext={() => {
            dispatch(setImportFlowStep('file_upload'));
            if (fileInputRef.current) fileInputRef.current.click();
        }}
      />

      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,.txt"
        className="hidden"
        style={{ display: 'none' }}
      />

      {/* RECENT RESUMES GRID */}
      {recentResumes.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Recent Resumes</h2>
            <button
              onClick={() => navigate('/my-resumes')}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              View user resumes &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentResumes.map((resume) => (
              <div
                key={resume._id || resume.id}
                onClick={() => navigate(`/resume/builder/${resume._id || resume.id}`)}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-[280px] relative group cursor-pointer"
              >
                {/* Preview Image */}
                <div className="relative h-40 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  {(() => {
                    const templateObj = templates.find(t => t.id === resume.template) || templates.find(t => t.id === "minimalist");
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

                  {/* Hover Overlay Action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px]">
                    <button className="bg-white text-indigo-600 px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Edit Resume
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-bold text-slate-900 truncate pr-2 group-hover:text-indigo-600 transition-colors" title={resume.title || 'Untitled Resume'}>
                      {resume.title || 'Untitled Resume'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {safe(() => resume.personal_info.profession, "Professional")}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Last edited: {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleRenameClick(resume._id || resume.id, resume.title, e)}
                      className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <Edit3 size={12} /> Rename
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(resume._id || resume.id, e)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEMPLATE GALLERY SECTION */}
      <div id="template-gallery" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Choose a Template</h2>
          <button onClick={() => navigate('/my-resumes')} className="text-indigo-600 font-medium hover:underline">
            View My Resumes ({recentResumes.length > 0 ? 'All' : '0'})
          </button>
        </div>
        <TemplateGallery />
      </div>
    </div>
  );
};

export default ResumeDashboard;