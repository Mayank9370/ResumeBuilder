import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  importFlow: {
    step: null, // "template_selection" | "file_upload" | "parsing" | "done"
    selectedTemplateId: null
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setImportFlowStep: (state, action) => {
      state.importFlow.step = action.payload;
    },
    setImportTemplate: (state, action) => {
      state.importFlow.selectedTemplateId = action.payload;
    },
    resetImportFlow: (state) => {
      state.importFlow = initialState.importFlow;
    }
  }
});

export const { setImportFlowStep, setImportTemplate, resetImportFlow } = uiSlice.actions;

export const selectImportFlow = (state) => state.ui?.importFlow || initialState.importFlow;

export default uiSlice.reducer;
