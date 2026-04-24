import React from "react";
import { useParams } from "react-router-dom";
import ResumePreview from "@/modules/resume-builder/components/ResumePreview";
import { sampleResume } from "@/modules/resume-builder/constants/sampleResume";
import { maleSampleResume } from "@/modules/resume-builder/constants/maleSampleResume";
import { femaleSampleResume } from "@/modules/resume-builder/constants/femaleSampleResume";

const ServerResumePreview = () => {
  const { templateId } = useParams();

  // Check for enhanced sample data flag in sessionStorage
  const useEnhancedData =
    typeof window !== "undefined"
      ? sessionStorage.getItem("useEnhancedSampleData")
      : null;

  // Check for full custom data object (injected by preview generator)
  const customPreviewData =
    typeof window !== "undefined"
      ? sessionStorage.getItem("customPreviewData")
      : null;

  // Select appropriate sample data
  let resumeData = sampleResume;

  if (customPreviewData) {
    try {
      resumeData = JSON.parse(customPreviewData);
    } catch (e) {
      console.error("Failed to parse custom preview data", e);
    }
  } else if (useEnhancedData === "custom") {
    // Prevent fallback to sampleResume if we expect custom data but it's not ready
    return <div>Loading Preview Data...</div>;
  } else if (useEnhancedData === "male") {
    resumeData = maleSampleResume;
  } else if (useEnhancedData === "female") {
    resumeData = femaleSampleResume;
  }

  // Enforce A4 Print Styles specifically for this view
  return (
    <div
      className="print-mode"
      style={{
        margin: 0,
        padding: 0,
        width: "210mm",
        minHeight: "297mm",
        // 🔥 REMOVED: overflow: "hidden" was clipping content
        // ResumePage.jsx now correctly enforces overflow constraints
        // This wrapper should not interfere
      }}
    >
      <style>
        {`
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; background: white; }
            #root { margin: 0; padding: 0; }
            /* Hide any potential scrollbars */
            ::-webkit-scrollbar { display: none; }
            `}
      </style>

      <ResumePreview
        data={resumeData}
        template={templateId}
        accentColor="#2563EB"
        templateConfig={resumeData.formatting}
        classes="shadow-none" // Remove shadow for clean capture
        enableStore={false} // Force use of props data (bypass Redux)
        renderMode="PREVIEW_PRINT" // NEW: Enable strict preview rendering (no section suppression)
      />
      {new URLSearchParams(window.location.search).get("debug") === "true" && (
        <h1
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            color: "red",
            fontSize: "50px",
          }}
        >
          DEBUG MODE
        </h1>
      )}
    </div>
  );
};

export default ServerResumePreview;
