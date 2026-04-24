import React from 'react';

// Startup Pitch - Bold, high energy, focusing on experience
const StartupPitchTemplate = {
  id: 'startup-pitch',
  name: 'Startup Pitch',
  preview: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=400&h=500&fit=crop', // Temporary placeholder
  description: 'Bold, high energy design emphasizing your experience and impact.',
  layoutStrategy: 'DUAL_COLUMN',
  
  // Configuration for the dual column engine
  columnWidths: { left: "70%", right: "25%" }, // Massive bias to experience
  columnGap: "5%",
  columnMap: {
    experience: "left",
    projects: "left",
    summary: "right",
    skills: "right",
    technical_skills: "right",
    education: "right",
    languages: "right"
  },
  
  styles: {
    container: 'bg-white text-gray-800 shadow-xl',
    font: 'font-sans',
    
    // Dynamic Header
    headerContainer: 'text-left border-l-8 border-orange-500 pl-6 mb-10 pb-0 mt-4',
    name: 'font-black text-6xl mb-2 text-gray-900 tracking-tighter uppercase',
    contactInfo: 'flex flex-wrap text-sm gap-x-5 gap-y-1 text-gray-600 justify-start',
    
    // Huge headings
    sectionTitle: 'text-3xl font-black text-gray-900 mb-6 uppercase tracking-tighter mt-8',
    sectionContent: 'text-[15px] leading-snug text-gray-700',
    
    jobTitle: 'text-2xl font-black text-gray-900 tracking-tight',
    companyName: 'text-lg font-bold text-orange-500',
    dateLocation: 'text-sm font-semibold text-gray-500',
  }
};

export default StartupPitchTemplate;
