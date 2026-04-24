/**
 * @file templates.js
 * @description PURE V12 UI REGISTRY | SINGLE TRUTH
 * This file provides the metadata and preview assets for the Template Gallery.
 * It is derived SOLELY from the Generated Registry.
 */

import { GENERATED_REGISTRY } from '@/modules/resume-builder/constants/registry.generated';

// 1. Dynamic Import of V12 Preview Assets
const generatedPreviews = import.meta.glob('@/modules/templates/**/assets/preview.png', { eager: true, import: 'default' });

// 2. Map Registry to UI Model (Metadata + Image)
const filteredTemplates = (GENERATED_REGISTRY || [])
    .filter(gen => gen.layoutStrategy === "LINEAR" || gen.layoutStrategy === "DUAL_COLUMN");

const linearTemplates = filteredTemplates.filter(t => t.layoutStrategy === "LINEAR");
const dualTemplates = filteredTemplates.filter(t => t.layoutStrategy === "DUAL_COLUMN");

const mixedTemplates = [];
const maxLength = Math.max(linearTemplates.length, dualTemplates.length);
for (let i = 0; i < maxLength; i++) {
    if (linearTemplates[i]) mixedTemplates.push(linearTemplates[i]);
    if (dualTemplates[i]) mixedTemplates.push(dualTemplates[i]);
}

const mappedTemplates = mixedTemplates.map(gen => {
    const folder = gen.__folder;
    const expectedSuffix = `/${folder}/assets/preview.png`;
    const key = Object.keys(generatedPreviews).find(k => k.endsWith(expectedSuffix));
    const image = key ? generatedPreviews[key]?.default || generatedPreviews[key] : null;

    if (!image) {
        console.warn(`[V12 UI] Missing Preview Image for '${gen.id}'`);
    }

    return {
        id: gen.id,
        name: gen.name,
        // UI expects 'preview' for the hover description. 
        // We use description from manifest, or fallback.
        preview: gen.description || `${gen.name} template.`,
        tags: gen.tags || [],
        color: "bg-gray-50", // V12 TODO: Move color to manifest if dynamic theming needed in Gallery
        image: image,

        // Pass through other props
        ...gen
    };
});

// 3. Export
export const templates = mappedTemplates;
