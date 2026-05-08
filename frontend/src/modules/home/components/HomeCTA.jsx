import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomeCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="home-cta-bg relative overflow-hidden py-20 lg:py-24">
            {/* Decorative blobs */}
            <div className="home-blob home-blob-indigo" style={{ width: 400, height: 400, top: '-30%', left: '50%', transform: 'translateX(-50%)' }} />
            <div className="home-blob home-blob-pink" style={{ width: 300, height: 300, bottom: '-20%', right: '10%' }} />

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                {/* Divider above */}
                <div className="home-divider mb-12" />

                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
                    Ready to build your{' '}
                    <span className="home-gradient-text">professional resume?</span>
                </h2>
                <p className="text-slate-500 text-base mb-8 max-w-md mx-auto leading-relaxed">
                    Join millions of job seekers who have already built their successful careers with our platform.
                </p>

                <button
                    id="home-cta-build-now"
                    onClick={() => navigate('/resume')}
                    className="home-btn-primary font-bold text-base px-10 py-4 rounded-full inline-flex items-center gap-2"
                    aria-label="Build my resume now"
                >
                    Build My Resume Now
                    <ArrowRight size={16} />
                </button>

                {/* Reassurance line */}
                <p className="text-xs text-slate-400 mt-4 font-medium">
                    Free to start · No credit card required · Instant PDF export
                </p>
            </div>
        </section>
    );
};

export default HomeCTA;
