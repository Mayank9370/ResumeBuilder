import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { loadResume, selectResumeMetadata, selectAllSections } from '@/modules/resume-builder/state/resumeSlice';
import { normalizeResumeData, denormalizeState } from '@/modules/resume-builder/state/normalizer';

/**
 * Hook to Sync Legacy JSON Data -> Redux Store
 * Should be called when the legacy fetch completes.
 */
export const useResumeSync = (legacyResumeData) => {
    const dispatch = useDispatch();
    const isLoaded = useRef(false);

    useEffect(() => {
        if (legacyResumeData && legacyResumeData.template) {
            // console.log('[RESUME SYNC] Hydrating Store from Legacy Data');
            const normalized = normalizeResumeData(legacyResumeData);
            dispatch(loadResume(normalized));
            isLoaded.current = true;
        }
    }, [legacyResumeData, dispatch]);
};

// 🎯 STABILIZATION FIX: Enhanced Memoized Selector
// The selector now has granular dependencies:
// - sections.allIds (order changes)
// - sections.byId (content changes)
// - items.byId (item changes)
// This ensures denormalizeState is ONLY called when actual data changes,
// not just when the state object reference changes.
const selectSectionsAllIds = (state) => state.resume.sections.allIds;
const selectSectionsById = (state) => state.resume.sections.byId;
const selectItemsById = (state) => state.resume.items.byId;
const selectMetadata = (state) => state.resume.metadata;

const selectDenormalized = createSelector(
  [selectSectionsAllIds, selectSectionsById, selectItemsById, selectMetadata],
  (allIds, byId, itemsById, metadata) => {
    // Reconstruct the resume state structure for denormalizer
    const resumeState = {
      sections: { allIds, byId },
      items: { byId: itemsById, allIds: Object.keys(itemsById) },
      metadata
    };
    return denormalizeState(resumeState);
  }
);

/**
 * Hook to retrieve denormalized data for the Preview
 * This allows the Preview to look like it's reading legacy data, 
 * but it's actually reactive to the Store!
 */
export const usePreviewData = () => {
    // OLD: caused new reference on every render
    // const state = useSelector(state => state.resume);
    // return denormalizeState(state);
    
    // NEW: Memoized
    return useSelector(selectDenormalized);
};
