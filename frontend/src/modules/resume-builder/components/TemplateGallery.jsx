import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { templates as localTemplates } from '@/modules/resume-builder/constants/templates';
import { mixTemplates } from '@/modules/resume-builder/utils/resumeTemplates';
import TemplateCard from '@/modules/resume-builder/components/TemplateCard';
import TemplateDetailModal from '@/modules/resume-builder/components/TemplateDetailModal';
import { useAuth } from '@/context/AuthContext';

const TemplateGallery = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [userPlan, setUserPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const CATEGORIES = ["All", "ATS Optimized", "Modern", "Executive", "Creative"];

    const [featurePrice, setFeaturePrice] = useState(null); // Init null to prove fetch works

    const fetchGalleryData = async () => {
        const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

        try {
            const [plansRes, templatesRes, featuresRes] = await Promise.allSettled([
                axios.get(`${BASE_URL}/api/payment/plans`),
                axios.get(`${BASE_URL}/api/templates?limit=100&status=published`),
                axios.get(`${BASE_URL}/api/features`)
            ]);

            // Handle Features (Get Price)
            if (featuresRes.status === 'fulfilled' && featuresRes.value.data.features) {
                const f = featuresRes.value.data.features.find(f => f.name === 'RESUME_CREATE');
                if (f) setFeaturePrice(f.token_price);
            }

            // Handle Plans & Entitlements
            if (plansRes.status === 'fulfilled' && plansRes.value.data.plans) {
                const fetchedPlans = plansRes.value.data.plans;
                setPlans(fetchedPlans);

                // Determine User Plan (using Context User)
                if (user && user.subscription?.planId) {
                    const foundPlan = fetchedPlans.find(p => p.razorpayPlanId === user.subscription.planId);
                    setUserPlan(foundPlan);
                } else if (user) {
                    // User logged in but no paid plan? maybe free plan?
                    // Typically database seeding creates a "free" plan with price 0.
                    const freePlan = fetchedPlans.find(p => p.price === 0);
                    setUserPlan(freePlan);
                } else {
                    setUserPlan(null);
                }
            }

            // Handle Templates (Merge DB data with Local Images)
            if (templatesRes.status === 'fulfilled' && templatesRes.value.data.data) {
                const dbTemplates = templatesRes.value.data.data;

                // 1. Start with Local Templates as the base
                let finalTemplates = [...localTemplates];

                // 2. Merge DB data into Local templates
                finalTemplates = finalTemplates.map(localT => {
                    const dbT = dbTemplates.find(d => d.id === localT.id || (d.name && d.name.toLowerCase() === localT.name.toLowerCase()));
                    if (dbT) {
                        return {
                            ...localT,
                            ...dbT, // DB overrides local (e.g. status, premium)
                            // Priority: DB Image > Local Image
                            image: (dbT.imageUrl && dbT.imageUrl.length > 5) ? dbT.imageUrl : ((dbT.image && dbT.image.length > 5) ? dbT.image : localT.image),
                            preview: dbT.description || localT.preview,
                            tags: dbT.category ? [dbT.category, ...(dbT.tags || [])] : (dbT.tags || [])
                        };
                    }
                    return localT;
                });

                // 3. Add any DB-only templates (dynamic ones not in local code)
                const dbOnly = dbTemplates.filter(dbT => {
                    return !localTemplates.some(localT => localT.id === dbT.id || localT.name.toLowerCase() === (dbT.name || "").toLowerCase());
                });

                // V11.7 STRICT MODE: Do NOT auto-add unknown templates from DB.
                if (dbOnly.length > 0) {
                    console.warn("[TemplateGallery] Blocked %d unknown templates from DB (Strict Mode Violation):", dbOnly.length, dbOnly.map(t => t.id));
                }

                // MIX THE ORDER BEFORE SETTING STATE
                const mixedTemplates = mixTemplates(finalTemplates);
                setTemplates(mixedTemplates); 
                
            } else {
                // Return local templates if API has no data but succeeds
                setTemplates(mixTemplates(localTemplates));
            }

        } catch (error) {
            console.error("Gallery Access Check Failed", error);
            // Return empty if API fails
            setTemplates([]);
        } finally {
            setDataLoading(false);
        }
    };

    // Re-run when auth creates user or finishes loading
    React.useEffect(() => {
        if (!authLoading) {
            fetchGalleryData();
        }
    }, [authLoading, user]);

    const loading = authLoading || dataLoading;

    // FILTER LOGIC
    const displayedTemplates = templates
        .filter(t => !t.hiddenFromGallery)
        .filter(t => selectedCategory === 'All' || (t.tags && t.tags.includes(selectedCategory)));

    const isLocked = (templateOrId) => {
        return false; // FORCE UNLOCK ALL TEMPLATES
    };

    const handleUseTemplate = (templateId) => {
        // DIRECT ACCESS - No Token Check
        if (!user) {
            // Guest -> Login -> Builder
            navigate(`/login?redirect=/resume/builder?templateId=${templateId}`);
            return;
        }

        // Direct Access
        navigate(`/resume/builder?templateId=${templateId}`);
    };

    const handlePreview = (templateId) => {
        // Find the full template object
        const template = templates.find(t => t.id === templateId) || templateId; // simplified if passed object
        setPreviewTemplate(template);
    };

    return (
        <div className="py-8 relative">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Start with a Template</h2>
                    <p className="text-slate-500 mt-2">Choose from our professionally designed templates to get started quickly.</p>
                </div>
            </div>

            {/* FILTER TABS */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === category
                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm h-96 flex flex-col">
                            <div className="bg-slate-200 h-64 w-full"></div>
                            <div className="p-4 flex-1 space-y-3">
                                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                                <div className="flex gap-2">
                                    <div className="h-4 bg-slate-200 rounded w-12"></div>
                                    <div className="h-4 bg-slate-200 rounded w-12"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : displayedTemplates.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">No Templates Found</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                        We couldn't load any templates at the moment. Please try checking your connection or come back later.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayedTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            isLocked={isLocked(template)}
                            onUse={handleUseTemplate}
                            onPreview={() => setPreviewTemplate(template)}
                        />
                    ))}
                </div>
            )}

            {/* PREVIEW MODAL */}
            {previewTemplate && (
                <TemplateDetailModal
                    template={previewTemplate}
                    isLocked={isLocked(previewTemplate)}
                    tokenCost={featurePrice}
                    onClose={() => setPreviewTemplate(null)}
                    onUse={handleUseTemplate}
                />
            )}
        </div>
    );
};

export default TemplateGallery;
