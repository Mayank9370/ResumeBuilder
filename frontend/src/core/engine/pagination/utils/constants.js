/**
 * Pagination Constants — SINGLE SOURCE OF TRUTH
 *
 * All A4 dimensions, page heights, and tolerances are defined HERE.
 * No other file should hardcode these values.
 *
 * Used by: All layout strategies, PaginationWrapper, usePagination, ResumePage, PDF export.
 */

// A4 dimensions at 96 DPI
// 297mm / 25.4 × 96 = 1122.519px → ceil to 1123 for safety
// 210mm / 25.4 × 96 = 793.701px → ceil to 794
export const A4_HEIGHT_PX = 1123;
export const A4_WIDTH_PX = 794;

// A4 in mm (for CSS)
export const A4_HEIGHT_MM = 297;
export const A4_WIDTH_MM = 210;

// Standard page padding (must match CSS variables in useFormattingContract)
// --resume-padding-safe-x = 2.5rem = 40px
// --resume-padding-safe-y = 1.5rem = 24px
export const PAGE_PADDING_X = 40;
export const PAGE_PADDING_Y = 24;

/**
 * Calculate available content dimensions for a page.
 * This accounts for page padding to ensure measure container matches actual page content area.
 *
 * @param {object} template - Optional template object with layoutTree.style for custom padding
 * @returns {{width: number, height: number}} Available content width and height in pixels
 */
export const getContentDimensions = (template) => {
  const buffer = template?.pagination?.buffer ?? DEFAULT_BUFFER;

  // Get template-specific padding from layoutTree.style
  let paddingX = PAGE_PADDING_X;
  let paddingY = PAGE_PADDING_Y;

  if (template?.layoutTree?.style?.padding) {
    const padding = template.layoutTree.style.padding;
    // Parse padding value (supports px, rem, em)
    if (typeof padding === "string") {
      if (padding.endsWith("px")) {
        paddingX = paddingY = parseFloat(padding);
      } else if (padding.endsWith("rem")) {
        const remValue = parseFloat(padding);
        if (!isNaN(remValue)) {
          paddingX = paddingY = remValue * 16; // Convert rem to px (assuming 16px base)
        }
      }
    }
  } else if (template?.css && template.css.includes("padding: 3rem")) {
    // Fallback for templates like Simple Essence that define padding via CSS class
    // rather than inline layoutTree styles. 3rem = 48px.
    paddingX = paddingY = 48;
  }

  // Check for individual padding overrides
  if (template?.layoutTree?.style?.paddingLeft) {
    paddingX =
      parseFloat(template.layoutTree.style.paddingLeft) || PAGE_PADDING_X;
  }
  if (template?.layoutTree?.style?.paddingRight) {
    paddingX =
      parseFloat(template.layoutTree.style.paddingRight) || PAGE_PADDING_X;
  }
  if (template?.layoutTree?.style?.paddingTop) {
    paddingY =
      parseFloat(template.layoutTree.style.paddingTop) || PAGE_PADDING_Y;
  }
  if (template?.layoutTree?.style?.paddingBottom) {
    paddingY =
      parseFloat(template.layoutTree.style.paddingBottom) || PAGE_PADDING_Y;
  }

  return {
    width: A4_WIDTH_PX - paddingX * 2,
    height: A4_HEIGHT_PX - paddingY * 2 - buffer,
  };
};

/**
 * Default safety buffer to prevent content from touching the absolute page edge.
 * 5px is a minimal buffer that prevents sub-pixel clipping while maximizing
 * usable content area. Templates handle their own internal padding (40-50px)
 * via CSS padding on the page container.
 *
 * NOTE: The previous 120px buffer was creating a ~10% dead zone on each page,
 * wasting space and causing premature page breaks. Reduced from 50 to 12 to
 * match usePagination.js's GLOBAL_SAFETY_BUFFER. The 40px CSS padding
 * (--resume-padding-safe-y) already prevents content from touching page edges.
 * The margin stacking mismatch (flex vs block) that previously required a large
 * buffer to mask phantom overflow is now resolved in DualColumnLayoutStrategy.jsx.
 * REVISION: Reduced to 24 to squeeze exactly one more line of usable text
 * into the bottom of the page based on user request.
 */
export const DEFAULT_BUFFER = 24;

/**
 * Calculate available content height for a page.
 * NOTE: This is kept for backward compatibility. For new code, use getContentDimensions().
 *
 * @param {object} template - Optional template object to override buffer
 * @returns {number} Available height in pixels
 */
export const getContentHeight = (template) => {
  const dims = getContentDimensions(template);
  return dims.height;
};

/**
 * Epsilon tolerance for floating-point comparisons.
 * Prevents micro-overflow from accumulated sub-pixel heights.
 */
export const EPSILON = 0.5; // px

/**
 * Tolerance threshold for page-break decisions.
 * Allow 2px of subpixel overflow before forcing a break.
 * Prevents infinite loops where 1123.1px triggers a break on a 1123px page.
 */
export const TOLERANCE_THRESHOLD = 2;
