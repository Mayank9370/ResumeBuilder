/**
 * Parses unstructured AI response strings into an array of options.
 * Handles patterns like "Option 1:", "1.", or simply splits by newlines if no pattern is found but multiple paragraphs exist.
 *
 * @param {string|string[]} aiResponse - The raw response from the AI.
 * @returns {string[]} - An array of clean option strings.
 */
export const parseAIResponse = (aiResponse) => {
    if (!aiResponse) return [];

    // 1. If it's already an array, just return it (maybe filter empty strings)
    if (Array.isArray(aiResponse)) {
        return aiResponse.filter(opt => typeof opt === 'string' && opt.trim().length > 0);
    }

    if (typeof aiResponse !== 'string') return [];

    const text = aiResponse.trim();

    // 2. Check for "Option X:" pattern (Case insensitive)
    // Regex explanation:
    // Split by "Option" followed by a number/letter and a colon/period/paren
    // e.g. "Option 1:", "Option A.", "Option 1)"
    const optionRegex = /(?:^|\n)\s*(?:Option\s+[0-9A-Z]+[:.)]?)\s*/i;

    if (optionRegex.test(text)) {
        const split = text.split(optionRegex)
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        // If splitting resulted in multiple parts, return them
        if (split.length > 1) return split;
    }

    // 3. Check for numbered list pattern "1.", "2." ONLY if they are at start of lines
    // This is riskier because "5 years experience" might match "5."
    // So we require at least two such markers to believe it's a list.
    const listRegex = /(?:^|\n)\s*(?:\d+\.)\s+/;
    const matches = text.match(new RegExp(listRegex, 'g'));
    
    if (matches && matches.length >= 2) {
         const split = text.split(listRegex)
            .map(s => s.trim())
            .filter(s => s.length > 0);
         if (split.length > 1) return split;
    }

    // 4. Fallback: Return original text as single option
    return [text];
};
