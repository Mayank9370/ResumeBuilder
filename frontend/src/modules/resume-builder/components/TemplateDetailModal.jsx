import React from 'react';
import { X, CheckCircle, Star, PenTool, Sparkles, Download, ArrowRight, Coins, Eye, Gauge, Layout } from 'lucide-react';

const TemplateDetailModal = ({ template, isLocked, tokenCost, onClose, onUse }) => {
    if (!template) return null;

    // --- MARKETING & SUITABILITY INTEL (Field Guide) ---
    // Mapped from Category/Tags - NOT AI Analysis
    const getSuitabilityText = (tags = []) => {
        const lowerTags = tags.map(t => t.toLowerCase());
        if (lowerTags.includes('creative')) return "Style Guide: Best for designers, artists, and marketing roles. Emphasizes portfolio and visual impact.";
        if (lowerTags.includes('professional') || lowerTags.includes('corporate')) return "Style Guide: Ideal for banking, legal, and executive roles. Clean, traditional structure.";
        if (lowerTags.includes('modern')) return "Style Guide: Great for tech, startup, and forward-thinking companies. Sleek and efficient layout.";
        if (lowerTags.includes('simple')) return "Style Guide: Best for entry-level and academic applications. Focuses on content clarity.";
        return "Style Guide: A versatile, balanced template suitable for most industries.";
    };

    // --- ATS INTELLIGENCE (Heuristic - Normalized & Capped) ---
    // Global Logic: No per-template overrides. Future templates inherit based on tags.
    const getATSRating = (tags = []) => {
        const lowerTags = tags.map(t => t.toLowerCase());

        // BASELINE: All templates start with a base score
        let score = 70;

        // PENALTIES (Visual Complexity)
        if (lowerTags.includes('creative')) score -= 15; // Heavy visuals, columns -> ~55
        if (lowerTags.includes('modern')) score -= 5;    // Some icons/colors -> ~65

        // BONUSES (Structural Clarity)
        // Note: Check for 'simple' first as it often overlaps with professional
        if (lowerTags.includes('simple') || lowerTags.includes('minimalist')) {
            score += 10; // -> ~80
        } else if (lowerTags.includes('professional') || lowerTags.includes('corporate')) {
            score += 8;  // -> ~78
        }

        // HARD CAP (Safety)
        if (score > 85) score = 85;
        if (score < 50) score = 50;

        return score;
    };

    // --- CONTEXTUAL STRENGTH (Capability Mapping) ---
    const getTemplateStrength = (tags = []) => {
        const lowerTags = tags.map(t => t.toLowerCase());
        if (lowerTags.includes('creative')) return "Visually impactful portfolio design";
        if (lowerTags.includes('professional')) return "Strong executive readability";
        if (lowerTags.includes('modern')) return "Clean, screen-friendly structure";
        if (lowerTags.includes('simple')) return "Maximum space for content";
        return "Balanced text-to-whitespace ratio";
    };

    const suitabilityText = getSuitabilityText(template.tags);
    const atsScore = getATSRating(template.tags);
    const contextStrength = getTemplateStrength(template.tags);

    // --- CAPABILITIES (The "Value" Stack) ---
    const features = [
        { icon: Sparkles, text: "AI-Assisted Content Suggestions" },
        { icon: Layout, text: contextStrength }, // Contextual Strength
        { icon: CheckCircle, text: "Switch templates anytime without losing data" }, // Flexibility Assurance (Always Present)
        { icon: Download, text: "Export as PDF, Word (DOCX), or Text" },
        { icon: PenTool, text: "Fully customizable colors & fonts" }
    ];

    // Filter Badges: Only show known categories, ignore internal codes like SPC/P
    const knownCategories = ['professional', 'modern', 'creative', 'simple', 'minimalist'];
    const displayBadges = template.tags?.filter(t => knownCategories.includes(t.toLowerCase())) || [];

    // Color code ATS Score
    const getScoreColor = (score) => {
        if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200"; // Green for 80+
        if (score >= 65) return "text-blue-600 bg-blue-50 border-blue-200";       // Blue for 65-79
        return "text-amber-600 bg-amber-50 border-amber-200";                     // Amber for <65
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex overflow-hidden relative animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-slate-100 rounded-full text-slate-500 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Left Side: Image Preview */}
                <div className="w-1/2 bg-slate-100/50 p-8 overflow-y-auto flex items-center justify-center border-r border-slate-100">
                    <img
                        src={template.image}
                        alt={template.name}
                        className="w-full max-w-md shadow-xl rounded-lg border border-slate-200"
                    />
                </div>

                {/* Right Side: Marketing & Action */}
                <div className="w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto bg-white">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex flex-wrap gap-2">
                                {isLocked ? (
                                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                        <Star size={10} fill="currentColor" /> PREMIUM
                                    </span>
                                ) : (
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">FREE</span>
                                )}
                                {displayBadges.map(tag => (
                                    <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* ATS Score Badge with Tooltip */}
                            <div
                                className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 cursor-help ${getScoreColor(atsScore)}`}
                                title="ATS compatibility is an estimated score based on layout structure, section order, and text readability."
                            >
                                <Gauge size={14} />
                                <span>ATS Compatibility: {atsScore}% (Est.)</span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{template.name}</h2>

                        {/* Suitability Intel */}
                        <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-indigo-500 pl-3 py-1 bg-indigo-50/50 rounded-r">
                            {suitabilityText}
                        </p>
                    </div>

                    {/* Capabilities Grid */}
                    <div className="grid grid-cols-1 gap-4 mb-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-slate-700 font-medium p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                <feature.icon size={20} className="text-indigo-600" />
                                <span>{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto">
                        {/* Action Button */}
                        <button
                            onClick={() => onUse(template.id)}
                            className="w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Use This Template <ArrowRight size={20} />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TemplateDetailModal;