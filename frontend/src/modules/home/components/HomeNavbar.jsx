import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FileText, Menu, X } from 'lucide-react';

const HomeNavbar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="home-navbar" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Resume Builder home">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
                            <FileText size={16} className="text-white" />
                        </div>
                        <span className="text-lg font-bold home-navbar-logo-text whitespace-nowrap">
                            Resume Builder
                        </span>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/resume"
                            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            Templates
                        </Link>
                        {user && (
                            <Link
                                to="/dashboard"
                                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                My Resumes
                            </Link>
                        )}
                        {!user && (
                            <Link
                                to="/login"
                                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                        {user && (
                            <div className="flex items-center gap-2">
                                {user.image && (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="w-7 h-7 rounded-full border border-slate-200"
                                    />
                                )}
                                <span className="text-sm font-medium text-slate-700">
                                    {user.name?.split(' ')[0]}
                                </span>
                            </div>
                        )}
                        <button
                            id="home-navbar-cta"
                            onClick={() => navigate('/resume')}
                            className="home-btn-primary text-sm font-semibold px-5 py-2 rounded-full"
                            aria-label="Start building your resume"
                        >
                            Build My Resume
                        </button>
                    </div>

                    {/* ── Mobile hamburger ── */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile dropdown ── */}
            {menuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-3 shadow-sm">
                    <Link
                        to="/resume"
                        className="text-sm font-medium text-slate-700 py-2"
                        onClick={() => setMenuOpen(false)}
                    >
                        Templates
                    </Link>
                    {user && (
                        <Link
                            to="/dashboard"
                            className="text-sm font-medium text-slate-700 py-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            My Resumes
                        </Link>
                    )}
                    {!user && (
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-700 py-2"
                            onClick={() => setMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                    )}
                    <button
                        onClick={() => { navigate('/resume'); setMenuOpen(false); }}
                        className="home-btn-primary text-sm font-semibold px-5 py-2.5 rounded-full w-full mt-1"
                    >
                        Build My Resume
                    </button>
                </div>
            )}
        </nav>
    );
};

export default HomeNavbar;
