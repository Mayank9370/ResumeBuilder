import React from 'react';
import ParticleRenderer from '@/core/engine/components/ParticleRenderer';
import { A4_HEIGHT_PX, A4_WIDTH_PX } from '@/core/engine/pagination/utils/constants';

const ResumePage = ({
    page,
    styles,
    pageIndex,
    totalPageCount,
    onUpdate,
    onSectionClick,
    mode,
    id,
    fontClass
}) => {
    const particles = page?.regions?.main?.particles || [];

    const pageStyle = {
        width: `${A4_WIDTH_PX}px`,
        height: `${A4_HEIGHT_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
    };

    return (
        <div
            id={id}
            className={`resume-page mx-auto overflow-hidden text-left origin-top mb-10 ${fontClass || ''} ${styles.container?.replace(/min-h-\[[^\]]+\]/, '') || 'bg-white shadow-2xl p-10'}`}
            style={pageStyle}
        >
            {particles.map((block, i) => (
                <ParticleRenderer
                    key={block.key || `${pageIndex}-${i}`}
                    block={block}
                    styles={styles}
                    onUpdate={onUpdate}
                    onSectionClick={onSectionClick}
                    mode={mode}
                    isFirst={i === 0}
                />
            ))}

            <div className="absolute bottom-2 right-4 text-[10px] text-gray-400 pointer-events-none opacity-50">
                Page {pageIndex + 1} of {totalPageCount}
            </div>
        </div>
    );
};
export default ResumePage;