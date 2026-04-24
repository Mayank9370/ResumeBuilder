import { getContentDimensions, TOLERANCE_THRESHOLD } from '@/core/engine/pagination/utils/constants';
import { getElementStats } from '@/core/engine/pagination/utils/measurement';

/**
 * paginateDualColumn
 * 
 * Dual-column pagination engine. Paginates two independent column stacks
 * while sharing the same page-height boundary.
 * 
 * Architecture:
 * - Each column is paginated independently (own vertical cursor)
 * - Both columns share the same CONTENT_HEIGHT page limit
 * - Page advances when EITHER column overflows
 * - Returns pages with { left: { particles }, right: { particles } } regions
 * 
 * @param {RefObject} headerMeasureRef - Ref to the header measurement container
 * @param {RefObject} leftMeasureRef - Ref to the left column measurement container
 * @param {RefObject} rightMeasureRef - Ref to the right column measurement container
 * @param {Array} headerParticles - Particle blocks assigned to header
 * @param {Array} leftParticles - Particle blocks assigned to left column
 * @param {Array} rightParticles - Particle blocks assigned to right column
 * @param {Object} template - Template config for content dimensions
 * @returns {Array} Array of page objects with left/right regions
 */
export const paginateDualColumn = async (
  headerMeasureRef,
  leftMeasureRef,
  rightMeasureRef,
  headerParticles,
  leftParticles,
  rightParticles,
  template
) => {
  // --- Validate Inputs ---
  const hasLeft = leftMeasureRef?.current && leftParticles?.length > 0;
  const hasRight = rightMeasureRef?.current && rightParticles?.length > 0;
  const hasHeader = headerMeasureRef?.current && headerParticles?.length > 0;

  if (!hasLeft && !hasRight && !hasHeader) {
    console.warn('[paginateDualColumn] No content in columns or header.');
    return [];
  }

  const { height: CONTENT_HEIGHT } = getContentDimensions(template);

  // --- Measure all children ---
  const leftChildren = hasLeft ? Array.from(leftMeasureRef.current.children) : [];
  const rightChildren = hasRight ? Array.from(rightMeasureRef.current.children) : [];

  // Validate child/particle count match
  if (hasLeft && leftChildren.length !== leftParticles.length) {
    console.warn(
      `[paginateDualColumn] Left mismatch: Children ${leftChildren.length} vs Particles ${leftParticles.length}. Retrying.`
    );
    return [];
  }
  if (hasRight && rightChildren.length !== rightParticles.length) {
    console.warn(
      `[paginateDualColumn] Right mismatch: Children ${rightChildren.length} vs Particles ${rightParticles.length}. Retrying.`
    );
    return [];
  }

  // --- Section Height Cache ---
  // Pre-measure all elements to avoid repeated DOM reads
  let firstPageOffset = 0;
  const headerChildren = hasHeader ? Array.from(headerMeasureRef.current.children) : [];
  if (headerChildren.length > 0) {
    const headerStats = getElementStats(headerChildren[0]);
    // Include full layout box (height + margins) as the offset for columns
    firstPageOffset = headerStats.height + headerStats.mt + headerStats.mb;
    console.log(`[paginateDualColumn] First page header offset calculated: ${firstPageOffset}px`);
  }

  const leftStats = leftChildren.map(child => getElementStats(child));
  const rightStats = rightChildren.map(child => getElementStats(child));

  console.log(
    `[paginateDualColumn] Starting pagination | Left: ${leftParticles.length} particles | Right: ${rightParticles.length} particles | PageHeight: ${CONTENT_HEIGHT}px`
  );

  // --- Paginate both columns simultaneously ---
  const pages = [];
  let leftIdx = 0;
  let rightIdx = 0;

  // The loop must run at least once if there's a header, even if left and right columns are completely empty.
  while (
    leftIdx < leftParticles.length || 
    rightIdx < rightParticles.length || 
    (pages.length === 0 && hasHeader) 
  ) {
    const pageNumber = pages.length + 1;
    const leftPageParticles = [];
    const rightPageParticles = [];
    
    // Start measuring from the offset on the first page
    let leftBottom = pageNumber === 1 ? firstPageOffset : 0;
    let rightBottom = pageNumber === 1 ? firstPageOffset : 0;
    
    let leftPrevMb = 0;
    let rightPrevMb = 0;

    // --- Check if remaining space is too small for BOTH columns ---
    // If the space is extremely small (< 20px), we shouldn't attempt to put any NEW items there.
    // We only enforce this if at least one column already has content on this page.
    const isLeftFirst = leftPageParticles.length === 0;
    const isRightFirst = rightPageParticles.length === 0;
    const leftRemaining = CONTENT_HEIGHT - leftBottom;
    const rightRemaining = CONTENT_HEIGHT - rightBottom;

    let forceBreakLeft = !isLeftFirst && leftRemaining < (20 - TOLERANCE_THRESHOLD);
    let forceBreakRight = !isRightFirst && rightRemaining < (20 - TOLERANCE_THRESHOLD);

    // Continue filling until both columns are either out of particles or have hit a break condition
    let leftDoneForPage = leftIdx >= leftParticles.length || forceBreakLeft;
    let rightDoneForPage = rightIdx >= rightParticles.length || forceBreakRight;

    while (!leftDoneForPage || !rightDoneForPage) {
      
      // --- Process Left Column Next Item ---
      if (!leftDoneForPage) {
        const stats = leftStats[leftIdx];
        const block = leftParticles[leftIdx];
        const isFirst = leftPageParticles.length === 0;
        const gap = isFirst ? 0 : Math.max(leftPrevMb, stats.mt);
        const proposedBottom = leftBottom + gap + stats.height;

        if (!isFirst && proposedBottom >= CONTENT_HEIGHT - TOLERANCE_THRESHOLD) {
          console.log(`[paginateDualColumn] Left col | Page ${pageNumber} | Section overflow at ${proposedBottom.toFixed(1)}px (limit: ${CONTENT_HEIGHT}px)`);
          leftDoneForPage = true;
        } else {
          leftPageParticles.push(block);
          leftBottom = proposedBottom;
          leftPrevMb = stats.mb;
          leftIdx++;
          
          // Re-evaluate force break for *next* item
          if (leftIdx >= leftParticles.length) {
             leftDoneForPage = true;
          } else if ((CONTENT_HEIGHT - leftBottom) < (20 - TOLERANCE_THRESHOLD)) {
             leftDoneForPage = true;
          }
        }
      }

      // --- Process Right Column Next Item ---
      if (!rightDoneForPage) {
        const stats = rightStats[rightIdx];
        const block = rightParticles[rightIdx];
        const isFirst = rightPageParticles.length === 0;
        const gap = isFirst ? 0 : Math.max(rightPrevMb, stats.mt);
        const proposedBottom = rightBottom + gap + stats.height;

        if (!isFirst && proposedBottom >= CONTENT_HEIGHT - TOLERANCE_THRESHOLD) {
          console.log(`[paginateDualColumn] Right col | Page ${pageNumber} | Section overflow at ${proposedBottom.toFixed(1)}px (limit: ${CONTENT_HEIGHT}px)`);
          rightDoneForPage = true;
        } else {
          rightPageParticles.push(block);
          rightBottom = proposedBottom;
          rightPrevMb = stats.mb;
          rightIdx++;

          // Re-evaluate force break for *next* item
          if (rightIdx >= rightParticles.length) {
             rightDoneForPage = true;
          } else if ((CONTENT_HEIGHT - rightBottom) < (20 - TOLERANCE_THRESHOLD)) {
             rightDoneForPage = true;
          }
        }
      }
    }

    // --- Only add page if at least one column has content OR if it's the first page with a header ---
    if (leftPageParticles.length > 0 || rightPageParticles.length > 0 || (pageNumber === 1 && hasHeader)) {
      console.log(
        `[paginateDualColumn] Page ${pageNumber} | Left: ${leftPageParticles.length} particles (${leftBottom.toFixed(0)}px) | Right: ${rightPageParticles.length} particles (${rightBottom.toFixed(0)}px)`
      );

      pages.push({
        pageNumber,
        regions: {
          left: { particles: leftPageParticles },
          right: { particles: rightPageParticles },
        },
      });
    } else {
      // Safety: prevent infinite loop if both columns produce zero particles
      console.error('[paginateDualColumn] CRITICAL: Zero particles produced for page. Breaking to prevent infinite loop.');
      break;
    }
  }

  console.log(`[paginateDualColumn] Pagination complete | Total pages: ${pages.length}`);
  return pages;
};

export default paginateDualColumn;
