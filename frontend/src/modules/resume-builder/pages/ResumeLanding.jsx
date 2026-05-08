import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateGallery from '@/modules/resume-builder/components/TemplateGallery';
import { Sparkles, CheckCircle, Smartphone, Lock, ArrowRight, LayoutDashboard, UploadCloud } from 'lucide-react';
import Navbar from '@/shared/components/Navbar'; // Assuming global navbar
import { useAuth } from '@/context/AuthContext';
import '@/modules/home/styles/home.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setImportFlowStep, resetImportFlow } from '@/modules/resume-builder/state/uiSlice';
import ImportTemplateSelector from '@/modules/resume-builder/components/ImportTemplateSelector';

const ResumeLanding = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const backendURL = import.meta.env.VITE_BASE_URL;
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const { importFlow } = useSelector((state) => state.ui || { importFlow: { step: null, selectedTemplateId: null } });

    // --- IMPORT LOGIC ---
    const handleImportClick = () => {
        if (!user) {
            toast.error("Please sign in to import a resume");
            navigate('/login?redirect=/resume');
            return;
        }
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

    const ConditionalAction = () => {
        if (!loading && user) {
            const hasResumes = (user.resumeCount > 0 || user.sourceResumeCount > 0);
            if (hasResumes) {
                return (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Link
                            to="/my-resumes"
                            className="home-btn-primary font-bold text-lg px-8 py-4 rounded-full flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                            <LayoutDashboard size={20} />
                            Go to My Resumes
                        </Link>
                        <p className="text-indigo-600 font-medium text-sm bg-indigo-50 px-4 py-1.5 rounded-full shadow-sm">
                            Welcome back, {user.name?.split(' ')[0]}! You have {user.resumeCount + user.sourceResumeCount} resume{user.resumeCount + user.sourceResumeCount !== 1 ? 's' : ''} saved.
                        </p>
                    </div>
                );
            }
        }

        return (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
                    className="home-btn-primary font-bold px-10 py-4 rounded-full text-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    Start Building Now
                </button>
                <div className="text-slate-400 font-medium hidden sm:block">or</div>
                <button
                    onClick={handleImportClick}
                    className="home-btn-secondary bg-white font-bold px-8 py-4 rounded-full text-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <UploadCloud size={20} />
                    Import Resume
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
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

            {/* HERO SECTION */}
            <div className="home-hero-bg relative border-b border-slate-200 pt-32 pb-20 px-6 overflow-hidden">
                <div className="home-blob home-blob-purple" style={{ width: 800, height: 800, top: '-20%', right: '-10%' }} />
                <div className="home-blob home-blob-pink" style={{ width: 600, height: 600, bottom: '-20%', left: '-10%' }} />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center mb-6">
                        <span className="home-section-badge">
                            <Sparkles size={12} />
                            Trusted by 10,000+ Professionals
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                        Build Your <span className="home-gradient-text">Dream Resume</span> <br className="hidden md:block" /> in Minutes.
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Professional templates, real-time preview, and instant downloads. Create an account to save your progress and access your resumes from any device.
                    </p>

                    <div className="flex justify-center gap-8 mb-16 text-slate-600 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-500" />
                            <span>ATS-Friendly Templates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock size={18} className="text-indigo-500" />
                            <span>Secure Cloud Storage</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Smartphone size={18} className="text-blue-500" />
                            <span>Mobile Optimized</span>
                        </div>
                    </div>

                    {/* Conditional Action Button */}
                    <ConditionalAction />
                </div>
            </div>

            {/* TEMPLATE GALLERY */}
            <div id="gallery" className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Choose a Template to Start</h2>
                    <p className="text-slate-500 mt-4 text-base">Pick a design you love. Customization happens after you sign in.</p>
                </div>

                {/* We reuse the existing gallery. It handles "Not Logged In" by redirecting to Login on click. */}
                <TemplateGallery />
            </div>

        </div>
    );
};

export default ResumeLanding;
