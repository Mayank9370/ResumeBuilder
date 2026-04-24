/**
 * measurement.js
 * Utility for measuring DOM elements during pagination.
 * Recreated explicitly for paginateParticles and paginateDualColumn.
 */

/**
 * Returns the height and vertical margins of a DOM element.
 * @param {HTMLElement} element 
 * @returns {{height: number, mt: number, mb: number}}
 */
export const getElementStats = (element) => {
    if (!element) return { height: 0, mt: 0, mb: 0 };
    
    // Fallback if window is not defined (e.g., SSR)
    if (typeof window === 'undefined') {
        return { height: 0, mt: 0, mb: 0 };
    }

    const computedStyle = window.getComputedStyle(element);
    
    return {
        height: element.offsetHeight || 0,
        mt: parseFloat(computedStyle.marginTop) || 0,
        mb: parseFloat(computedStyle.marginBottom) || 0,
    };
};
