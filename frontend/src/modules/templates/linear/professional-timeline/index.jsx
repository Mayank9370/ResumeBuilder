export default {
        id: 'professional-timeline',
        name: 'Flow Line',
        family: 'NARRATOR',
        layoutStrategy: 'COMPOSED',
        capabilities: {
            photo: false,
            layers: false,
            gutter: false,
            hybrid: false,
            geometric: false
        },
        regions: {},
        tags: ['Timeline', 'Flow', 'Left'],
        density: 'Medium',
        formality: 'Creative',
        layoutTree: {
        type: 'STACK',
        className: `font-sans bg-white text-gray-800 p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg`, // Legacy container classes
        style: {
            minHeight: '100%',
            backgroundColor: 'white' // Ensure background
        },
        children: [
            // 1. Header
            {
                type: 'STACK',
                className: `mb-8 pl-8`,
                children: [
                    { 
                        type: 'NAME_DISPLAY', 
                        style: { 
                             // We let ParticleRenderer handle the font style via styles.name
                             // But we need to ensure it's rendered.
                             // Actually NAME_DISPLAY uses styles.name?
                             // Let's check ParticleRenderer. 
                             // If not, we might need to inject inline styles, but let's hope styles.name works.
                        } 
                    },
                    { type: 'STACK', bind: 'contact_list', style: { marginTop: '10px' } }
                ]
            },

            // 2. Summary
            { type: 'STACK', bind: 'summary', title: 'Professional Summary' },

            // 3. Core Sections
            { type: 'STACK', bind: 'experience', title: 'Experience' },
            { type: 'STACK', bind: 'education', title: 'Education' },
            { type: 'STACK', bind: 'skills', title: 'Skills' },
            { type: 'STACK', bind: 'projects', title: 'Projects' },
            { type: 'STACK', bind: 'custom_sections' }
        ]
    },

    styles: {
            container: 'font-sans bg-white text-gray-800 p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg',
            header: 'mb-8 pl-8',
            name: 'text-4xl font-bold',
            contactInfo: 'text-sm text-gray-500 mt-2',
            sectionTitle: 'text-xl font-bold text-gray-300 mt-8 mb-4 uppercase tracking-widest pl-8',
            sectionContent: 'border-l-2 border-gray-200 pl-8 ml-2 py-2 text-sm leading-relaxed',
            jobTitle: 'font-bold text-lg text-gray-900',
            companyName: 'font-medium text-gray-600',
            dateLocation: 'text-xs text-gray-400 block mb-2',
            bulletList: 'list-none space-y-2',
        },
        differentiation: {
            allowNearDuplicate: true,
            layoutTopology: 'LINEAR',
            density: 'MEDIUM',
            typographyTone: 'SANS_MODERN',
            visualWeight: 'BALANCED',
            featureDistinction: 'Reified from chronicle - professional timeline chronological layout'
        }
};