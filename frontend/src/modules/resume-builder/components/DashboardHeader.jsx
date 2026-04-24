import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Upload, FileText, Sparkles } from 'lucide-react';

const DashboardHeader = ({ user, resumeCount, onCreate, onImport }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white border-b border-slate-200 py-16 px-6 text-center relative overflow-hidden">
            {/* Background Blobs (Matches Hero) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
                <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-6 tracking-wide uppercase shadow-sm">
                    <Sparkles size={12} fill="currentColor" />
                    {user ? `Welcome Back, ${user.name.split(' ')[0]}!` : 'Start Building Today'}
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    {user ? "Ready to update your resume?" : "Resume Templates for 2025"}
                </h1>

                <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
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
                        className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full shadow-xl shadow-slate-900/20 transition-all duration-200 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                    >
                        <Star size={20} className="text-yellow-400 fill-yellow-400" /> Create New Resume
                    </button>
                    {/* IMPORT RESUME BUTTON */}
                    <button
                        onClick={onImport}
                        className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-full border-2 border-slate-200 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 transform hover:-translate-y-1"
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
