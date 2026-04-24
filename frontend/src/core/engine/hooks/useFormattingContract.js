import { useMemo } from 'react';
import { getContrastColor } from '@/modules/resume-builder/utils/contrastUtils';
import { getFontClass } from '@/shared/utils/fontUtils';

/**
 * useFormattingContract
 * 
 * Centralized hook to generate formatting CSS variables (Design Tokens) 
 * for consistent styling across all resume templates.
 * 
 * @param {Object} formatting - The formatting preferences from Redux state
 * @param {string} accentColor - The primary accent color
 * @returns {Object} standardizedStyles - CSS variables object
 */
const useFormattingContract = (formatting, accentColor = '#000000') => {
    return useMemo(() => {
        // 1. Normalize Inputs (Defaults)
        const fmt = {
            scale: formatting?.spacing_scale || 1.0,        // Overall Scale (Zoom/LineHeight)
            section_spacing: formatting?.section_spacing || 1.0,
            paragraph_spacing: formatting?.paragraph_spacing !== undefined ? formatting.paragraph_spacing : 0.5,
            header_spacing: formatting?.header_spacing !== undefined ? formatting.header_spacing : 1.0,
            heading_scale: formatting?.heading_scale || 1.0,
            subheading_scale: formatting?.subheading_scale || 1.0,
            body_scale: formatting?.body_scale || 1.0,
            font_family: getFontClass(formatting?.font_family)
        };

        // 2. Helper: Calculate REM values
        const calculateRem = (val, baseRem) => {
            return `${val * baseRem}rem`;
        };

        // 3. Generate CSS Variables
        const tokens = {
            // --- Architecture Tokens ---
            '--resume-scale': fmt.scale,
            '--resume-font-family': 'inherit', // Let root class drive font

            // --- Typography Tokens (Absolute REMs) ---
            '--resume-font-size-body': calculateRem(fmt.body_scale, 0.875),      // Base 14px
            '--resume-font-size-h1': calculateRem(fmt.heading_scale, 2.25),      // Base 36px
            '--resume-font-size-h2': calculateRem(fmt.heading_scale, 1.125),     // Base 18px (Section Title)
            '--resume-font-size-h3': calculateRem(fmt.subheading_scale, 1.0),    // Base 16px (Job Title)
            '--resume-font-size-h4': calculateRem(fmt.subheading_scale, 0.875),  // Base 14px (Meta/Date)

            // --- Spacing Tokens ---
            '--resume-spacing-section': calculateRem(fmt.section_spacing, 1.5),  // Base ~24px
            '--resume-spacing-header': calculateRem(fmt.header_spacing, 0.75),   // Base ~12px
            '--resume-spacing-paragraph': calculateRem(fmt.paragraph_spacing, 0.5), // Base ~8px
            '--resume-spacing-entry': '0.75rem',                                 // Fixed between entries

            // --- Line Height (Driven by Overall Scale) ---
            '--resume-line-height-body': fmt.scale * 1.5,

            // --- Color Tokens ---
            '--resume-color-accent': accentColor,
            '--resume-color-header': accentColor,
            '--resume-contrast-accent': getContrastColor(accentColor),
            
            // Standard Text Colors (Can be overridden by templates if needed)
            '--resume-color-title': '#1f2937', // gray-800
            '--resume-color-text': '#374151',  // gray-700
            '--resume-color-muted': '#6b7280', // gray-500

            // --- Safe Padding ---
            '--resume-padding-safe-x': '2.5rem',
            '--resume-padding-safe-y': '1.5rem',
        };

        return {
            tokens,
            fontClass: fmt.font_family,
            raw: fmt // Expose raw normalized values if needed for logic
        };
    }, [formatting, accentColor]);
};

export default useFormattingContract;
