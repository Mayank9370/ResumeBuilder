import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, TrendingUp, Star, Zap } from 'lucide-react';

/* ── Small sub-components for the right-side mock composition ── */

const MockResumeCard = () => (
    <div className="home-mock-resume w-full max-w-xs mx-auto">
        {/* Header bar */}
        <div className="home-mock-header px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/30 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-white/70 rounded-full w-28" />
                <div className="h-2 bg-white/40 rounded-full w-20" />
            </div>
        </div>

        {/* Body lines */}
        <div className="p-5 space-y-4 bg-white">
            {/* Section title */}
            <div className="space-y-2">
                <div className="h-2 bg-indigo-100 rounded-full w-24" />
                <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                <div className="h-1.5 bg-slate-100 rounded-full w-5/6" />
                <div className="h-1.5 bg-slate-100 rounded-full w-4/5" />
            </div>

            <div className="h-px bg-slate-100" />

            {/* Experience block */}
            <div className="space-y-2">
                <div className="h-2 bg-indigo-100 rounded-full w-28" />
                <div className="flex items-center justify-between">
                    <div className="h-2 bg-slate-200 rounded-full w-32" />
                    <div className="h-1.5 bg-slate-100 rounded-full w-16" />
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                <div className="h-1.5 bg-slate-100 rounded-full w-11/12" />
                <div className="h-1.5 bg-slate-100 rounded-full w-4/5" />
            </div>

            <div className="h-px bg-slate-100" />

            {/* Skills block */}
            <div className="space-y-2">
                <div className="h-2 bg-indigo-100 rounded-full w-16" />
                <div className="flex flex-wrap gap-1.5">
                    {['React', 'Node.js', 'TypeScript', 'CSS', 'AWS'].map(s => (
                        <span key={s} className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-semibold text-indigo-600">
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Education */}
            <div className="space-y-2">
                <div className="h-2 bg-indigo-100 rounded-full w-20" />
                <div className="h-1.5 bg-slate-100 rounded-full w-3/4" />
                <div className="h-1.5 bg-slate-100 rounded-full w-1/2" />
            </div>
        </div>
    </div>
);

const FloatingScoreBadge = () => (
    <div className="home-floating-card home-float-slow p-3 flex items-center gap-2.5 min-w-[140px]"
        style={{ bottom: '20%', right: '-12%' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Star size={14} className="text-white" />
        </div>
        <div>
            <div className="text-xs font-bold text-slate-800">ATS Score</div>
            <div className="text-lg font-black text-emerald-600 leading-none">98%</div>
        </div>
    </div>
);

const FloatingTemplateBadge = () => (
    <div className="home-floating-card home-float-medium p-3 flex items-center gap-2.5 min-w-[160px]"
        style={{ top: '18%', left: '-10%' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Zap size={14} className="text-white" />
        </div>
        <div>
            <div className="text-xs font-bold text-slate-800">Templates</div>
            <div className="text-sm font-bold text-amber-600">25+ Designs</div>
        </div>
    </div>
);

/* ── Main Hero Section ── */
const HomeHero = () => {
    const navigate = useNavigate();

    return (
        <section className="home-hero-bg relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="home-blob home-blob-purple" style={{ width: 600, height: 600, top: '-20%', right: '-10%' }} />
            <div className="home-blob home-blob-pink" style={{ width: 500, height: 500, bottom: '-15%', left: '-8%' }} />
            <div className="home-blob home-blob-orange" style={{ width: 400, height: 400, top: '40%', right: '20%' }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* ── LEFT: Content ── */}
                    <div className="text-center lg:text-left">

                        {/* Badge */}
                        <div className="inline-flex justify-center lg:justify-start mb-6">
                            <span className="home-section-badge">
                                <TrendingUp size={11} />
                                #1 Resume Builder Platform
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
                            The Best Online{' '}
                            <span className="home-gradient-text block sm:inline">
                                Resume Builder
                            </span>
                        </h1>

                        {/* Supporting text */}
                        <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                            Easily create a resume from any device with our best-in-class resume builder platform.
                            Professional templates, real-time preview, and instant PDF downloads.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mb-10 justify-center lg:justify-start">
                            <button
                                id="home-hero-primary-cta"
                                onClick={() => navigate('/resume')}
                                className="home-btn-primary font-bold text-base px-7 py-3.5 rounded-full flex items-center gap-2 w-full sm:w-auto justify-center"
                                aria-label="Create my resume now"
                            >
                                Create My Resume Now
                                <ArrowRight size={16} />
                            </button>
                            <button
                                id="home-hero-secondary-cta"
                                onClick={() => navigate('/resume')}
                                className="home-btn-secondary font-semibold text-base px-7 py-3.5 rounded-full flex items-center gap-2 w-full sm:w-auto justify-center"
                                aria-label="Browse all templates"
                            >
                                <Upload size={16} />
                                Browse Templates
                            </button>
                        </div>

                        {/* Trust metrics */}
                        <div className="flex items-center gap-6 justify-center lg:justify-start mb-8">
                            <div>
                                <div className="home-stat-chip text-xl">
                                    <TrendingUp size={16} />
                                    38%
                                </div>
                                <div className="home-stat-label mt-0.5">more interviews</div>
                            </div>
                            <div className="w-px h-10 bg-slate-200" />
                            <div>
                                <div className="home-stat-chip text-xl">
                                    <TrendingUp size={16} />
                                    23%
                                </div>
                                <div className="home-stat-label mt-0.5">more likely to get a job offer</div>
                            </div>
                        </div>

                        {/* Hired-by strip */}
                        <div>
                            <p className="text-xs text-slate-400 font-medium mb-3 uppercase tracking-wide">
                                Subscribers have been hired by
                            </p>
                            <div className="flex items-center gap-5 flex-wrap justify-center lg:justify-start">
                                {['Deloitte', 'J.P.Morgan', 'Facebook', 'Goldman Sachs', 'Apple'].map(co => (
                                    <span key={co} className="home-company-logo">{co}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Visual composition ── */}
                    <div className="relative flex items-center justify-center lg:justify-end h-[480px] lg:h-[520px]">
                        {/* Main card */}
                        <div className="relative w-72 sm:w-80">
                            <FloatingTemplateBadge />
                            <MockResumeCard />
                            <FloatingScoreBadge />
                        </div>

                        {/* Background shape */}
                        <div className="absolute inset-0 -z-10 flex items-center justify-center">
                            <div className="w-72 h-72 rounded-full opacity-60"
                                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(219,39,119,0.08), rgba(234,88,12,0.06))' }} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HomeHero;
