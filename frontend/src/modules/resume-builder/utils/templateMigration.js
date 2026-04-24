
/**
 * Template Migration Layer (V11.4b)
 * 
 * Handles mapping of deprecated/deleted template IDs to their canonical "Survivor" counterparts.
 * This ensures that legacy resumes using deleted templates still load correctly by utilizing
 * the survivor template with appropriate configuration.
 */

const LEGACY_TEMPLATE_MAP = {
    // [Deleted ID] : [Survivor ID]
    'classic': 'minimalist', // Explicit mapping for the deleted classic template
    'timeline-classic': 'professional-timeline', // Renamed to "Flow Line"
    'compact': 'engineer',
    'professional-latex': 'engineer',
    'blue-clean': 'minimalist',     // Was 'modern' (COMPOSED, removed)
    'cyan-header': 'silicon',
    'rose-minimal': 'minimalist',    // Was 'minimal' (removed)
    'elegant-circle': 'minimalist',
    'minimal-sidebar': 'minimalist',  // Was 'classic-sidebar' (COMPOSED, removed)
    'minimal-header': 'minimalist',
    'green-modern': 'minimalist',    // Was 'teal-side-label' (COMPOSED, removed)
    'canva-template': 'minimalist',   // Was 'soft-rose' (COMPOSED, removed)
    'minimal-list': 'minimalist',
    'red-bold-header': 'minimalist',  // Was 'professional-red' (removed)
    'creative-bubble': 'minimalist',  // Was 'flux' (removed)
    'creative': 'minimalist',          // Was 'flux' (removed)
    'compact-sidebar': 'engineer',
    'compact-header': 'engineer',
    'corporate-sidebar': 'minimalist', // Was 'classic-sidebar' (COMPOSED, removed)
    'corporate-header': 'minimalist',  // Was 'professional' (removed)
    'technical-sidebar': 'engineer',
    'technical-header': 'engineer',
    'designer-sidebar': 'minimalist',  // Was 'canvas' (COMPOSED, removed)
    'designer-header': 'minimalist',   // Was 'flux' (removed)
    'creative-header': 'minimalist',   // Was 'flux' (removed)
    // Deleted Templates (Feb 2026) - Fallback to minimalist (Safe)
    'career-path': 'minimalist',
    'sidebar-pro': 'minimalist',
    'devops-system': 'minimalist',
    'executive-gold': 'minimalist',
    'studio-modern': 'minimalist',
    'professional-minimal': 'minimalist'
};

/**
 * Resolves the active template ID for a given (potentially legacy) ID.
 * 
 * @param {string} templateId - The ID stored in the user's resume data
 * @returns {string} - The active survivor ID to use for rendering
 */
export const migrateTemplateId = (templateId) => {
    if (!templateId) return 'minimalist'; // Default fallback

    const survivorId = LEGACY_TEMPLATE_MAP[templateId];
    if (survivorId) {
        console.warn(`[Template Migration] Legacy ID '${templateId}' migrated to '${survivorId}'`);
        return survivorId;
    }

    return templateId;
};

/**
 * Returns specific style overrides for legacy templates if needed.
 * This allows a survivor template to "mimic" the deleted one via config.
 * 
 * @param {string} originalId 
 * @returns {object} - Style or Config overrides
 */
export const getLegacyConfigOverrides = (originalId) => {
    switch (originalId) {
        case 'blue-clean':
            // Modern Clean is usually Green/Teal, Blue Clean forces Blue
            return { theme: 'blue' };
        case 'rose-minimal':
            return { theme: 'rose' };
        case 'compact':
            return { density: 'compact' };
        case 'green-modern':
            return { theme: 'emerald' };
        default:
            return {};
    }
};
