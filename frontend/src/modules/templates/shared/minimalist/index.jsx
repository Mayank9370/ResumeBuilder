export default {
    id: 'minimalist',
    name: 'Minimalist Sans',
    family: 'MODERN',
    layoutStrategy: 'LINEAR',
    capabilities: {
        photo: false,
        geometric: false
    },
    docx: { supported: 'FULL' },

    // New Layout Definition
    layoutTree: {
        type: 'STACK',
        style: {
            padding: '40px 50px',
            minHeight: '100%',
            backgroundColor: 'white',
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' // Clean Sans
        },
        children: [
            // 1. Header (Left Aligned, Thin Name)
            {
                type: 'STACK',
                style: {
                    marginBottom: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                },
                children: [
                    { 
                        type: 'NAME_DISPLAY', 
                        style: { 
                            fontSize: '3rem', 
                            fontWeight: '200', // Thin
                            letterSpacing: '-0.02em',
                            marginBottom: '10px'
                        } 
                    },
                    { 
                        type: 'STACK', bind: 'contact_list', 
                        style: { 
                            justifyContent: 'flex-start', 
                            fontSize: '0.75rem', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.1em',
                            color: '#6b7280' // gray-500
                        } 
                    }
                ]
            },

            // 2. Summary
            { type: 'STACK', bind: 'summary', title: 'Profile' },

            // 3. Core Sections
            { type: 'STACK', bind: 'experience', title: 'Work Experience' }, // Explicit Label
            { type: 'STACK', bind: 'education', title: 'Education' },
            { type: 'STACK', bind: 'skills', title: 'Skills' },
            { type: 'STACK', bind: 'projects', title: 'Projects' },
            { type: 'STACK', bind: 'custom_sections' }
        ]
    },

    styles: {
        containerClass: 'font-sans text-black',
        
        // Typography
        sectionTitle: 'text-sm font-bold uppercase tracking-widest text-gray-400 mt-10 mb-4',
        
        // Items
        jobTitle: 'font-medium text-base text-black',
        companyName: 'text-gray-600 font-normal',
        dateLocation: 'text-xs text-gray-400 block mb-1',
        sectionContent: 'text-sm font-light leading-relaxed text-gray-800',
        
        // Bullets (None/Minimal)
        bulletList: 'ml-0 space-y-2 list-none', // No bullets, just spacing
    }
};
