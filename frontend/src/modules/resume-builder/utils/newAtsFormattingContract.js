import { normalizeSkills } from '@/modules/resume-builder/utils/skillsNormalizer';

/**
 * New ATS Formatting Contract v1
 * 
 * Authority: Strict.
 * Scope: New ATS Format Only.
 * Goal: Industry-agnostic, deterministic rendering.
 */

// Helper to clean dates
const formatMeta = (start, end, loc) => {
    let dateStr = '';
    if (start) {
        dateStr = start;
        if (end) dateStr += ` - ${end}`;
    }
    const parts = [];
    if (dateStr) parts.push(dateStr);
    if (loc) parts.push(loc);
    return parts.join(' | ');
};

export const applyFormattingContract = (resumeData) => {
    if (!resumeData) return null;

    // 1. Shallow Copy Root
    const formatted = {
        personal_info: { ...resumeData.personal_info },
        // Summary: Contract A - Narrative Paragraph
        // FIX: Check both top-level professional_summary AND personal_info.summary
        professional_summary: Array.isArray(resumeData.professional_summary)
            ? resumeData.professional_summary.join(' ')
            : (resumeData.professional_summary || resumeData.personal_info?.summary || ''),
        sections: []
    };

    // 2. Process Sections
    if (Array.isArray(resumeData.sections)) {
        resumeData.sections.forEach(section => {
            const newSection = {
                id: section.id,
                title: section.title,
                type: section.type,
                items: [] // Normalized Items
            };

            // IDEMPOTENY CHECK: If section is already formatted (has items, no data), preserve it.
            // This prevents data loss if the contract is applied twice (e.g. by ResumePreview re-renders).
            if (Array.isArray(section.items) && section.items.length > 0 && !section.data && section.type !== 'skills') {
                newSection.items = section.items; // Keep existing items
                // Copy over any other properties if needed? The loop output constructs newSection.
                // We might lose specific props if we don't copy them. 
                // Let's copy strictly what we need or just push the original section?
                // Using 'newSection' ensures strict contract output structure.
                formatted.sections.push(section); // Push the ORIGINAL formatted section to be safe
                return;
            }

            // SKILLS (Contract B)
            if (section.type === 'skills' || section.type === 'technical_skills') {
                console.log('[applyFormattingContract] Processing Skills section:', { id: section.id });

                // V2 HYBRID LOGIC: Preserve Explicit Tags/Bullets if present
                // This prevents "Smart Normalization" from destroying user-curated lists
                // HARDENING: Check explicitly for the structure produced by SkillsForm
                const hasExplicitStructure = section.data && (
                    (Array.isArray(section.data.items) && section.data.items.length > 0) || 
                    (Array.isArray(section.data.bullets) && section.data.bullets.length > 0)
                );
                
                // Also check if 'section.items' (Redux normalized) is already populated
                const hasReduxItems = Array.isArray(section.items) && section.items.length > 0;

                if (hasExplicitStructure || hasReduxItems) {
                    console.log('[applyFormattingContract] Preserving Explicit Skills Structure', {
                        fromData: hasExplicitStructure,
                        fromRedux: hasReduxItems
                    });
                    
                    // Merge tags and bullets into a single list for the engine to consume
                    newSection.items = [];
                    
                    if (hasExplicitStructure) {
                        if (Array.isArray(section.data.items)) {
                            newSection.items.push(...section.data.items);
                        }
                        if (Array.isArray(section.data.bullets)) {
                            newSection.items.push(...section.data.bullets);
                        }
                    } else if (hasReduxItems) {
                         // If we only have Redux items, preserve them as is
                         // The engine will sort them into Tags/Bullets
                         newSection.items = [...section.items];
                    }
                } else {
                    console.warn('[applyFormattingContract] No explicit structure found. Falling back to Auto-Normalization (Legacy Mode).', {
                        dataKeys: section.data ? Object.keys(section.data) : 'null'
                    });
                    
                    // Fallback: Smart Normalization for unstructured data (e.g. simple array of strings)
                    // This is the ONLY path that adds "Programming Languages:" prefixes.
                    // If this runs on user data, it means the upstream data structure is empty/wrong.
                    const normalizedStats = normalizeSkills(section.data);
                    
                    newSection.items = normalizedStats.map(cat => ({
                        type: 'ListEntry',
                        label: cat.name,
                        value: cat.data.join(', ')
                    }));
                }
            }

            // ENTITIES (Contract C / D)
            // Experience, Projects, Education, Volunteering, etc.
            else if (['experience', 'projects', 'project', 'education', 'jobs', 'volunteering', 'leadership', 'custom', 'certifications', 'languages', 'awards'].includes(section.type) || Array.isArray(section.data)) {
                console.log('[applyFormattingContract] Processing Entity Section:', {
                    id: section.id,
                    type: section.type,
                    hasData: !!section.data,
                    isDataArray: Array.isArray(section.data),
                    dataLength: Array.isArray(section.data) ? section.data.length : 'N/A',
                    hasItems: !!section.items,
                    itemsLength: Array.isArray(section.items) ? section.items.length : 'N/A'
                });
                if (Array.isArray(section.data)) {
                    newSection.items = section.data.map(item => {
                        // 1. Primitive String Handling (Achievements, Languages, Custom Lists)
                        // INVARIANT: User text must never be dropped.
                        if (typeof item === 'string') {
                            return {
                                type: 'NarrativeEntry',
                                content: item
                            };
                        }

                        // 2. Object Handling (Experience, Projects, Education)
                        let header = 'Entry';
                        let subheader = null;

                        // STRICT TYPE LOGIC: Prevent Field Collisions & Enforce Order
                        if (section.type === 'projects' || section.type === 'project') {
                             // RULE 1: Header = Name | Type | Tech Stack (Single Line, No Labels)
                             const headerParts = [item.title || item.name || item.header || 'Project'];

                             // Project Type
                             const pType = item.type || item.project_type;
                             if (pType) headerParts.push(pType);

                             // Tech Stack (Pure Content)
                             const stacks = item.tech || item.technologies || item.stack || item.techStack || item.skills;
                             if (stacks) {
                                 const stackStr = Array.isArray(stacks) ? stacks.join(', ') : stacks;
                                 headerParts.push(stackStr);
                             }

                             header = headerParts.join(' | ');

                             // RULE 2: Subheader = Role | Subtitle (Below)
                             const subParts = [];
                             if (item.role) subParts.push(item.role);
                             if (item.subtitle) subParts.push(item.subtitle);
                             if (item.company) subParts.push(item.company);

                             subheader = subParts.join(' | ');

                        } else if (section.type === 'education') {
                             // Education: Degree is Header, School is Subheader
                             // FIX: Include Field of Study
                             const degree = item.degree || item.certification || item.title || item.name || 'Degree';
                             header = item.field ? `${degree} in ${item.field}` : degree;
                             
                             subheader = item.institution || item.school || item.university || item.company;
                        } else {
                             // Custom / Generic Sections: Title is Header, Role + Subtitle in Subheader
                             // No fallback defaults - empty fields render nothing
                             // FIX: Include 'position' and 'role' for Experience
                             header = item.title || item.name || item.position || item.role || null;
                             
                             const subParts = [];
                             if (item.role && header !== item.role) subParts.push(item.role);
                             if (item.subtitle) subParts.push(item.subtitle);
                             if (item.company) subParts.push(item.company);
                             if (item.institution) subParts.push(item.institution);
                             subheader = subParts.length > 0 ? subParts.join(' | ') : null;
                        }
                        
                        const startDate = item.start_date || item.date || null;
                        // V8.9 Fix: Respect is_current for End Date
                        const endDate = (item.is_current || String(item.is_current) === 'true') 
                            ? "Present" 
                            : (item.end_date || null);
                        
                        // Location Logic
                        let location = item.location;
                        if (!location && item.city) {
                            location = `${item.city}`;
                            if (item.state) location += `, ${item.state}`;
                        }

                        // Meta Construction (Date | Location | GPA)
                        let meta = formatMeta(startDate, endDate, location);
                        
                        if (section.type === 'education' && item.gpa) {
                            meta = meta ? `${meta} | Percentage: ${item.gpa}` : `Percentage: ${item.gpa}`;
                        }
                        
                        // Note: Project Type/Tech moved to Subheader per strict requirements

                        const url = item.url || item.link || item.website || item.github || item.portfolio || null;

                        let bullets = [];
                        if (Array.isArray(item.description)) bullets = item.description;
                        else if (typeof item.description === 'string') bullets = [item.description];
                        // Educational coursework often in 'items' or 'courses'
                        if (!bullets.length && item.items) bullets = item.items;

                        // Logic: Variant Handling
                        const variant = bullets.length > 0 ? 'StandardEntry' : 'SimpleEntry';

                        return {
                            type: variant,
                            header: header,
                            subheader: subheader,
                            meta: meta,
                            url: url, // Preserved Link
                            bullets: bullets,
                            // PRESERVE ALL ORIGINAL FIELDS for advanced templates
                            // ✅ Each field kept distinct - no overwrites
                            title: item.title,           // ✅ Distinct
                            role: item.role,             // ✅ Distinct
                            subtitle: item.subtitle,     // ✅ Distinct
                            position: item.position,     // ✅ Distinct
                            projectType: item.type,
                            tech: item.tech,
                            issuer: item.issuer
                            // ❌ organization removed
                        };
                    }).filter(item => item !== null); // Filter out empty strings or invalid entries
                }
            }
            // Fallback for unknown sections (Safety First - Don't drop)
            else {
                // If it's a simple text section?
                if (typeof section.data === 'string') {
                    newSection.items = [{ type: 'NarrativeEntry', content: section.data }];
                }
            }

            console.log('[applyFormattingContract] Section after processing:', {
                id: newSection.id,
                type: newSection.type,
                itemsLength: newSection.items.length
            });

            // V8.9 Fix: Allow Skills sections to render even if empty (so Title appears)
            const isSkills = section.type === 'skills' || section.type === 'technical_skills';
            if (newSection.items.length > 0 || isSkills) {
                formatted.sections.push(newSection);
                console.log('[applyFormattingContract] ✅ Section INCLUDED');
            } else {
                console.log('[applyFormattingContract] ❌ Section FILTERED OUT (empty items)');
            }
        });
    }

    return formatted;
};
