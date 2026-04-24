import { Settings, Layout, FileText, FolderGit2, MoveVertical } from 'lucide-react'; // 🎯 PHASE 2: Added MoveVertical
import ResumePreview from '@/modules/resume-builder/components/ResumePreview';
import FontLoader from '@/modules/resume-builder/components/FontLoader';
import SectionReorderModal from '@/modules/resume-builder/components/SectionReorderModal'; // 🎯 PHASE 2
import { useState } from 'react'; // 🎯 PHASE 2
import { resolveLayoutStrategy } from '@/core/engine/layoutRegistry';
import LinearLayoutStrategy from '@/core/engine/strategies/LinearLayoutStrategy';
import { templates } from '@/modules/resume-builder/constants/templates';

const ResumeBuilderPreview = ({
  showMobilePreview,
  saveStatus,
  lastSaved,
  isEditMode,
  resumeData,
  setResumeData, // Added for quick switch
  setShowTemplateModal,
  setShowStylePanel,
  showStylePanel,
  handleDownloadPDF,
  handleDownloadWord,
  handleSaveToDocuments,
  saveResume,
  previewContainerRef,
  previewScale,
  handleSectionClick,
  templateConfig
}) => {
  // 🎯 PHASE 2: Section reorder modal state
  const [showReorderModal, setShowReorderModal] = useState(false);

  const AutosaveIndicator = () => {
    if (!isEditMode) return null; // Don't show for unsaved new resume

    switch (saveStatus) {
      case 'saving':
        return <div className="text-xs text-slate-400 font-medium flex items-center gap-1"><span className="animate-spin">⟳</span> Saving...</div>;
      case 'saved':
        return <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <span className="text-green-500">✓</span> Saved {lastSaved ? 'just now' : ''}
        </div>;
      case 'error':
        return <div className="text-xs text-red-500 font-bold flex items-center gap-1">⚠ Save Failed</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`lg:flex-1 bg-slate-100 h-full flex-col min-w-0 border-l border-slate-200 relative ${showMobilePreview ? 'flex w-full' : 'hidden lg:flex'}`}>

      {/* Preview Toolbar */}
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <AutosaveIndicator />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Quick Template Switcher */}
          <select
            value={resumeData.template || "minimalist"}
            onChange={(e) => {
              if (setResumeData) {
                setResumeData(prev => ({ ...prev, template: e.target.value }));
              }
            }}
            className="text-xs font-medium px-3 py-2 bg-slate-50 rounded-lg text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[150px] truncate cursor-pointer"
            title="Quick Switch Template"
          >
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowTemplateModal(true)}
            className="text-xs font-medium px-3 py-2 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-2"
            title="Change Template Grid"
          >
            <Layout size={14} />
            <span className="hidden sm:inline">Gallery</span>
            <div className="w-3 h-3 rounded-full border border-slate-300 ml-1" style={{ backgroundColor: resumeData.accent_color }}></div>
          </button>

          {/* 🎯 PHASE 2: Section Reorder Button - VISIBILITY RULE: Single Column Only */}
          {(() => {
            // Resolve Strategy to determine if reordering is safe
            const Strategy = resolveLayoutStrategy(resumeData.template);
            // Allow if:
            // 1. Explicitly LinearLayoutStrategy
            // 2. Or displayName contains 'Linear' (fallback)
            // 3. Or it's a known single-column template alias (handled by registry, but we check strategy here)

            // We compare against the Imported Component or its Name
            const isSingleColumn = Strategy === LinearLayoutStrategy || Strategy?.name === 'LinearLayoutStrategy' || Strategy?.displayName === 'LinearLayoutStrategy';

            if (!isSingleColumn) return null;

            return (
              <button
                onClick={() => setShowReorderModal(true)}
                className="text-xs font-medium px-3 py-2 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-2"
                title="Reorder Sections"
              >
                <MoveVertical size={14} />
                <span className="hidden sm:inline">Reorder</span>
              </button>
            );
          })()}

          <button
            onClick={() => setShowStylePanel(!showStylePanel)}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-xs font-medium ${showStylePanel ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
            title="Formatting Settings"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Formatting</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-2 text-xs font-medium"
            title="Download PDF"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={() => handleDownloadWord(false)}
            className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors flex items-center gap-2 text-xs font-medium"
            title="Download Word (DOCX)"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">Word</span>
          </button>

          <button
            onClick={saveResume}
            className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm"
            title="Save Draft: Saves your progress in the editor (does not save to Library)"
          >
            Save
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden relative" ref={previewContainerRef}>


        {/* STABILIZATION FIX: items-start prevents vertical stretching. justify-center centers. */}
        <div className="h-full overflow-y-auto p-8 custom-scrollbar flex flex-col items-center justify-start bg-slate-200/50">
          <div
            className="origin-top transition-transform duration-75 ease-out"
            style={{ transform: `scale(${previewScale})` }}
          >
            <FontLoader fontFamily={resumeData.formatting.font_family} />
            <ResumePreview
              data={{
                ...resumeData,
                // 🔥 CRITICAL FIX: Use sections array directly if available (has correct Redux order)
                // Fallback to reconstruction only for backward compatibility
                sections: resumeData.sections || resumeData.section_order?.map(id => resumeData.sections_obj?.[id]).filter(Boolean) || []
              }}
              template={resumeData.template} // Log this: console.log("Preview Template:", resumeData.template)
              templateConfig={resumeData.formatting || templateConfig}
              accentColor={resumeData.accent_color}
              onSectionClick={handleSectionClick}
            />
          </div>
        </div>
      </div>

      {/* 🎯 PHASE 2: Section Reorder Modal */}
      <SectionReorderModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
      />
    </div>
  );
};

export default ResumeBuilderPreview;