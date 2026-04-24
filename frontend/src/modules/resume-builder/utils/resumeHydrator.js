import { migrateTemplateId } from '@/modules/resume-builder/utils/templateMigration';

/**
 * Helper: Hydrate and Clean Parsed Data (Fixes JSON Strings & ID missing)
 * Extracted from ResumeBuilder.jsx for shared usage and stability.
 */
export const hydrateParsedData = (resume) => {
    if (!resume) return resume;

    const cleanResume = { ...resume };

    // 1. Ensure Defaults for Root Fields
    if (!cleanResume.template) cleanResume.template = "minimalist";
    
    // Safety: Migrate legacy/deleted templates to survivors
    cleanResume.template = migrateTemplateId(cleanResume.template);
    if (!cleanResume.accent_color) cleanResume.accent_color = "#2563EB";

    // Ensure Formatting Defaults (Preserve UI state)
    cleanResume.formatting = {
        spacing_scale: 1.0,
        section_spacing: 1.0,
        paragraph_spacing: 0.5,
        header_spacing: 1.0,
        heading_scale: 1.0,
        subheading_scale: 1.0,
        body_scale: 1.0,
        font_family: 'Inter',
        ...cleanResume.formatting // Overlay existing values if any
    };

    // 2. Ensure Sections Array
    if (!Array.isArray(cleanResume.sections)) {
        cleanResume.sections = [];
    }

    cleanResume.sections = cleanResume.sections.map(section => {
        let cleanData = section.data;

        // A. Parse JSON Strings (Common AI Parser Artifact)
        if (typeof cleanData === 'string' && (cleanData.trim().startsWith('[') || cleanData.trim().startsWith('{'))) {
            try { cleanData = JSON.parse(cleanData); } catch (e) { console.warn("Hydration Parse Error", e); }
        }

        // B. Section-Specific Cleaning
        if (section.id === 'skills' || section.type === 'skills') {
            // Flatten skills to strings if they are objects
            if (Array.isArray(cleanData)) {
                cleanData = cleanData.map(item => {
                    if (typeof item === 'object' && item !== null) return item.name || item.label || item.value || JSON.stringify(item);
                    return item;
                }).filter(Boolean);
            }
        }
        else if (['experience', 'projects', 'education', 'certifications'].includes(section.id)) {
            if (Array.isArray(cleanData)) {
                cleanData = cleanData.map(item => {
                    // Ensure unique ID for Drag-and-Drop
                    const newItem = { ...item };
                    if (!newItem.id) newItem.id = `hydrated-${Math.random().toString(36).substr(2, 9)}`;

                    // Clean Description (Parse if stringified array)
                    if (typeof newItem.description === 'string' && newItem.description.trim().startsWith('[')) {
                        try { newItem.description = JSON.parse(newItem.description); } catch (e) { }
                    }

                    // Certifications specific: Map keys
                    if (section.id === 'certifications') {
                        if (!newItem.name && newItem.title) newItem.name = newItem.title;
                        if (!newItem.name && newItem.label) newItem.name = newItem.label;
                    }

                    return newItem;
                });
            }
        }

        return {
            ...section,
            data: cleanData
        };
    });

    return cleanResume;
};
