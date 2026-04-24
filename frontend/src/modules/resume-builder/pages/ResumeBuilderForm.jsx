import { ArrowLeftIcon, X } from "lucide-react";
import StyleSettingsPanel from "@/modules/resume-builder/components/StyleSettingsPanel";
import PersonalInfoForm from "@/modules/resume-builder/components/PersonalInfoForm";
import ProfessionalSummaryForm from "@/modules/resume-builder/components/ProfessionalSummaryForm";
import SkillsForm from "@/modules/resume-builder/components/SkillsForm";
import ExperienceForm from "@/modules/resume-builder/components/ExperienceForm";
import EducationForm from "@/modules/resume-builder/components/EducationForm";
import ProjectForm from "@/modules/resume-builder/components/ProjectForm";
import DynamicSectionForm from "@/modules/resume-builder/components/DynamicSectionForm";

import { useDispatch } from "react-redux";
import { updateSection } from "@/modules/resume-builder/state/resumeSlice";

const ResumeBuilderForm = ({
  showMobilePreview,
  isDesktop,
  formWidth,
  showStylePanel,
  resumeData,
  setResumeData,
  activeStep,
  activeIndex,
  formSteps,
  isEditMode,
  setShowSectionPopup,
  setShowStylePanel,
  prevStep,
  nextStep,
  saveResume,
}) => {
  const dispatch = useDispatch();

  return (
    <main
      className={`bg-white h-full flex flex-col relative shadow-xl z-10 shrink-0 transition-all duration-300 ${showMobilePreview ? "hidden lg:flex" : "flex"}`}
      style={{
        width:
          isDesktop && typeof formWidth === "number"
            ? `${formWidth}px`
            : isDesktop
              ? formWidth
              : "100%",
      }}
    >
      {/* Scrollable Form Content OR Style Panel */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {showStylePanel ? (
          <div className="p-8 lg:p-12 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Formatting & Style
              </h2>
              <button
                onClick={() => setShowStylePanel(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <StyleSettingsPanel
              formatting={resumeData.formatting || {}}
              onChange={(fmt) =>
                setResumeData((prev) => ({ ...prev, formatting: fmt }))
              }
              onBack={() => setShowStylePanel(false)}
            />
          </div>
        ) : (
          <div className="p-8 lg:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Header Text */}
              <div className="mb-8 pt-6">
                {" "}
                {/* Added pt-6 since top header is gone */}
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                  {activeStep.label}
                </h1>
                <p className="text-slate-500 text-lg">
                  {activeStep.key === "personal_info"
                    ? "What's the best way for employers to contact you?"
                    : (activeStep.key === "summary" || activeStep.key === "professional_summary")
                      ? "Briefly describe your professional background."
                      : activeStep.key === "education"
                        ? "Tell us about your education history."
                        : activeStep.key === "experience"
                          ? "Share your relevant work experience."
                          : "Add details to this section."}
                </p>
              </div>

              {/* FORM RENDERERS */}
              <div className="space-y-6">
                {activeStep.key === "title" && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Resume Headline
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg"
                      value={resumeData.title}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g. Senior Product Designer"
                    />
                  </div>
                )}

                {activeStep.key === "personal_info" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(v) =>
                      setResumeData((prev) => ({ ...prev, personal_info: v }))
                    }
                  />
                )}

                {(activeStep.key === "summary" || activeStep.key === "professional_summary") && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(v) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: v,
                      }))
                    }
                  />
                )}

                {/* SECTION FORMS */}
                {activeStep.type === "skills" && (
                  <SkillsForm
                    sectionId={activeStep.key}
                    data={resumeData.sections_obj[activeStep.key].data}
                    onChange={(v) =>
                      setResumeData((prev) => ({
                        ...prev,
                        sections_obj: {
                          ...prev.sections_obj,
                          [activeStep.key]: {
                            ...prev.sections_obj[activeStep.key],
                            data: v,
                          },
                        },
                      }))
                    }
                  />
                )}
                {/* GENERIC SECTION MAPPING */}
                {/* Matches based on 'type' property of the section, using fuzzy matching for pluralization */}

                {["experience", "work", "employment"].includes(
                  activeStep.type?.toLowerCase(),
                ) && (
                  <ExperienceForm
                    sectionId={activeStep.key}
                    data={resumeData.sections_obj[activeStep.key]?.data || []}
                    onChange={(v) =>
                      setResumeData((prev) => ({
                        ...prev,
                        sections_obj: {
                          ...prev.sections_obj,
                          [activeStep.key]: {
                            ...(prev.sections_obj[activeStep.key] || {
                              id: activeStep.key,
                              type: "experience",
                              title: "Experience",
                              order: 99,
                              data: [],
                            }),
                            data: v,
                          },
                        },
                      }))
                    }
                  />
                )}

                {["education", "school", "academics"].includes(
                  activeStep.type?.toLowerCase(),
                ) && (
                  <EducationForm
                    sectionId={activeStep.key}
                    data={resumeData.sections_obj[activeStep.key]?.data || []}
                    onChange={(v) =>
                      setResumeData((prev) => ({
                        ...prev,
                        sections_obj: {
                          ...prev.sections_obj,
                          [activeStep.key]: {
                            ...(prev.sections_obj[activeStep.key] || {
                              id: activeStep.key,
                              type: "education",
                              title: "Education",
                              order: 99,
                              data: [],
                            }),
                            data: v,
                          },
                        },
                      }))
                    }
                  />
                )}

                {["project", "projects"].includes(
                  activeStep.type?.toLowerCase(),
                ) && (
                  <ProjectForm
                    sectionId={activeStep.key}
                    data={resumeData.sections_obj[activeStep.key]?.data || []}
                    onChange={(v) =>
                      setResumeData((prev) => ({
                        ...prev,
                        sections_obj: {
                          ...prev.sections_obj,
                          [activeStep.key]: {
                            ...(prev.sections_obj[activeStep.key] || {
                              id: activeStep.key,
                              type: "project",
                              title: "Projects",
                              order: 99,
                              data: [],
                            }),
                            data: v,
                          },
                        },
                      }))
                    }
                  />
                )}

                {activeStep.type === "custom" && (
                  <DynamicSectionForm
                    section={resumeData.sections_obj[activeStep.key]}
                    onChange={(v) =>
                      setResumeData((prev) => ({
                        ...prev,
                        sections_obj: {
                          ...prev.sections_obj,
                          [activeStep.key]: {
                            ...prev.sections_obj[activeStep.key],
                            data: v,
                          },
                        },
                      }))
                    }
                    onTitleChange={(newTitle) => {
                      // 1. Update Local State (Immediate UI feedback)
                      setResumeData(prev => ({
                        ...prev,
                        sections_obj: {
                          ...prev.sections_obj,
                          [activeStep.key]: { ...prev.sections_obj[activeStep.key], title: newTitle }
                        }
                      }));

                      // 2. Dispatch to Redux (Sync with Preview/Store)
                      dispatch(updateSection({ 
                        id: activeStep.key, 
                        field: 'title', 
                        value: newTitle 
                      }));
                    }}
                  />
                )}
              </div>

              {/* Add Section Button - Inline */}
              <div className="pt-4 pb-8">
                <button
                  onClick={() => setShowSectionPopup(true)}
                  className="w-full py-3 border border-slate-200 rounded-xl text-slate-500 font-medium hover:border-indigo-400 hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span className="text-lg leading-none">+</span> Add Additional
                  Section
                </button>
              </div>

              {/* Inline Navigation Actions (Moved from Footer) */}
              <div className="flex justify-between items-center pt-2 pb-8">
                <button
                  onClick={prevStep}
                  disabled={activeIndex === 0}
                  className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors disabled:opacity-30 text-sm font-medium px-4 py-2 hover:bg-slate-50 rounded-lg"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back
                </button>

                <button
                  onClick={
                    activeIndex === formSteps.length - 1 ? saveResume : nextStep
                  }
                  className="px-10 py-3.5 rounded-full bg-[#ec4899] text-white font-bold text-lg hover:bg-[#db2777] shadow-lg shadow-pink-200 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 relative group"
                  style={{ backgroundColor: "#e11d48" }}
                >
                  {activeIndex === formSteps.length - 1
                    ? "Finish & Save"
                    : "Next: " +
                      (formSteps[activeIndex + 1]?.label || "Next Step")}

                  {/* Info Note for New Resumes */}
                  {activeIndex === formSteps.length - 1 && !isEditMode && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-800 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-xl">
                      1 token will be deducted when you create your first
                      resume.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ResumeBuilderForm;
