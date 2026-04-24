import { Link } from 'react-router-dom';
import { Layout, Eye } from 'lucide-react';

const ResumeBuilderSidebar = ({
  sidebarRef,
  formSteps,
  activeIndex,
  setActiveIndex,
  showMobilePreview,
  setShowMobilePreview
}) => {
  return (
    <aside ref={sidebarRef} className="w-full lg:w-[15%] lg:min-w-[220px] bg-[#0f172a] text-white flex flex-col shrink-0 z-20 h-auto lg:h-full border-b lg:border-b-0">
      {/* Branding */}
      <div className="p-4 lg:p-6 border-b lg:border-r border-slate-800 flex items-center justify-between shrink-0">
        <Link to="/resume/dashboard" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
          <Layout className="w-6 h-6" />
          <span className="text-lg font-bold tracking-tight text-white hidden sm:inline lg:inline">Builder</span>
        </Link>

        {/* Mobile Preview Toggle */}
        <button
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="lg:hidden text-white bg-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2"
        >
          <Eye size={14} /> {showMobilePreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Navigation Steps */}
      <nav className="flex-1 overflow-x-auto lg:overflow-y-auto py-2 lg:py-6 px-4 flex lg:flex-col gap-2 custom-scrollbar whitespace-nowrap lg:whitespace-normal">
        {formSteps.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex; // Simplified logic

          return (
            <button
              key={step.key}
              onClick={() => setActiveIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 
                  ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                } shrink-0 lg:shrink`}>
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs border 
                  ${isActive ? 'border-white text-indigo-600 bg-white font-bold' : 'border-slate-600'}`}>
                {index + 1}
              </span>
              <div className="flex flex-col items-start truncate hidden sm:flex">
                <span>{step.label}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ResumeBuilderSidebar;
