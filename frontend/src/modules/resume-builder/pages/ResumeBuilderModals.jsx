import { X, ChevronRight, Briefcase, GraduationCap, FolderGit2, Code, PenTool, FileText } from 'lucide-react';
import ChangeTemplateModal from '@/modules/resume-builder/components/ChangeTemplateModal';

const ResumeBuilderModals = ({
  showSectionPopup,
  setShowSectionPopup,
  createSection,
  showTemplateModal,
  setShowTemplateModal,
  resumeData,
  setResumeData,
  searchParams,
  setSearchParams,
  docxWarning,
  setDocxWarning,
  handleDownloadWord
}) => {
  return (
    <>
      {/* ADD SECTION MODAL */}
      {showSectionPopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 w-full max-w-lg rounded-2xl shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200 scale-100 font-sans">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Add Section</h3>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">Choose a section to add to your resume</p>
              </div>
              <button
                onClick={() => setShowSectionPopup(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid gap-3 bg-slate-50/50">
              {[
                { id: 'summary', label: 'Professional Summary', desc: 'Brief overview of your career goals', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
                { id: 'experience', label: 'Work Experience', desc: 'Add your past jobs and internships', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { id: 'education', label: 'Education', desc: 'Schools, degrees, and certifications', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
                { id: 'project', label: 'Projects', desc: 'Showcase your best technical work', icon: FolderGit2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                { id: 'skills', label: 'Skills', desc: 'List your technical and soft skills', icon: Code, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
                { id: 'custom', label: 'Custom Section', desc: 'Create a section for anything else', icon: PenTool, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => createSection(item.id)}
                  className="w-full text-left group flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 transform hover:scale-[1.01]"
                >
                  <div className={`p-3 rounded-xl border ${item.bg} ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-slate-800 font-bold text-base group-hover:text-indigo-600 transition-colors">{item.label}</h4>
                    <p className="text-slate-500 text-sm group-hover:text-slate-600">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowSectionPopup(false)}
                className="px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE TEMPLATE MODAL */}
      <ChangeTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        currentTemplateId={resumeData.template}
        currentColor={resumeData.accent_color}
        onSave={(newTemplate, newColor) => {
          setResumeData(prev => ({ ...prev, template: newTemplate, accent_color: newColor }));

          // CRITICAL FIX: Sync URL to survive re-mounts (Split Brain Prevention)
          setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('templateId', newTemplate);
            return newParams;
          }, { replace: true });
          
          setShowTemplateModal(false); // ✅ FIX: Close modal after saving
        }}
      />

      {/* DOCX WARNING MODAL */}
      {docxWarning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95">
            <button
              onClick={() => setDocxWarning(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Word Export Limitations</h3>
              <p className="text-slate-500 text-sm mt-2">
                The "{docxWarning.templateName}" template uses advanced design features that are not fully supported in Word.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6 text-left">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-2">Adjustments applied:</h4>
              <ul className="text-sm text-amber-900 space-y-1 ml-4 list-disc">
                {docxWarning.degradations.map((deg, i) => (
                  <li key={i}>{deg}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDocxWarning(null)}
                className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDocxWarning(null);
                  handleDownloadWord(true);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Continue & Export
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResumeBuilderModals;
