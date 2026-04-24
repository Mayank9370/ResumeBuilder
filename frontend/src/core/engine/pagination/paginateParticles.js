import { getContentDimensions, TOLERANCE_THRESHOLD } from '@/core/engine/pagination/utils/constants';
import { getElementStats } from '@/core/engine/pagination/utils/measurement';

export const paginateParticles = async (measureRef, particles, template) => {
  if (!measureRef?.current || !particles?.length) {
    return [];
  }

  // Get content dimensions (accounts for page padding)
  const { width: CONTENT_WIDTH, height: CONTENT_HEIGHT } = getContentDimensions(template);
  const children = Array.from(measureRef.current.children);

  if (children.length !== particles.length) {
    console.warn(
      `[paginateParticles] Mismatch: Children ${children.length} vs Particles ${particles.length}. Retrying next cycle.`
    );
    return [];
  }

  const newPages = [];
  let currentPageParticles = [];
  let currentContentBottom = 0;
  let previousMarginBottom = 0;

  const measureSectionGroup = (startIdx) => {
    let total = 0;
    let prevMb = 0;
    let count = 0;
    for (let j = startIdx; j < children.length; j++) {
      const p = particles[j];
      if (j > startIdx && p.type === 'section_title') break;
      const s = getElementStats(children[j]);
      const gap = count === 0 ? 0 : Math.max(prevMb, s.mt);
      total += gap + s.height;
      prevMb = s.mb;
      count++;
    }
    return total;
  };

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const block = particles[i];
    const stats = getElementStats(child);

    const isFirstOnPage = currentPageParticles.length === 0;
    const gap = isFirstOnPage ? 0 : Math.max(previousMarginBottom, stats.mt);
    const proposedBottom = currentContentBottom + gap + stats.height;

    let mustForceBreak = false;

    const currentRemaining = CONTENT_HEIGHT - currentContentBottom;
    if (!isFirstOnPage && currentRemaining < 20 - TOLERANCE_THRESHOLD) {
      mustForceBreak = true;
    }

    // User requested normal text continuous flow: removed section_title and keepWithNext artificial breaks.

    if (mustForceBreak || proposedBottom >= CONTENT_HEIGHT - TOLERANCE_THRESHOLD) {
      newPages.push({
        pageNumber: newPages.length + 1,
        regions: {
          main: { particles: currentPageParticles },
        },
      });
      currentPageParticles = [block];
      currentContentBottom = stats.height;
      previousMarginBottom = stats.mb;
    } else {
      currentPageParticles.push(block);
      currentContentBottom = proposedBottom;
      previousMarginBottom = stats.mb;
    }
  }

  if (currentPageParticles.length > 0) {
    newPages.push({
      pageNumber: newPages.length + 1,
      regions: {
        main: { particles: currentPageParticles },
      },
    });
  }

  return newPages;
};

export default paginateParticles;
