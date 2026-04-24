/**
 * Font Loading Synchronization Utility
 * 
 * Ensures pagination measurements occur after fonts have loaded,
 * preventing height mismatch between fallback and actual fonts.
 */

/**
 * Waits for document fonts to be ready with a safety timeout.
 * 
 * @param {number} timeout - Maximum milliseconds to wait (default: 1000)
 * @returns {Promise<void>}
 */
/**
 * Waits for document fonts to be ready with a safety timeout.
 * 
 * @param {number} timeout - Maximum milliseconds to wait (default: 1500)
 * @returns {Promise<void>}
 */
export const waitForFonts = async (timeout = 1500) => {
    // Graceful degradation for browsers without Font Loading API
    if (!document.fonts) return;

    try {
        await Promise.race([
            document.fonts.ready,
            new Promise(resolve => setTimeout(() => {
                console.warn("[waitForFonts] Font loading timed out, proceeding with render.");
                resolve();
            }, timeout))
        ]);
    } catch (e) {
        console.warn("[waitForFonts] Error waiting for fonts", e);
        // Fail silently - never block pagination
    }
};
