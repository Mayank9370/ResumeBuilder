import { useState, useEffect, useRef } from 'react';

/**
 * useStableImage
 * 
 * A centralized hook to manage Blob URL lifecycles.
 * - Accepts: File | Blob | string (URL) | null
 * - Returns: A stable string URL to be used in <img> tags.
 * 
 * GUARANTEES:
 * 1. Creates a Blob URL only when the source object identity changes.
 * 2. Revokes the *previous* Blob URL immediately upon replacement to prevent leaks.
 * 3. Revokes the *current* Blob URL upon component unmount.
 * 4. Returns legitimate strings (http/https/data) as-is without alteration.
 * 
 * @param {File | Blob | string | null} source - The image source.
 * @returns {string | null} - The stable URL for display.
 */
export const useStableImage = (source) => {
    const [stableUrl, setStableUrl] = useState(null);

    // We keep track of the object URL we created so we can revoke it later.
    const activeBlobUrlRef = useRef(null);

    useEffect(() => {
        // 1. Handle Null/Undefined
        if (!source) {
            if (activeBlobUrlRef.current) {
                URL.revokeObjectURL(activeBlobUrlRef.current);
                activeBlobUrlRef.current = null;
            }
            setStableUrl(null);
            return;
        }

        // 2. Handle String (Already a URL)
        if (typeof source === 'string') {
            // If we were holding a blob, release it because we Switched to a string
            if (activeBlobUrlRef.current) {
                URL.revokeObjectURL(activeBlobUrlRef.current);
                activeBlobUrlRef.current = null;
            }
            setStableUrl(source);
            return;
        }

        // 3. Handle File/Blob (Create new URL)
        if (source instanceof File || source instanceof Blob) {
            // Revoke previous BEFORE creating new one (Strict Cleanup)
            if (activeBlobUrlRef.current) {
                URL.revokeObjectURL(activeBlobUrlRef.current);
            }

            const newUrl = URL.createObjectURL(source);
            activeBlobUrlRef.current = newUrl;
            setStableUrl(newUrl);
            return;
        }

        // 4. Fallback (Unknown type)
        console.warn('useStableImage: Unknown source type', source);
        setStableUrl(null);

    }, [source]); // Only re-run if the SOURCE IDENTITY changes.

    // Cleanup on unmount (Final Revocation)
    useEffect(() => {
        return () => {
            if (activeBlobUrlRef.current) {
                URL.revokeObjectURL(activeBlobUrlRef.current);
                activeBlobUrlRef.current = null;
            }
        };
    }, []);

    return stableUrl;
};
