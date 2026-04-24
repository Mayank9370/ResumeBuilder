/**
 * ORDERING AUTHORITY MODULE
 * 
 * Single Source of Truth for Section Ordering & Navigation.
 * 
 * Responsibilities:
 * 1. Resolving the authoritative order of sections from Redux state.
 * 2. Generating consistent Sidebar Navigation steps.
 * 3. Calculating deterministic insertion indices.
 * 
 * Rules:
 * - 'personal_info' is ALWAYS separate/locked (handled via static step or specific logic).
 * - 'summary' is treated as a FLUID section (can be reordered).
 * - New sections generally append to the end.
 */

// Core Resolver
export const getResolvedSectionOrder = (sectionsState) => {
    if (!sectionsState || !sectionsState.allIds) return [];
    
    // The Redux 'allIds' is the primary source of truth for ORDER.
    // We filter it to ensure valid IDs actually exist in 'byId'.
    return sectionsState.allIds.filter(id => {
        // Guard: Check if section exists
        return sectionsState.byId[id] !== undefined;
    });
};

/**
 * Generates the steps for the Sidebar Navigation.
 * Ensures strict synchronization with the resolved section order.
 */
export const getSidebarSteps = (sectionsState) => {
    const order = getResolvedSectionOrder(sectionsState);
    const sections = sectionsState.byId || {};

    // 1. Static Header Steps (Always Fixed)
    const steps = [
        { key: "title", label: "Resume Title", type: "static" },
        { key: "personal_info", label: "Personal Information", type: "static" },
    ];

    // 2. Dynamic Steps (Based on Resolved Order)
    const seenKeys = new Set(["title", "personal_info"]);

    order.forEach(id => {
        if (id === 'personal_info') return; // Handled statically

        // Deduplication Guard
        if (seenKeys.has(id)) return;
        seenKeys.add(id);

        const section = sections[id];
        let label = "Section";
        let type = "custom";

        // Logic for Summary Label/Type
        if (id === 'professional_summary' || id === 'summary') {
            label = "Professional Summary";
            type = "summary";
        } else if (section) {
            label = section.title || "Section";
            type = section.type || "custom";
        }

        steps.push({
            key: id,
            label: label,
            type: type
        });
    });

    return steps;
};

/**
 * Calculates the Active Index for a newly added section.
 * Usage: When adding a section, we want to navigate to it specifically.
 */
export const getNextSectionIndex = (sectionsState) => {
    // Current logic: Number of resolved steps.
    // Since the new section is appended, the index is (length - 1) of the NEW state.
    // Or (length) of the OLD state?
    // Usually called AFTER adding. So it's (length - 1).
    // But let's return the COUNT so caller can set setActiveIndex.
    
    // Actually, ResumeBuilder logic was: Title(0) + Info(1) + OrderLength.
    // If order has 2 items (Info, Summ), steps are 3 (Title, Info, Summ).
    // So index is length + 1.
    
    const order = getResolvedSectionOrder(sectionsState);
    
    // Deduct personal_info if it's in the order (since it's a static step 1)
    // But getSidebarSteps generates: Title, Info, [Rest...]
    // So distinct steps count = 2 + (Order.length - (1 if personal_info in order else 0))
    
    // Simpler: Just count the steps explicitly
    const steps = getSidebarSteps(sectionsState);
    return steps.length; // Active index for a hypothetically appended item would be this.
};
