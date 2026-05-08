import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Upload, FileText, Sparkles } from 'lucide-react';
import '@/modules/home/styles/home.css';

const DashboardHeader = ({ user, resumeCount, onCreate, onImport }) => {
    const navigate = useNavigate();

    return (
        <div className="home-hero-bg border-b border-slate-200 py-20 px-6 text-center relative overflow-hidden">
            {/* Decorative blobs from home theme */}
            <div className="home-blob home-blob-purple" style={{ width: 600, height: 600, top: '-20%', left: '-10%' }} />
            <div className="home-blob home-blob-pink" style={{ width: 500, height: 500, bottom: '-15%', right: '-8%' }} />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="inline-flex items-center justify-center mb-6">
                    <span className="home-section-badge">
                        <Sparkles size={12} fill="currentColor" />
                        {user ? `Welcome Back, ${user.name.split(' ')[0]}!` : 'Start Building Today'}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    {user ? "Ready to update your " : "Resume Templates for "}
                    <span className="home-gradient-text">
                        {user ? "resume?" : "2025"}
                    </span>
                </h1>

                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    {user
                        ? (resumeCount > 0
                            ? `You have ${resumeCount} resume${resumeCount !== 1 ? 's' : ''} saved. create a new one or edit an existing profile.`
                            : "It looks like you haven't created any resumes yet. Select a template below to get started.")
                        : "Choose from our library of free and ATS-friendly premium templates to create a job-winning resume in minutes."
                    }
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                    <button
                        onClick={onCreate}
                        className="home-btn-primary font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Star size={20} className="text-yellow-400 fill-yellow-400" /> Create New Resume
                    </button>
                    {/* IMPORT RESUME BUTTON */}
                    <button
                        onClick={onImport}
                        className="home-btn-secondary font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 w-full sm:w-auto bg-white"
                    >
                        <Upload size={20} /> Import Resume
                    </button>
                </div>

                {resumeCount > 0 && (
                    <div className="mt-8">
                        <button
                            onClick={() => navigate('/my-resumes')}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-all"
                        >
                            View all my resumes &rarr;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHeader;
