import React, { useEffect } from 'react';
import { FONTS } from '@/shared/utils/fontUtils';

const FontLoader = ({ fontFamily }) => {
    useEffect(() => {
        if (!fontFamily) return;

        // 1. RESOLVE ACTUAL FONT NAME
        // Map "font-inter" -> "Inter" using config or fallback
        let fontName = fontFamily;
        const fontConfig = FONTS.find(f => f.value === fontFamily || f.name === fontFamily);
        
        if (fontConfig) {
            fontName = fontConfig.name;
        } else if (fontName.startsWith('font-')) {
             fontName = fontName.replace('font-', '');
             fontName = fontName.charAt(0).toUpperCase() + fontName.slice(1);
        }

        const formattedFontName = fontName.replace(/['"]/g, '').trim();

        // 2. LOAD FONT (Google Fonts)
        // Skip system fonts
        const isSystemFont = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'ui-sans-serif', 'system-ui', 'sans-serif', 'serif', 'monospace'].includes(formattedFontName);
        
        if (!isSystemFont) {
            const linkId = `google-font-${formattedFontName.replace(/\s+/g, '-')}`;
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${formattedFontName.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
                document.head.appendChild(link);
                console.log(`[FontLoader] Loaded: ${formattedFontName}`);
            }
        }

        // 3. APPLY FONT (Visual Update)
        // Force the resume-page to use this font.
        // This fixes the issue where Tailwind classes (font-inter) might not apply correctly 
        // or if the font name mismatch prevented the browser from rendering only with the class.
        const styleId = 'resume-dynamic-font-style';
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        const safeFontName = fontName.includes(' ') ? `"${fontName}"` : fontName;
        // Inject rule to override/enforce font on the resume container
        styleTag.innerHTML = `
            .resume-page, .resume-page * {
                font-family: ${safeFontName}, sans-serif !important;
            }
            /* Preserve icon fonts if needed */
            .resume-page i, .resume-page svg {
                font-family: initial !important;
            }
        `;
        
    }, [fontFamily]);

    return null; // Logic only
};

export default FontLoader;
