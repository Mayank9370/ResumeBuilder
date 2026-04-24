/**
 * @file resumeTemplates.js
 * @description PURE V12 RUNTIME | LAZY LOADING | SINGLE TRUTH
 * This file is the authoritative loader for Resume Template Logic.
 * It uses Lazy Loading to support 100+ templates without bundle bloat.
 * 
 * ARCHITECTURE:
 * - SOURCE: ../templates/\u002A\u002A/index.jsx (Logic Modules via Lazy Import)
 * - REGISTRY: registry.generated.js (Metadata Validation & Sync Access)
 * - RUNTIME: Async resolution via loadTemplate(id)
 */

import { GENERATED_REGISTRY } from '@/modules/resume-builder/constants/registry.generated';
// REMOVED: validateTemplatesOnLoad (Cannot validate lazy modules synchronously on startup)
// Validation is now a build-time or test-time concern, or on-demand.

// 1. LAZY LOGIC IMPORT (SOURCE OF TRUTH)
// Key: relative path
// Value: () => import(...)
const lazyLogic = import.meta.glob('@/modules/templates/**/index.jsx', { eager: false, import: 'default' });

/**
 * Synchronous lookup for Registry Metadata
 * @param {string} id 
 */
export const getRegisteredTemplate = (id) => {
    return GENERATED_REGISTRY.find(t => t.id === id);
};

/**
 * Get all registered template metadata
 */
export const getRegisteredTemplates = () => {
    return GENERATED_REGISTRY;
};

/**
 * Async Loader for Template Logic
 * @param {string} id 
 * @returns {Promise<Object>} The Template Logic Module
 */
export const loadTemplate = async (id) => {
    // 1. Find in Registry
    const registryEntry = getRegisteredTemplate(id);
    if (!registryEntry) {
        throw new Error(`Template '${id}' not found in V12 Registry.`);
    }

    // 2. Resolve Path
    const folder = registryEntry.__folder;
    const expectedSuffix = `/${folder}/index.jsx`;
    const key = Object.keys(lazyLogic).find(k => k.endsWith(expectedSuffix));
    const loader = key ? lazyLogic[key] : null;

    if (!loader) {
        throw new Error(`Logic Module not found for '${id}' at ${key}`);
    }

    // 3. Load & Return
    try {
        const module = await loader();
        // Merge Logic with Registry Metadata for runtime completeness
        return {
            ...registryEntry, // Metadata (Name, preview, caps)
            ...module,         // Logic (Styles, functions, detailed caps)
            // Ensure ID match
            id: id
        };
    } catch (e) {
        console.error(`[V12 LOAD ERROR] Failed to load template '${id}':`, e);
        throw e;
    }
};

// PRESERVE LEGACY EXPORT SHAPE (BUT WITH WARNING/ERROR IF USED DIRECTLY)
// For backward compatibility during refactor, we CANNOT export 'resumeTemplates' object easily.
// Any consumer using `resumeTemplates[id]` will break.
// We must migrate consumers to `loadTemplate(id)`.
// We will NOT export `resumeTemplates` map anymore to force the break and fix.

/**
 * Helper: Mix Simple & Creative templates for better visual balance
 * @param {Array} list - Array of template objects
 * @returns {Array} Mixed array
 */
export const mixTemplates = (list) => {
    if (!Array.isArray(list)) return [];
    
    const simpleKeywords = ['minimal', 'simple', 'clean', 'professional', 'classic', 'standard', 'ats', 'executive'];
    const simple = [];
    const creative = [];

    list.forEach(t => {
        const tags = (t.tags || []).map(tag => tag.toLowerCase());
        // Check tags OR family if available
        const isSimple = tags.some(tag => simpleKeywords.includes(tag)) || 
                         (t.family && ['MINIMAL', 'PROFESSIONAL', 'CLASSIC'].includes(t.family));
        
        if (isSimple) {
            simple.push(t);
        } else {
            creative.push(t);
        }
    });

    const mixed = [];
    const maxLength = Math.max(simple.length, creative.length);
    
    for (let i = 0; i < maxLength; i++) {
        // Pattern: Creative -> Simple -> Creative -> Simple
        if (creative[i]) mixed.push(creative[i]);
        if (simple[i]) mixed.push(simple[i]);
    }
    return mixed;
};
