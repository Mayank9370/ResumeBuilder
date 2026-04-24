/**
 * Contrast Utility
 * Automatically calculates the best text color (black or white) for a given background color.
 * Uses YIQ formula for perceptual brightness.
 * 
 * Phase 4: Added runtime background detection for nested layouts
 */

/**
 * Converts hex color to RGB
 * @param {string} hex - Hex color code (e.g., "#ffffff" or "#fff")
 * @returns {object|null} - {r, g, b} or null if invalid
 */
function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return null;
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle shorthand hex (#fff)
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    if (hex.length !== 6) return null;
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    
    return { r, g, b };
}

/**
 * Parses RGB/RGBA color string
 * @param {string} rgbString - RGB color string (e.g., "rgb(255, 0, 0)")
 * @returns {object|null} - {r, g, b} or null if invalid
 */
function parseRgb(rgbString) {
    if (!rgbString || typeof rgbString !== 'string') return null;
    
    const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    
    return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10)
    };
}

/**
 * Calculate YIQ brightness value (0-255)
 * @param {object} rgb - {r, g, b}
 * @returns {number} - Brightness value
 */
function getYIQ(rgb) {
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

/**
 * Determine if a color is dark
 * @param {string} hexColor - Hex color code
 * @returns {boolean} - True if color is dark
 */
export function isDarkColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return false;
    
    const yiq = getYIQ(rgb);
    return yiq < 128;
}

/**
 * Get contrasting text color (black or white) for a given background
 * @param {string} backgroundColor - Hex, RGB, or RGBA color
 * @returns {string} - "#000000" or "#ffffff"
 */
export function getContrastColor(backgroundColor) {
    if (!backgroundColor || backgroundColor === 'transparent' || backgroundColor === 'none') {
        return '#000000'; // Default to black for transparent/undefined
    }
    
    let rgb;
    
    // Try parsing as hex first
    if (backgroundColor.startsWith('#')) {
        rgb = hexToRgb(backgroundColor);
    } 
    // Try parsing as rgb/rgba
    else if (backgroundColor.startsWith('rgb')) {
        rgb = parseRgb(backgroundColor);
    }
    
    if (!rgb) {
        // Fallback for invalid colors
        return '#000000';
    }
    
    const yiq = getYIQ(rgb);
    
    // YIQ threshold: < 128 is dark, >= 128 is light
    return yiq >= 128 ? '#000000' : '#ffffff';
}

/**
 * Runtime Background Detection - NEW for Phase 4
 * Resolves the nearest ancestor background color by walking up the DOM
 * @param {HTMLElement} element - Starting element (can be null for server-side)
 * @returns {string|null} - Background color or null if not found
 */
export function resolveEffectiveBackground(element) {
    // Server-side or initial render - return null
    if (typeof window === 'undefined' || !element) {
        return null;
    }
    
    let currentElement = element;
    let maxDepth = 20; // Prevent infinite loops
    let depth = 0;
    
    while (currentElement && depth < maxDepth) {
        const computed = window.getComputedStyle(currentElement);
        const bgColor = computed.backgroundColor;
        
        // Skip transparent backgrounds
        if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
            return bgColor;
        }
        
        // Move to parent
        currentElement = currentElement.parentElement;
        depth++;
    }
    
    // Fallback: assume white background
    return '#ffffff';
}

/**
 * Get contrast-safe text color for an element (runtime)
 * Uses nearest ancestor background for accurate contrast
 * @param {HTMLElement} element - Element to get text color for
 * @param {string} fallbackBg - Fallback background if detection fails
 * @returns {string} - Contrast color
 */
export function getContrastColorForElement(element, fallbackBg = '#ffffff') {
    const effectiveBg = resolveEffectiveBackground(element) || fallbackBg;
    return getContrastColor(effectiveBg);
}

/**
 * Adjust color brightness
 * @param {string} hexColor - Hex color code
 * @param {number} percent - Percentage to lighten (positive) or darken (negative)
 * @returns {string} - Adjusted hex color
 */
export function adjustColorBrightness(hexColor, percent) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return hexColor;
    
    const adjust = (value) => {
        const newValue = Math.round(value + (value * percent / 100));
        return Math.max(0, Math.min(255, newValue));
    };
    
    const r = adjust(rgb.r).toString(16).padStart(2, '0');
    const g = adjust(rgb.g).toString(16).padStart(2, '0');
    const b = adjust(rgb.b).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
}
