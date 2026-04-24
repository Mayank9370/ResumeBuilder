import '@/modules/templates/linear/horizon/horizon.module.css';

export default {
    id: 'horizon',
    name: 'The Horizon',
    family: 'INNOVATIVE',
    layoutStrategy: 'LINEAR',
    capabilities: {
        photo: true,
        layers: false,
        gutter: false,
        hybrid: false,
        geometric: false
    },
    tags: ['Innovative', 'Minimal', 'Balanced'],
    density: 'Medium',
    formality: 'Modern',
    
    // No hardcoded sections, the LINEAR engine will map through the normalized section array dynamically
    layoutTree: {
        type: 'STACK',
        className: 'font-sans bg-white text-gray-900 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg horizon-container',
        style: {
            padding: '40px 50px',
            backgroundColor: 'white'
        },
        children: []
    },

    styles: {
        // Core features
        renderHeaderPhoto: true,
        photoShape: 'CIRCLE',
        photoSize: 'w-[80px] h-[80px] min-w-[80px]',

        // Apply global/structural classes (see module CSS)
        container: 'font-sans bg-white text-gray-900 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg p-10 horizon-container', 

        // Horizon Header Architecture Overrides
        // We override ParticleRenderer's default flexbox with our custom grid.
        headerContainer: 'mb-8 border-b border-gray-200 pb-4 horizon-header-grid', 
        name: 'text-[28px] font-bold text-gray-900 horizon-header-name',
        
        // Job Title logic is bound to sectionContent in ParticleRenderer when inside the header,
        // so we inject the class below to target the profession text.
        
        contactInfo: 'text-[12px] text-gray-500 horizon-contact-grid',
        
        // Smart Heading Style (Use a left accent bar)
        sectionTitle: 'text-[14px] font-bold uppercase tracking-widest text-gray-800 mt-[22px] mb-[18px] pl-3 border-l-4 border-gray-400 horizon-section-title',
        
        // Soft Visual Blocks + Timeline Feel (Entries slightly indented)
        sectionContent: 'text-[12px] text-gray-700 leading-relaxed font-normal ml-4 mb-4 horizon-section-content',
        
        // Hierarchy
        jobTitle: 'font-bold text-[13px] text-gray-900',
        companyName: 'font-medium text-[13px] text-gray-700 mb-1',
        dateLocation: 'text-[12px] text-gray-400 float-right', // Dates Subtle gray
        
        bulletList: 'list-disc ml-8 space-y-1 text-[12px] text-gray-700',
    },
    
    differentiation: {
        layoutTopology: 'LINEAR',
        density: 'MEDIUM',
        typographyTone: 'SANS_MODERN',
        visualWeight: 'LIGHT',
        featureDistinction: 'Calm, balanced linear layout with subtle left accent and strong hierarchy'
    }
};
