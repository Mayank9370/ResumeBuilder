/**
 * DEEP CLONE UTILITY
 * Prevents shared references between Redux state and denormalized output
 * Critical for selector memoization and preview reactivity
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  // CRITICAL: Preserve File and Blob objects (used for image uploads)
  // These cannot be cloned and must be passed by reference
  // Harden: Check constructor name to handle Proxies or cross-realm instances
  if (
    obj instanceof File || 
    obj instanceof Blob || 
    (obj.constructor && (obj.constructor.name === 'File' || obj.constructor.name === 'Blob'))
  ) {
    return obj;
  }
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item));

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Normalizes a nested Legacy JSON resume into the V2 Relational State
 *
 * Legacy Input:
 * {
 *   personal_info: { ... },
 *   sections: [
 *     { id: 'exp', type: 'experience', data: [ { id: 1, role: '...' } ] },
 *     { id: 'edu', type: 'education', items: [ { ... } ] } // New ATS format
 *   ]
 * }
 *
 * Normalized Output:
 * {
 *   sections: { byId: { 'exp': { itemIds: ['job-1'] } } },
 *   items: { byId: { 'job-1': { role: '...' } } }
 * }
 */

export const normalizeResumeData = (legacyData) => {
  const normalized = {
    metadata: {
      templateId: legacyData.templateId || "minimalist",
      theme: legacyData.theme || {},
    },
    sections: { byId: {}, allIds: [] },
    items: { byId: {}, allIds: [] },
  };

  // ID uniqueness tracking
  const seenIds = new Set();

  // Helper to add item
  const registerItem = (item, sectionId) => {
    // Handle Primitives (e.g. Skills strings)
    let itemObj = item;
    if (typeof item !== "object" || item === null) {
      itemObj = { name: String(item), content: String(item) };
    }

    // Ensure ID with collision detection
    let itemId = itemObj.id || crypto.randomUUID();
    
    // GUARD: Prevent ID collisions
    if (seenIds.has(itemId)) {
      console.warn(`[NORMALIZER] ID COLLISION: ${itemId} - generating new ID`);
      itemId = crypto.randomUUID();
    }
    seenIds.add(itemId);
    
    // DEEP CLONE to break shared references from legacy data
    // PRESERVE metadata flags for skills (isBullet, isTag)
    const normItem = deepClone({
      ...itemObj,
      id: itemId,
      sectionId,
      // Preserve flags if they exist
      isBullet: itemObj.isBullet,
      isTag: itemObj.isTag
    });

    normalized.items.byId[itemId] = normItem;
    normalized.items.allIds.push(itemId);
    return itemId;
  };

  // 1. Handle Standard Sections (Always ensure they exist)
  const pInfoId = "personal_info";
  // Use existing ID or 'personal_info_item'
  const pInfoItemData = legacyData.personal_info || {};
  console.log('[NORMALIZER] Processing personal_info:', pInfoItemData);
  const pInfoItem = registerItem(
    { ...pInfoItemData, id: "personal_info_item" },
    pInfoId,
  );

  normalized.sections.byId[pInfoId] = {
    id: pInfoId,
    type: "personal_info",
    title: "Personal Info",
    itemIds: [pInfoItem],
    isRoot: true,
  };
  normalized.sections.allIds.push(pInfoId);

  // 2. Handle Dynamic Sections
  // ... (keep as is)

  // 2. Handle Dynamic Sections
  if (Array.isArray(legacyData.sections)) {
    legacyData.sections.forEach((section) => {
      const sectionId = section.id || crypto.randomUUID();
      const itemIds = [];

      // Extract Items
      // Legacy V1 used 'data' array. V1.5 (ATS) used 'items' array.
      let rawItems = section.items || section.data || [];

      // SKILLS ADAPTER: Flatten { items, bullets } -> [Items]
      // Use explicit check for object-based skills structure
      if (
        !Array.isArray(rawItems) &&
        typeof rawItems === "object" &&
        (rawItems.items || rawItems.bullets)
      ) {
        const tags = (rawItems.items || []).map((t) => {
          // If string, wrap. If object, ensure isTag/isBullet logic?
          // Actually just wrap everything to standard format.
          return typeof t === "object"
            ? { ...t, isTag: true }
            : { name: String(t), content: String(t), isTag: true };
        });
        const bullets = (rawItems.bullets || []).map((b) => {
          return typeof b === "object"
            ? { ...b, isBullet: true }
            : { name: String(b), content: String(b), isBullet: true };
        });
        rawItems = [...tags, ...bullets];
      }

      if (Array.isArray(rawItems)) {
        rawItems.forEach((item) => {
          const newItemId = registerItem(item, sectionId);
          itemIds.push(newItemId);
        });
      }

      // Register Section
      normalized.sections.byId[sectionId] = {
        ...section,
        id: sectionId,
        itemIds,
        // Remove legacy raw data to save memory, strictly use IDs now
        data: undefined,
        items: undefined,
      };
      normalized.sections.allIds.push(sectionId);
    });
  }

  // 3. Handle Summary (Always ensure it exists and has content)
  const existingSum = normalized.sections.byId["professional_summary"];
  const rootSumContent = legacyData.professional_summary;

  // Case A: Missing entirely -> Create Default
  if (!existingSum) {
    const sumId = "professional_summary";
    const sumContent = rootSumContent || "";
    const sumItem = registerItem(
      { content: sumContent, id: "summary_item" },
      sumId,
    );

    normalized.sections.byId[sumId] = {
      id: sumId,
      type: "summary",
      title: legacyData.summary_title || "Professional Summary",
      itemIds: [sumItem],
    };
    normalized.sections.allIds.push(sumId);
  } 
  // Case B: Exists but is Empty -> Backfill from Root (Fix for "Not Appearing")
  else if (existingSum.itemIds.length === 0 && rootSumContent) {
     // console.warn("[NORMALIZER] Backfilling empty summary section from root content");
     const sumItem = registerItem(
        { content: rootSumContent, id: "summary_item_backfill" },
        "professional_summary"
     );
     existingSum.itemIds.push(sumItem);
     // Ensure type is correct just in case
     if (!existingSum.type) existingSum.type = 'summary';
  }

  return normalized;
};

