import React from 'react';

import { LayoutEngine } from '@/core/engine/ResumeLayoutEngine';
import { migrateTemplateId } from '@/modules/resume-builder/utils/templateMigration';
import { useStableImage } from '@/shared/hooks/useStableImage';
import { usePreviewData } from '@/modules/resume-builder/state/hooks';
import { RenderModeProvider } from '@/modules/resume-builder/context/RenderModeContext';

// Local Error Boundary for Preview
class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ResumePreview Crashed:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-900 p-10 border-4 border-red-200">
          <h2 className="text-2xl font-bold mb-4">Preview Crashed</h2>
          <p className="font-mono text-sm bg-white p-4 rounded border border-red-200 w-full overflow-auto text-left mb-4">
            {this.state.error && this.state.error.toString()}
          </p>
          <details className="w-full text-xs text-gray-500">
            <summary>Stack Trace</summary>
            <pre className="whitespace-pre-wrap mt-2">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}


const ResumePreview = ({ 
  data, 
  template, 
  templateConfig, 
  accentColor, 
  classes = "", 
  onSectionClick, 
  enableStore = true,
  renderMode = 'INTERACTIVE' // NEW: Control rendering behavior (INTERACTIVE | PREVIEW_PRINT)
}) => {
  // FORENSIC: Entry Point
  React.useEffect(() => {
    console.log(`[PREVIEW ENTRY] Received template prop = "${template}"`);
    // FORENSIC: Preview Props Check
    console.log(`[PREVIEW ENTRY] Received accentColor = "${accentColor}"`);
    console.log(`[PREVIEW ENTRY] Received formatting = `, templateConfig);
    console.log(`[PREVIEW ENTRY] renderMode = "${renderMode}"`);
  }, [template, renderMode]);

  // REDUX INTEGRATION:
  const storeData = usePreviewData();
  // Prefer Store Data if it has sections, otherwise fallback to props (Legacy)
  // FIX: Only use store if enabled by prop (Server Preview disables it)
  const isStoreActive = enableStore && storeData && storeData.sections && storeData.sections.length > 0;
  
  // If Store is active, we bypass the local debounce because Redux is the "Live" source.
  // We effectively treat storeData as the "debounced" data for visual stability if needed, 
  // but for "Instant Preview" we want it raw.
  // However, for image stability, we still need to process it.

  if (storeData && enableStore) {
      console.log("[ResumePreview] Using Store Data:", storeData); // DEBUG
  }

  const effectiveSourceData = isStoreActive ? storeData : data;

  /* Image Handling for Live Preview (Blob/File -> URL) */
  // Optimization: Debounce data updates to prevent layout thrashing on every keystroke
  const [debouncedData, setDebouncedData] = React.useState(effectiveSourceData);
  const [processedData, setProcessedData] = React.useState(effectiveSourceData);

  // 1. Debounce Input Data (Only if NOT using Store, OR if we want to throttle store updates too?)
  // User Requirement: "Enter key updates input... preview does not re-render".
  // This implies we should be aggressive. 
  // Let's debounce slightly (100ms) even for Store to avoid layout thrashing, 
  // but standard 300ms might be too slow.
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedData(effectiveSourceData);
    }, isStoreActive ? 0 : 300); // 🎯 STABILIZATION FIX: 0ms for Redux store = instant updates

    return () => {
      clearTimeout(handler);
    };
  }, [effectiveSourceData, isStoreActive]);

  // 2. Stable Image Lifecycle Hook
  // Extracts the raw image source (File/Blob/String) and returns a stable URL
  // that persists until the source identity changes.
  const rawImageSource = debouncedData?.personal_info?.image || debouncedData?.personal_info?.photo || debouncedData?.personal_info?.profileImage;
  const stableImageUrl = useStableImage(rawImageSource);

  // 3. Sync Processed Data with Stable URL
  React.useEffect(() => {
    // Use debouncedData instead of raw data
    const currentData = debouncedData || data;

    setProcessedData({
      ...currentData,
      personal_info: {
        ...currentData.personal_info,
        image: stableImageUrl,
        photo: stableImageUrl,
        profileImage: stableImageUrl
      }
    });

  }, [debouncedData, stableImageUrl]); // Only update when data or the stable URL changes

  // DATA NORMALIZATION ADAPTER
  // Converts ResumeBuilder State (sections_obj) -> Smart Apply Format (sections array)
  // Fixes: JSON leaks, HTML tags in print, nested objects in skills
  const normalizedData = React.useMemo(() => {
    try {
      if (!processedData) return null;

      // REDUX BYPASS / PREVIEW GENERATOR MODE
      // If data is already fully hydrated (has 'sections' array), use it directly.
      // This allows ResumePreview to support both:
      // 1. Builder State (needs normalization from sections_obj)
      // 2. Redux/Generator State (already normalized array)
      if (processedData.sections && Array.isArray(processedData.sections) && processedData.sections.length > 0) {
          return processedData;
      }

      const sections = [];
      const order = processedData.section_order || [];
      const obj = processedData.sections_obj || {};

      order.forEach(sectionId => {
        const rawSection = obj[sectionId];
        if (!rawSection) return;

        // UNWRAP Wrapper { id, data: [] }
        let payload = rawSection;
        if (rawSection && !Array.isArray(rawSection) && rawSection.data) {
          payload = rawSection.data;
        }

        // JSON STRING FIX: Parse if stringified code
        if (typeof payload === 'string' && (payload.trim().startsWith('[') || payload.trim().startsWith('{'))) {
          try { payload = JSON.parse(payload); } catch (e) { }
        }

        let cleanData = payload;
        // DETERMINE TYPE: Prioritize explicit type from builder, fallback to ID
        let type = rawSection.type || sectionId;
        
        console.log(`[Normalization] Processing ${sectionId} (Type: ${type}). Payload is Array? ${Array.isArray(payload)}`);

        // Normalize pluralization if necessary (e.g. project -> projects)

        // Skills Adapter (Flatten Objects -> Strings if needed, but Objects preferred for some templates)
        if (type === 'skills') {
          type = 'skills';
          if (payload && !Array.isArray(payload) && (payload.items || payload.bullets)) {
            // FIX: Do NOT flatten here. Pass the object structure ({ items, bullets }) to the engine.
            // LayoutNode and skillsNormalizer will handle the extraction.
            const items = Array.isArray(payload.items) ? payload.items : [];
            const bullets = Array.isArray(payload.bullets) ? payload.bullets : [];
            
            // Pass strictly as object with items/bullets properties
            cleanData = { items, bullets };
          } else if (Array.isArray(payload)) {
             // Return array as is (LayoutNode supports mixed strings/objects)
             cleanData = payload;
          }
        }
        // Experience/Projects/Education (PRESERVE HTML)
        else if (['experience', 'project', 'projects', 'education'].includes(type)) {
          // type IS ALREADY CORRECT. Do not overwrite with sectionId.
          if (Array.isArray(payload)) {
            cleanData = payload.map(item => ({
              ...item,
              // Fix: Do NOT strip HTML. Allow Rich Text.
              description: item.description || ""
            }));
          } else {
            cleanData = [];
          }
        }
        // Certifications: Enforce Name/Date mapping
        else if (type === 'certifications') {
          type = 'certifications';
          if (Array.isArray(payload)) {
            cleanData = payload.map(item => ({
              ...item,
              // Ensure Renderer-compatible keys exist
              name: item.name || item.title || item.label || item.certification || "Certificate",
              date: item.date || item.year || item.time || item.issued || "",
              description: item.description || ""
            }));
          } else {
            cleanData = [];
          }
        }
        // Custom / Achievements (Return OBJECTS, do not flatten to strings)
        else {
          // DO NOT overrwite type to 'custom'. 
          // If we overwrite it, custom sections lose their unique type (e.g. 'awards', 'languages', 'custom_1')
          // applyFormattingContract explicitly looks for these types!
          
          if (Array.isArray(payload)) {
            cleanData = payload.map(item => {
              // Robust Flattening: Handle Objects and JSON Strings
              let val = item;
              if (typeof val === 'string' && (val.trim().startsWith('{') || val.trim().startsWith('['))) {
                try { val = JSON.parse(val); } catch (e) { }
              }

              if (typeof val === 'object' && val !== null) {
                // Return the full object so the Renderer can map fields (title, subtitle, description)
                return val;
              }
              return val; // Return primitives as is
            });
          } else {
            cleanData = payload;
          }
        }

        sections.push({
          id: sectionId,
          type: type,
          title: rawSection.title || sectionId.charAt(0).toUpperCase() + sectionId.slice(1),
          data: cleanData
        });
      });
      
      console.log("[Normalization] Final Sections Array:", sections);

      const baseData = {
        ...processedData,
        sections: sections
      };

      return baseData;
    } catch (e) {
      console.error("Data Normalization Error:", e);
      // Throw to boundary
      throw new Error(`Data Normalization Failed: ${e.message} `);
    }
  }, [processedData]);

  // Adapter for onUpdate
  const handleUpdate = (sectionId, itemIndex, field, value) => {
    console.log("Preview Edit (Read Only):", sectionId, field, value);
  };

  return (
    <PreviewErrorBoundary>
      <div className='w-full flex justify-center bg-gray-100/50 min-h-[297mm] overflow-visible'>
        {/* 
            WRAPPER FOR PDF GENERATION 
            We use this ID to clone the entire set of pages for the PDF generator.
          */}
        <div
          id="resume-preview-container"
          className={`relative group print:min-h-0 print:h-auto print:w-full print:m-0 print:overflow-visible ${classes}`}
          data-render-mode={renderMode} // NEW: CSS styling hook
        >
          <RenderModeProvider mode={renderMode}>
            <LayoutEngine
              key={`${template}-${accentColor}`} // FORCE RE-MOUNT
              data={normalizedData}
              templateId={template}
              formatting={templateConfig}
              accentColor={accentColor}
              mode="new-ats"
              onUpdate={handleUpdate}
              onSectionClick={onSectionClick}
              renderMode={renderMode}
            />
          </RenderModeProvider>
        </div>
      </div>
    </PreviewErrorBoundary>
  )
}
export default ResumePreview;