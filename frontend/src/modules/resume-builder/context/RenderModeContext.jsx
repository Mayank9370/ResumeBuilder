import { createContext, useContext } from 'react';

/**
 * RenderModeContext
 * 
 * Provides render mode throughout the component tree to control rendering behavior.
 * 
 * Modes:
 * - INTERACTIVE: Normal builder mode with section suppression, pagination, etc.
 * - PREVIEW_PRINT: Strict preview mode - all sections render, no suppression
 */

export const RenderModeContext = createContext('INTERACTIVE');

export const useRenderMode = () => useContext(RenderModeContext);

export const RenderModeProvider = ({ mode, children }) => (
  <RenderModeContext.Provider value={mode}>
    {children}
  </RenderModeContext.Provider>
);
