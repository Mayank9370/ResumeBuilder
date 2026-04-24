import { asBlob } from 'html-docx-js-typescript';

/**
 * Generates a Word Document (DOCX) from resume data
 * Implementation: Uses html-docx-js-typescript to convert the preview HTML to DOCX
 */
export const generateResumeDocx = async (resumeData, templateId, options) => {
  try {
    console.log(`[Word Gen] Starting export for ${resumeData.title}`);

    // Strategy: We grab the Rendered HTML from the DOM if available, 
    // OR we construct a basic HTML representation.
    // Ideally, we grab the #resume-preview-container content.
    
    const resumeContainer = document.getElementById('resume-preview-container');
    
    let htmlContent = "";
    
    if (resumeContainer) {
        // Clone to avoid modifying live DOM
        const clone = resumeContainer.cloneNode(true);
        
        // Inline some critical styles if needed (optional)
        // For now, we take the innerHTML
        htmlContent = clone.outerHTML;
    } else {
        // Fallback: Minimal HTML construction
        htmlContent = `
            <h1>${resumeData.personal_info?.full_name || 'Resume'}</h1>
            <p>${resumeData.professional_summary || ''}</p>
        `;
    }

    // Wrap in full HTML document
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${resumeData.title}</title>
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `;

    // Convert to Blob
    // asBlob might return a Promise or Buffer depending on version, 
    // but in browser it returns a Blob/Promise<Blob>
    const blob = await asBlob(fullHtml);
    
    return blob;

  } catch (error) {
    console.error("[Word Gen] Error:", error);
    throw new Error("Failed to generate Word document");
  }
};