import { getResolvedSectionOrder } from '@/modules/resume-builder/state/OrderingAuthority';

/**
 * Denormalizes State back to Legacy JSON for Saving/Export
 * (Or for passing to the Legacy Layout Engine temporarily)
 */
export const denormalizeState = (state) => {
  const { sections, items, metadata } = state;

  const output = {
    templateId: metadata.templateId,
    theme: metadata.theme,
    sections: [],
  };

  // 🎯 AUTHORITY: Use Centralized Ordering Authority
  // Ensures validation, filtering, and single source of truth
  const orderedSectionIds = getResolvedSectionOrder(sections);

  // 🎯 CRITICAL FIX: Explicitly Handle Personal Info (Singleton)
  // It must be present regardless of whether it's in 'allIds' or 'orderedSectionIds'
  // (Reordering actions often strip it from the array since it's static)
  const pInfoId = 'personal_info';
  const pInfoSection = sections.byId[pInfoId];
  let personalInfoData = {};

  if (pInfoSection) {
      const itemId = pInfoSection.itemIds && pInfoSection.itemIds.length > 0 ? pInfoSection.itemIds[0] : null;
      const pItem = itemId ? items.byId[itemId] : null;
      
      if (pItem) {
          // DEEP CLONE to break Redux references
          personalInfoData = deepClone(pItem);
      } else {
          // 🛡️ RECOVERY: If item is missing (data corruption), provide specific fallback
          // This allows the user to re-enter data instead of the section being "dead"
          console.warn('[NORMALIZER] Missing personal_info item, recovering...');
          personalInfoData = { 
              id: itemId || 'personal_info_item', 
              sectionId: 'personal_info' 
          };
      }
  }

  // Assign to output (Always exists, even if empty)
  output.personal_info = personalInfoData;

  // Reconstruct sections in sorted order
  orderedSectionIds.forEach((sectId) => {
    // Skip Personal Info if it somehow ended up in the order array (Dedup)
    if (sectId === 'personal_info') return;

    const sect = sections.byId[sectId];
    if (!sect) return; // Guard against stale IDs

    // Special Case: Root Summary
    if (sect.type === "summary" && sect.id === "professional_summary") {
      const sItem = items.byId[sect.itemIds[0]];
      // 🔧 SAFETY: Guard against undefined item, populate root for backward compatibility
      output.professional_summary = sItem?.content || "";
      output.summary_title = sect.title;
      
      // 🎯 FIX: Intentional fall-through to add to sections array
      // This ensures it participates in dynamic ordering loops (Sidebar/Linear strategies)
    }

    // Standard Sections
    const hydratedItems = (sect.itemIds || [])
      .map((id) => {
        const item = items.byId[id];
        // CRITICAL FIX: Deep clone to break Redux reference chains
        // This ensures selector memoization detects changes properly
        return item ? deepClone(item) : null;
      })
      .filter(Boolean);

    // Output in both formats for maximum compatibility with generic/custom renderers
    output.sections.push({
      id: sect.id,
      type: sect.type,
      title: sect.title,
      data: hydratedItems,
      items: hydratedItems,
      // itemIds intentionally omitted (cleanup)
    });
  });

  return output;
};
