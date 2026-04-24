import React from 'react';

/**
 * Universal Photo Renderer
 * Handles rendering of user profile photos with strict styling contracts.
 * 
 * Props:
 * - src: string (Base64 or URL)
 * - shape: 'CIRCLE' | 'SQUARE' | 'ROUNDED' (default: CIRCLE)
 * - size: string (Tailwind width/height classes, e.g., 'w-32 h-32')
 * - borderStyle: string (Tailwind border classes)
 * - className: string (Overrides)
 */
const PhotoRenderer = ({
    src,
    shape = 'CIRCLE',
    size = 'w-32 h-32',
    borderStyle = '',
    className = ''
}) => {
    const [hasError, setHasError] = React.useState(false);

    // 1. Safety Check
    if (!src || typeof src !== 'string' || src.length < 10 || hasError) {
        return null;
    }

    // 2. Shape Logic
    let shapeClass = 'rounded-full';
    if (shape === 'SQUARE') shapeClass = 'rounded-none';
    if (shape === 'ROUNDED') shapeClass = 'rounded-lg';

    // 3. Render
    return (
        <div className={`photo-container flex justify-center items-center mb-4 ${className}`}>
            <img
                src={src}
                alt="Profile"
                onError={() => setHasError(true)}
                className={`
                    ${size} 
                    ${shapeClass} 
                    ${borderStyle} 
                    object-cover 
                    shadow-sm
                    print:opacity-100
                `}
                style={{
                    backgroundColor: '#f3f4f6', // subtle gray background while loading
                }}
            />
        </div>
    );
};

export default PhotoRenderer;
