import React from 'react';
import HomeNavbar from '@/modules/home/components/HomeNavbar';
import HomeHero from '@/modules/home/components/HomeHero';
import HomeFeatures from '@/modules/home/components/HomeFeatures';
import HomeFeaturedTemplates from '@/modules/home/components/HomeFeaturedTemplates';
import HomeCTA from '@/modules/home/components/HomeCTA';

// Import scoped home page styles (namespaced under .home-page — zero global leakage)
import '@/modules/home/styles/home.css';

/**
 * HomePage — Landing page shell.
 * Pure composition: no business logic, no Redux, no global state mutations.
 * All child components are self-contained.
 */
const HomePage = () => {
    return (
        <div className="home-page min-h-screen overflow-x-hidden">
            <HomeNavbar />
            <main>
                <HomeHero />
                <HomeFeatures />
                <HomeFeaturedTemplates />
                <HomeCTA />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-slate-400 font-medium">
                        © {new Date().getFullYear()} Resume Builder. Built with ❤️. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5 text-sm text-slate-400">
                        <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms</span>
                        <span className="hover:text-slate-600 cursor-pointer transition-colors">Support</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
