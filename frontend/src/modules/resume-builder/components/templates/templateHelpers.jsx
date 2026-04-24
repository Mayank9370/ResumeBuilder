/**
 * Helper functions for template rendering
 */

/**
 * Sanitizes and prepares HTML content for rendering
 * @param {string} content - Raw HTML content
 * @returns {string} - Sanitized HTML string
 */
export const renderHTML = (content) => {
  if (!content) return "";
  if (typeof content !== "string") return String(content);
  return content;
};
/**
 * Component to render HTML content safely
 */
export const renderHTMLWithPagination = (content, sectionId, itemIndex) => {
  if (!content || typeof content !== "string") return renderHTML(content);

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Find all block-level elements that should be paginated individually
    const targets = doc.body.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote, div:not(:has(*))');

    if (targets.length === 0 && doc.body.textContent.trim()) {
      // If it's just plain text or inline elements without blocks, wrap it
      return `<div data-pagination-item="true" data-section-id="${sectionId || ''}" data-item-index="${itemIndex ?? ''}">${content}</div>`;
    }

    targets.forEach((el, i) => {
      el.setAttribute('data-pagination-item', 'true');
      if (sectionId) el.setAttribute('data-section-id', sectionId);
      if (itemIndex !== undefined) el.setAttribute('data-item-index', itemIndex);
      // Add sub-index to maintain deterministic order if broken across pages
      el.setAttribute('data-sub-item-index', String(i));
    });

    return doc.body.innerHTML;
  } catch (e) {
    console.warn("Failed to inject pagination attributes", e);
    return content;
  }
};

/**
 * Parses HTML and removes nodes that belong to other pages.
 * Used during the Render Pass to prevent innerHTML content from overlapping boundaries.
 */
export const filterHTMLForPagination = (content, sectionId, itemIndex, pageIndex, itemMap) => {
  if (!content || typeof content !== "string" || !itemMap) return renderHTMLWithPagination(content, sectionId, itemIndex);

  try {
    // First, ensure the content has full tracking attributes injected
    const markedContent = renderHTMLWithPagination(content, sectionId, itemIndex);

    // Parse the marked content
    const parser = new DOMParser();
    const doc = parser.parseFromString(markedContent, 'text/html');

    // Find all internally tracked nodes
    const trackedNodes = doc.body.querySelectorAll('[data-pagination-item="true"]');

    trackedNodes.forEach(node => {
      const subIdx = node.getAttribute("data-item-index");
      const subSubIdx = node.getAttribute("data-sub-item-index");

      // Reconstruct exactly how usePagination.js builds the map key
      const itemId = sectionId + "-" + subIdx + (subSubIdx ? "-" + subSubIdx : "");

      // Check allocation
      const allocatedPage = itemMap.get(itemId);

      // If it belongs to another page, remove it from the DOM.
      if (allocatedPage !== undefined && allocatedPage !== pageIndex) {
        node.remove();
      }
    });

    return doc.body.innerHTML;
  } catch (e) {
    console.warn("Failed to filter paginated HTML", e);
    return content;
  }
};

/**
 * Component to render HTML content safely
 * @param {Object} props
 * @param {string} props.html - HTML content to render
 * @param {string} [props.className] - Optional class names
 */
export const DescriptionHTML = ({ html, className = "" }) => {
  if (!html) return null;
  return (
    <div
      className={`description-html ${className}`}
      dangerouslySetInnerHTML={{ __html: renderHTML(html) }}
    />
  );
};
