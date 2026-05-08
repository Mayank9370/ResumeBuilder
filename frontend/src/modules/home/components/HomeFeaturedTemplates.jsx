import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { templates as localTemplates } from "@/modules/resume-builder/constants/templates";
import { ArrowRight } from "lucide-react";

/* ── Single template card for home page ── */
const HomeTemplateCard = ({ template }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleClick = () => navigate("/resume");

  return (
    <div
      className="home-template-card relative flex flex-col"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Use ${template.name} template`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Preview image container — A4 ratio */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "210 / 297" }}
      >
        {template.image && !imgError ? (
          <img
            src={template.image}
            alt={`${template.name} template preview`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 text-slate-400">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-black text-indigo-400 mb-2">
              {template.name?.charAt(0) ?? "?"}
            </div>
            <span className="text-xs font-medium">No Preview</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="home-template-card-overlay">
          <span className="bg-white text-indigo-600 font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
            Use Template <ArrowRight size={12} />
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-4 py-3 bg-white border-t border-slate-50">
        <h3 className="font-bold text-slate-800 text-sm truncate text-center">
          {template.name}
        </h3>
      </div>
    </div>
  );
};

/* ── Featured Templates Section ── */
const HomeFeaturedTemplates = () => {
  const navigate = useNavigate();

  // Select specific templates requested by the user
  const targetNames = [
    "Pastel Dream",
    "Brutal Block",
    "The Legacy",
    "The Nordic",
  ];

  const featuredTemplates = targetNames
    .map((name) => localTemplates.find((t) => t.name === name))
    .filter((t) => t !== undefined);

  return (
    <section className="home-templates-bg py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
            Pick one of many world-class{" "}
            <span className="home-gradient-text-alt">templates</span>
            <br className="hidden sm:block" />
            and build your resume in minutes
          </h2>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            Professionally designed, ATS-friendly templates to help you land
            your dream job.
          </p>
        </div>

        {/* ── Desktop: 4-column grid ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTemplates.map((template) => (
            <HomeTemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* ── Mobile: horizontal scroll ── */}
        <div className="md:hidden home-templates-row">
          {featuredTemplates.map((template) => (
            <HomeTemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* View all CTA */}
        <div className="flex justify-center mt-10">
          <button
            id="home-view-all-templates"
            onClick={() => navigate("/resume")}
            className="home-btn-secondary font-semibold text-sm px-7 py-3 rounded-full flex items-center gap-2"
            aria-label="View all resume templates"
          >
            View All Templates
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturedTemplates;
