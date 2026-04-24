import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metadata: {
    templateId: 'minimalist',
    theme: {
      colors: { primary: '#000000', accent: '#3b82f6', background: '#ffffff' },
      fontSizes: { outputBase: 12, scale: 1.2 },
      fontFamily: { heading: 'Inter', body: 'Inter' }
    }
  },
  // Normalized Data
  sections: {
    byId: {},
    allIds: []
  },
  items: {
    byId: {},
    allIds: []
  },
  // Active State
  activeSectionId: null,
  activeItemId: null,
  isDirty: false
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // 1. Load Full Resume (Hyprated from Normalizer)
    loadResume: (state, action) => {
      const { metadata, sections, items } = action.payload;
      console.log(`[RESUME SLICE] loadResume:`, { 
          meta: metadata.templateId, 
          sectionCount: sections?.allIds?.length,
          itemCount: items?.allIds?.length 
      });
      state.metadata = { ...state.metadata, ...metadata };
      state.sections = sections;
      state.items = items;
      state.isDirty = false;
    },

    // 2. Update Metadata
    updateMetadata: (state, action) => {
      const { field, value } = action.payload;
      // Handle nested updates (e.g. theme.colors.primary)
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        state.metadata[parent] = { ...state.metadata[parent], [child]: value };
      } else {
        state.metadata[field] = value;
      }
      state.isDirty = true;
    },

    // 3. Update Section (Title, Settings)
    updateSection: (state, action) => {
      const { id, field, value } = action.payload;
      if (state.sections.byId[id]) {
        state.sections.byId[id][field] = value;
        state.isDirty = true;
      }
    },

    // NEW: Add Section (For Dynamic Sections)
    addSection: (state, action) => {
        const { id, type, title } = action.payload;
        console.log(`[RESUME SLICE] addSection:`, { id, type, title, prevAllIds: [...state.sections.allIds] });

        if (!state.sections.byId[id]) {
            state.sections.byId[id] = {
                id,
                type,
                title,
                itemIds: [],
                isRoot: false
            };
            state.sections.allIds.push(id);
            state.isDirty = true;
        }
    },

    // NEW: Remove Section
    removeSection: (state, action) => {
        const { id } = action.payload;
        if (state.sections.byId[id]) {
            // Cleanup items
            state.sections.byId[id].itemIds.forEach(itemId => {
                delete state.items.byId[itemId];
                state.items.allIds = state.items.allIds.filter(i => i !== itemId);
            });
            
            delete state.sections.byId[id];
            state.sections.allIds = state.sections.allIds.filter(s => s !== id);
            state.isDirty = true;
        }
    },

    // 4. Update Item (The Workhorse)
    updateItem: (state, action) => {
      const { id, field, value } = action.payload;
      if (state.items.byId[id]) {
        state.items.byId[id][field] = value;
        state.isDirty = true;
      }
    },

    // 5. Add New Item
    addItem: (state, action) => {
      const { sectionId, item } = action.payload;
      const newItemId = item.id || `item-${Date.now()}`;
      
      // Add to items
      state.items.byId[newItemId] = { ...item, id: newItemId, sectionId };
      state.items.allIds.push(newItemId);

      // Link to section
      const section = state.sections.byId[sectionId];
      if (section) {
        section.itemIds.push(newItemId);
      }
      state.isDirty = true;
    },

    // 6. Delete Item
    deleteItem: (state, action) => {
      const { sectionId, itemId } = action.payload;
      
      // Remove from section
      const section = state.sections.byId[sectionId];
      if (section) {
        section.itemIds = section.itemIds.filter(id => id !== itemId);
      }

      // Remove from items (Cleanup)
      delete state.items.byId[itemId];
      state.items.allIds = state.items.allIds.filter(id => id !== itemId);
      
      state.isDirty = true;
    },

    // 7. Reorder Items
    reorderItems: (state, action) => {
      const { sectionId, newOrder } = action.payload; // newOrder is array of itemIds
      if (state.sections.byId[sectionId]) {
        state.sections.byId[sectionId].itemIds = newOrder;
        state.isDirty = true;
      }
    },

    // 🎯 STABILIZATION FIX: Reorder Sections
    reorderSections: (state, action) => {
      const { newOrder } = action.payload; // newOrder is array of sectionIds in desired order
      
      // 🔥 FIX: Validate newOrder
      if (!Array.isArray(newOrder) || newOrder.length === 0) {
        console.error('[REORDER] Invalid newOrder:', newOrder);
        return;
      }
      
      // 🔥 FIX: Filter out invalid IDs
      const validOrder = newOrder.filter(id => id && state.sections.byId[id]);
      
      if (validOrder.length === 0) {
        console.error('[REORDER] No valid sections in newOrder');
        return;
      }
      
      // 🔥 STABILIZATION FIX: Guard against duplicate IDs
      const uniqueIds = [...new Set(validOrder)];
      if (uniqueIds.length !== validOrder.length) {
        console.warn('[REORDER] Removed duplicate IDs:', validOrder.length - uniqueIds.length);
      }
      
      // 🎯 SINGLE SOURCE OF TRUTH: Update allIds ONLY
      // 🛡️ DEFENSIVE FIX: Prevent data loss if UI sends partial list
      // If newOrder is missing existing IDs (e.g. from stale closure), we must Preserve them.
      const currentIds = state.sections.allIds || [];
      const newIdsSet = new Set(uniqueIds);
      
      // Find IDs that exist in state but were NOT in the newOrder
      const missingIds = currentIds.filter(id => !newIdsSet.has(id));
      
      if (missingIds.length > 0) {
          console.warn('[REORDER] Preserving missing sections:', missingIds);
      }
      
      // Apply order: New Order + Preserved Missing IDs (at the end)
      state.sections.allIds = [...uniqueIds, ...missingIds];
      
      state.isDirty = true;
      console.log('[SECTION REORDER] Updated section order:', state.sections.allIds);
    },

    setActiveSection: (state, action) => {
      state.activeSectionId = action.payload;
      state.activeItemId = null;
    },
    setActiveItem: (state, action) => {
      state.activeItemId = action.payload;
    }
  }
});

export const { 
  loadResume, 
  updateMetadata, 
  updateSection, 
  updateItem, 
  addItem, 
  deleteItem, 
  reorderItems,
  reorderSections, // 🎯 PHASE 2
  setActiveSection,
  setActiveItem,
  addSection,
  removeSection
} = resumeSlice.actions;

// Selectors
export const selectResumeMetadata = (state) => state.resume.metadata;
export const selectSection = (state, sectionId) => state.resume.sections.byId[sectionId];
export const selectSectionItems = (state, sectionId) => {
  const section = state.resume.sections.byId[sectionId];
  if (!section) return [];
  return section.itemIds.map(id => state.resume.items.byId[id]).filter(Boolean);
};
export const selectItem = (state, itemId) => state.resume.items.byId[itemId];
export const selectAllSections = (state) => state.resume.sections.allIds.map(id => state.resume.sections.byId[id]);
export const selectActiveItemId = (state) => state.resume.activeItemId;

export default resumeSlice.reducer;
