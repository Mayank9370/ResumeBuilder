import React, { useState, useEffect } from 'react';
import { loadTemplate, getRegisteredTemplate } from '@/modules/resume-builder/utils/resumeTemplates';
import { resolveLayoutStrategy } from '@/core/engine/layoutRegistry';
import { migrateTemplateId } from '@/modules/resume-builder/utils/templateMigration';

const ResumeLayoutEngine = (props) => {
    // Default to classic if undefined
    const { templateId = 'minimalist' } = props;

    // Async State
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Resolve Effective ID (Handle Aliases)
    const effectiveTemplateId = migrateTemplateId(templateId);

    // 2. Load Template Logic (Side Effect)
    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        console.log(`[LAYOUT ENGINE] Loading Template: ${effectiveTemplateId}`);

        loadTemplate(effectiveTemplateId)
            .then(tmpl => {
                if (isMounted) {
                    setActiveTemplate(tmpl);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error("[LAYOUT ENGINE] Load Failed:", err);
                    
                    // 🛡️ FALLBACK SAFETY GUARD
                    // If the requested template is missing (e.g. deleted), fallback to default.
                    if (effectiveTemplateId !== 'minimalist') {
                         console.warn(`[LAYOUT ENGINE] 🛡️ Fallback triggered. Switching ${effectiveTemplateId} -> minimalist`);
                         
                         // Recursively load default
                         loadTemplate('minimalist')
                            .then(defaultTmpl => {
                                if (isMounted) {
                                    setActiveTemplate(defaultTmpl);
                                    setLoading(false);
                                }
                            })
                            .catch(fallbackErr => {
                                 // If even default fails, then show error
                                 setError(fallbackErr);
                                 setLoading(false);
                            });
                         return;
                    }

                    // Use metadata as fallback if possible, or just error
                    const meta = getRegisteredTemplate(effectiveTemplateId);
                    setError(err);
                    setLoading(false);
                }
            });

        return () => { isMounted = false; };
    }, [effectiveTemplateId]);

    // 3. Loading State
    if (loading) {
        return (
            <div className="flex items-center justify-center h-[297mm] bg-white shadow-lg">
                <div className="animate-pulse text-gray-400 text-sm font-medium">
                    Loading Template...
                </div>
            </div>
        );
    }

    // 4. Error State
    if (error || !activeTemplate) {
        return (
            <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-red-300 bg-red-50 rounded-lg m-4">
                <div className="text-center">
                    <h3 className="text-red-600 font-bold text-lg mb-2">Template Load Error</h3>
                    <p className="text-red-500">
                        Failed to load template: <span className="font-mono bg-red-100 px-1 rounded">{effectiveTemplateId}</span>
                    </p>
                    <p className="text-xs text-red-400 mt-2">{error?.message}</p>
                </div>
            </div>
        );
    }

    // 5. Resolve Layout Strategy (Component)
    // Now we have the full template object (logic + metadata)
    const StrategyComponent = resolveLayoutStrategy(activeTemplate.id);

    if (!StrategyComponent) {
        return (
            <div className="flex items-center justify-center h-[500px] pb-10">
                <div className="text-center">
                    <h3 className="text-red-600 font-bold">Strategy Error</h3>
                    <p>No renderer for {activeTemplate.id}</p>
                </div>
            </div>
        );
    }

    // 6. Render Strategy
    const strategyKey = `${activeTemplate.id}:${StrategyComponent.displayName || StrategyComponent.name}`;

    return (
        <StrategyComponent
            key={strategyKey}
            {...props}
            template={activeTemplate}
        />
    );
};

// Error Boundary Wrapper
class LayoutErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return <div className="p-4 text-red-600">CRITICAL RENDER CRASH: {this.state.error?.message}</div>;
        }
        return this.props.children;
    }
}

export const LayoutEngine = (props) => (
    <LayoutErrorBoundary>
        <ResumeLayoutEngine {...props} />
    </LayoutErrorBoundary>
);

export default LayoutEngine;
