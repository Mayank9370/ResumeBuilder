/**
 * 🎯 PHASE 3: Development-Only Logging Utilities
 * 
 * Provides detailed diagnostics for pagination, measurements, and performance
 * WITHOUT polluting production console
 */

// Check if running in development mode
const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV;

/**
 * Log pagination metrics (dev-only)
 * @param {string} action - Action being performed
 * @param {Object} metrics - Metrics object
 */
export const logPaginationMetrics = (action, metrics) => {
  if (!isDevelopment) return;
  
  console.group(`[PAGINATION METRICS] ${action}`);
  if (metrics.sectionCount !== undefined) {
    console.log('📊 Sections:', metrics.sectionCount);
  }
  if (metrics.pageCount !== undefined) {
    console.log('📄 Pages:', metrics.pageCount);
  }
  if (metrics.duration !== undefined) {
    console.log('⏱️ Duration:', `${metrics.duration}ms`);
  }
  if (metrics.cacheHits !== undefined) {
    console.log('💾 Cache Hits:', metrics.cacheHits);
  }
  if (metrics.reflowCount !== undefined) {
    console.log('🔄 Reflow Count:', metrics.reflowCount);
  }
  console.groupEnd();
};

/**
 * Log overflow events (dev-only)
 * @param {string} sectionId - Section that overflowed
 * @param {Object} details - Overflow details
 */
export const logOverflowEvent = (sectionId, details) => {
  if (!isDevelopment) return;
  
  console.warn(
    `[OVERFLOW] Section "${sectionId}" exceeded limit`,
    {
      height: details.height,
      limit: details.limit,
      overflow: details.overflow,
      action: details.action
    }
  );
};

/**
 * Log measurement timing (dev-only)
 * @param {string} label - Measurement label
 * @param {Function} fn - Function to time
 * @returns {*} Function result
 */
export const measurePerformance = async (label, fn) => {
  if (!isDevelopment) {
    return await fn();
  }
  
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`);
  
  return result;
};

/**
 * Log layout stability check (dev-only)
 * @param {string} stage - Stage of stability check
 * @param {Object} state - Current state
 */
export const logLayoutStability = (stage, state) => {
  if (!isDevelopment) return;
  
  const emoji = stage === 'started' ? '🔍' : stage === 'fonts-ready' ? '🔤' : stage === 'images-ready' ? '🖼️' : '✅';
  console.log(`[LAYOUT STABILITY] ${emoji} ${stage}`, state);
};

/**
 * Log cache operations (dev-only)
 * @param {string} operation - Operation performed
 * @param {Object} data - Cache data
 */
export const logCacheOperation = (operation, data) => {
  if (!isDevelopment) return;
  
  const action = operation === 'hit' ? '✅ Hit' : operation === 'miss' ? '❌ Miss' : '🗑️ Invalidate';
  console.log(`[CACHE] ${action}`, data);
};

/**
 * Log reflow guard trigger (dev-only)
 * @param {number} count - Current reflow count
 * @param {number} max - Maximum allowed
 */
export const logReflowGuard = (count, max) => {
  if (!isDevelopment) return;
  
  if (count >= max) {
    console.error(
      `[REFLOW GUARD] ⚠️ Maximum iterations (${max}) reached. Stopping to prevent infinite loop.`
    );
  } else if (count > max / 2) {
    console.warn(
      `[REFLOW GUARD] ⚡ Approaching limit (${count}/${max})`
    );
  }
};

/**
 * Create performance monitor
 * @returns {Object} Monitor object with start/end methods
 */
export const createPerformanceMonitor = (label) => {
  if (!isDevelopment) {
    return { start: () => {}, end: () => {} };
  }
  
  let startTime = null;
  
  return {
    start() {
      startTime = performance.now();
      console.time(`[MONITOR] ${label}`);
    },
    end() {
      if (startTime) {
        const duration = performance.now() - startTime;
        console.timeEnd(`[MONITOR] ${label}`);
        return duration;
      }
      return 0;
    }
  };
};

/**
 * Log section fit check decision (dev-only)
 * @param {string} sectionId - Section ID
 * @param {Object} decision - Fit check decision details
 */
export const logSectionFitCheck = (sectionId, decision) => {
  if (!isDevelopment) return;
  
  const { remainingSpace, sectionHeight, moved, targetPage } = decision;
  
  if (moved) {
    console.log(
      `[FIT CHECK] 📦➡️📄 Moved "${sectionId}" to Page ${targetPage}`,
      { remainingSpace, sectionHeight }
    );
  }
};
