import React from "react";
import {
  Layout,
  PenTool,
  CheckCircle,
  Type,
  Lightbulb,
  Download,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="home-feature-card group flex flex-col items-center text-center p-6 md:p-8">
    <div className="home-feature-icon-wrapper mb-5">
      <Icon
        size={24}
        className="text-indigo-600 group-hover:text-white transition-colors"
      />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </div>
);

const HomeFeatures = () => {
  const features = [
    {
      icon: Layout,
      title: "Powerful Resume Builder",
      description:
        "Drag-and-drop sections, real-time preview, and intuitive editing tools make building your resume effortless.",
    },
    {
      icon: CheckCircle,
      title: "ATS-Friendly Templates",
      description:
        "Our templates are structurally designed to pass through Applicant Tracking Systems (ATS) seamlessly.",
    },
    {
      icon: PenTool,
      title: "Professional Templates",
      description:
        "Choose from dozens of premium, industry-tested templates crafted by top career experts.",
    },
    {
      icon: Type,
      title: "Customize Fonts & Colors",
      description:
        "Personalize your resume with advanced typography controls and custom color palettes to stand out.",
    },
    {
      icon: Lightbulb,
      title: "Expert Resume Tips",
      description:
        "Get contextual guidance and pre-written phrases to help you highlight your achievements effectively.",
    },
    {
      icon: Download,
      title: "Easy PDF Export",
      description:
        "Download a pixel-perfect, print-ready PDF of your resume instantly with a single click.",
    },
  ];

  return (
    <section className="home-features-bg py-20 lg:py-28 relative">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
            Everything you need to <br className="hidden sm:block" />
            <span className="home-gradient-text">land your dream job</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Our platform provides all the tools and templates necessary to
            create a professional resume that gets you hired.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;
