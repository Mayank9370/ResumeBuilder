import { useEffect, useMemo, useRef, useState } from "react";

import axios from "axios";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

// UTILS
import { useDispatch, useSelector } from "react-redux";
import { usePreviewData } from "@/modules/resume-builder/state/hooks"; // 🎯 FIX: Added usePreviewData
import { denormalizeState, normalizeResumeData } from "@/modules/resume-builder/state/normalizer";
import { getSidebarSteps } from "@/modules/resume-builder/state/OrderingAuthority"; // 🎯 AUTHORITY MODULE
import { addItem, addSection, loadResume } from "@/modules/resume-builder/state/resumeSlice"; // Import Action
import { generateResumeDocx } from "@/modules/resume-builder/utils/ResumeDocxGenerator";
import { hydrateParsedData } from "@/modules/resume-builder/utils/resumeHydrator";
import { loadTemplate } from "@/modules/resume-builder/utils/resumeTemplates";

// EXTRACTED COMPONENTS
import ResumeBuilderForm from "@/modules/resume-builder/pages/ResumeBuilderForm";
import ResumeBuilderModals from "@/modules/resume-builder/pages/ResumeBuilderModals";
import ResumeBuilderPreview from "@/modules/resume-builder/pages/ResumeBuilderPreview";
import ResumeBuilderSidebar from "@/modules/resume-builder/pages/ResumeBuilderSidebar";

// Styles
import "@/modules/resume-builder/styles/TemplateFixes.css";

const ResumeBuilder = () => {
  /* Updated to support template URL param */
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading: authLoading, fetchUser } = useAuth();

  /* Read template from URL query params (support both templateId and template for backward compatibility) */
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTemplate =
    searchParams.get("templateId") ||
    searchParams.get("template") ||
    "minimalist";

  // TOKEN GATING REMOVED as per request

  const isEditMode = !!resumeId;
  const backenUrl = import.meta.env.VITE_BASE_URL;

  const [resumeData, setResumeData] = useState({
    title: "Untitled Resume",
    template: initialTemplate,
    accent_color: "#2563EB",
    personal_info: {},
    professional_summary: "",
    sections_obj: {},
    section_order: [],
    formatting: {
      spacing_scale: 1.0,
      section_spacing: 1.0,
      paragraph_spacing: 0.5,
      header_spacing: 1.0,
      heading_scale: 1.0,
      subheading_scale: 1.0,
      font_family: "Inter",
    },
  });

  // Track window size for responsive logic
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showSectionPopup, setShowSectionPopup] = useState(false);

  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  // Phase V6.6: DOCX Warning State
  const [docxWarning, setDocxWarning] = useState(null); // { message, degradations: [] }

  // Resizable Columns State
  const [formWidth, setFormWidth] = useState(() => {
    const saved = localStorage.getItem("resumeBuilderFormWidth");
    return saved ? parseInt(saved, 10) : "50%";
  }); // percentage or pixel value
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);

  // Resize Handlers
  const startResizing = (e) => {
    isResizing.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none"; // Disable text selection while dragging
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "";
  };

  const resize = (e) => {
    if (!isResizing.current || !sidebarRef.current) return;

    const sidebarWidth = sidebarRef.current.getBoundingClientRect().width;
    const windowWidth = window.innerWidth;

    // Calculate new width relative to remaining space (window - sidebar)
    // But easier to just calculate absolute width from left edge
    const newFormWidthPixels = e.clientX - sidebarWidth;

    // Convert to percentage of total window width OR remaining width.
    // Let's stick to simple percentage of Viewport or relative pixels.
    // Actually, mixing px and % can be tricky. Let's use % of total width to be responsive?
    // Or simpler: Just set pixel width on the Form container, and let flexbox handle the rest.

    // Constraints
    const minFormWidth = 400;
    const minPreviewWidth = 400;
    const maxFormWidth = windowWidth - sidebarWidth - minPreviewWidth;

    if (
      newFormWidthPixels > minFormWidth &&
      newFormWidthPixels < maxFormWidth
    ) {
      // Store as percentage to be responsive? No, pixel is smoother for drag.
      // But if we want responsiveness, % is better.
      // Let's us simple PX for now, user can readjust.
      setFormWidth(newFormWidthPixels);
      localStorage.setItem("resumeBuilderFormWidth", newFormWidthPixels);
    }
  };

  // Preview Scaling
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    const calculateScale = () => {
      if (!previewContainerRef.current) return;

      const containerWidth = previewContainerRef.current.clientWidth;
      // A4 width in px at 96 DPI is approximately 794px + some padding margin
      const a4Width = 850; // 794px + margin

      // Calculate scale: if container is smaller than A4, scale down.
      // If larger, max out at 1 or slightly larger if desired.
      const newScale = Math.min(containerWidth / a4Width, 1);

      setPreviewScale(newScale > 0.3 ? newScale : 0.3); // Minimum scale to prevent disappearing
    };

    // Calculate initial scale
    calculateScale();

    // Recalculate on resize (window or panel resize)
    const observer = new ResizeObserver(calculateScale);
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }

    return () => observer.disconnect();
  }, [showStylePanel]); // Re-calc when panels change

  // Redux State Access
  const reduxState = useSelector((state) => state.resume);

  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const fetchResumeData = async () => {
      if (!resumeId) return;
      try {
        const res = await axios.get(`${backenUrl}/api/resumes/${resumeId}`, {
          withCredentials: true,
        });

        // HYDRATION FIX: Clean data before setting state
        const resume = hydrateParsedData(res.data.resume);

        // FORENSIC FIX: Prioritize URL Template (Split Brain Protection)
        // If URL has a templateId, it overrides the backend (which might be stale due to debounce)
        const urlTemplate =
          searchParams.get("templateId") || searchParams.get("template");
        if (urlTemplate && urlTemplate !== resume.template) {
          resume.template = urlTemplate;
        }

        const sections_obj = Object.fromEntries(
          resume.sections.map((s) => [s.id, s]),
        );

        const section_order = resume.sections.map((s) => s.id);

        setResumeData({
          ...resume,
          sections_obj,
          section_order,
        });

        // 🎯 ARCHITECTURE FIX: One-Way Hydration (Backend -> Redux)
        // We kill the bi-directional sync loop by dispatching ONCE here.
        // No more useResumeSync overwriting Redux state on re-renders.
        // 🎯 ARCHITECTURE FIX: One-Way Hydration (Backend -> Redux)
        // We kill the bi-directional sync loop by dispatching ONCE here.
        // No more useResumeSync overwriting Redux state on re-renders.
        const normalized = normalizeResumeData(resume);

        console.log("[RESUME BUILDER] Dispatching loadResume:", {
          originalSections: resume.sections?.length,
          normalizedSections: normalized.sections.allIds.length,
        });

        dispatch(loadResume(normalized));
      } catch (err) {
        toast.error("Failed to load resume");
      }
    };

    fetchResumeData();
  }, [resumeId, backenUrl]); // Correct: Only fetch on ID change or Mount.

  // 🎯 ARCHITECTURE FIX: Simplified Data Flow
  // Redux is the primary source of truth. Local state is fallback only.
  // Removed complex bidirectional sync effects that caused race conditions.

  // 🎯 ARCHITECTURE FIX: Simplified Data Flow
  // Redux is the primary source of truth for preview. Local state is fallback.
  const reduxPreviewData = usePreviewData();

  // Simple merge: Use Redux if hydrated, otherwise local state
  const previewData =
    reduxPreviewData?.sections?.length > 0
      ? { ...resumeData, ...reduxPreviewData }
      : resumeData;

  // Fetch Dynamic Template Config
  const [templateConfig, setTemplateConfig] = useState(null);

  useEffect(() => {
    const fetchTemplateConfig = async () => {
      // If template ID is long (UUID) and not one of the static ones, assume it's dynamic
      if (resumeData.template && resumeData.template.length > 20) {
        try {
          const res = await axios.get(
            `${backenUrl}/api/templates/${resumeData.template}`,
          );
          if (res.data.success && res.data.data.config) {
            const parsed =
              typeof res.data.data.config === "string"
                ? JSON.parse(res.data.data.config)
                : res.data.data.config;
            setTemplateConfig(parsed);
          }
        } catch (err) {
          console.error("Failed to fetch template config", err);
        }
      } else {
        setTemplateConfig(null);
      }
    };
    fetchTemplateConfig();
  }, [resumeData.template, backenUrl]);

  // PREVIEW CLICK HANDLER (Interactive Preview)
  const handleSectionClick = (sectionId) => {
    if (!sectionId) return; // Prevent empty string matching everything
    console.log("Section Clicked:", sectionId);

    // 1. Find the step index that corresponds to this sectionId
    let stepIndex = formSteps.findIndex((step) => step.key === sectionId);

    // 2. Fuzzy Match Fallback
    if (stepIndex === -1) {
      stepIndex = formSteps.findIndex((step) => {
        // Case A: ID match (one contains other)
        if (step.key.includes(sectionId) || sectionId.includes(step.key))
          return true;

        // Case B: Type Match (if sectionId is just 'experience' etc)
        // step.type might be 'experience'
        if (step.type === sectionId || step.key.includes(sectionId))
          return true;

        // Case C: Standard Types mapping
        if (sectionId === "education_item" && step.type === "education")
          return true;
        if (sectionId === "experience_item" && step.type === "experience")
          return true;

        return false;
      });
    }

    // 3. If valid, switch active index
    if (stepIndex !== -1) {
      setActiveIndex(stepIndex);
      // Optional: Auto-open the sidebar if strictly on mobile?
      if (!isDesktop) {
        // setShowMobilePreview(false); // Maybe switch back to edit mode?
      }
    } else {
      console.warn(
        `[Navigation] Could not find form step for section: ${sectionId}`,
      );
    }
  };

  // 🎯 AUTHORITY: Centralized Sidebar Steps Calculation
  // We use the Redux state as the Single Source of Truth for structure.
  // resumeData provides text content, but Redux provides the ORDER.
  const formSteps = useMemo(() => {
    // Fallback if Redux not yet ready
    const sectionsState = reduxState?.sections;
    if (!sectionsState) {
      return [
        { key: "title", label: "Resume Title", type: "static" },
        { key: "personal_info", label: "Personal Information", type: "static" },
      ];
    }
    return getSidebarSteps(sectionsState);
  }, [reduxState?.sections]);

  const activeStep = formSteps[activeIndex] || formSteps[0]; // Fallback to 0 if out of bounds

  const nextStep = () =>
    activeIndex < formSteps.length - 1 && setActiveIndex(activeIndex + 1);
  const prevStep = () => activeIndex > 0 && setActiveIndex(activeIndex - 1);

  // CREATE NEW SECTION
  const createSection = (type) => {
    try {
      console.log("[CREATE SECTION] resumeData State:", {
        pInfo: resumeData.personal_info,
        pInfoKeys: Object.keys(resumeData.personal_info || {}),
        sectionOrder: resumeData.section_order.length,
      });

      // 🛡️ JIT Hydration Check: Ensure Redux is ready and VALID before we append
      // This covers the race condition where the Auto-Heal effect hasn't run yet
      const isReduxInvalid =
        !reduxState?.sections?.allIds ||
        reduxState.sections.allIds.length === 0 ||
        !reduxState.sections.byId["personal_info"];

      if (isReduxInvalid && resumeData.section_order.length > 0) {
        console.warn(
          "[CREATE SECTION] JIT Hydration triggered (Invalid State Detected)",
        );
        const normalized = normalizeResumeData(resumeData);
        dispatch(loadResume(normalized));
      }

      // 1. Prepare Initial Data with IDs
      let sectionId = `sec-${type}-${Date.now()}`;
      let initialItems = [];

      if (type === "project") {
        initialItems = [
          {
            id: `proj-${Date.now()}`,
            name: "",
            type: "",
            role: "",
            tech: "",
            start_date: "",
            end_date: "",
            is_current: false,
            link: "",
            description: "",
            bullets: [""],
          },
        ];
      } else if (type === "custom") {
        initialItems = [
          {
            id: `cust-${Date.now()}`,
            title: "",
            subtitle: "",
            description: [""],
            date: "",
          },
        ];
      } else if (type === "summary") {
        // 🎯 FIX: Singleton Professional Summary
        if (resumeData.sections_obj["professional_summary"]) {
          toast.error("Professional Summary already exists!");
          return;
        }
        sectionId = "professional_summary";
        // Try to recover content from root legacy property if available
        initialItems = [
          {
            id: "summary_item",
            content: resumeData.professional_summary || "",
          },
        ];
      } else if (type !== "skills") {
        // Generic Fallback (Experience, Education, etc usually start empty or with one empty item)
        // Let's give them a unique ID just in case
        initialItems = [{ id: `item-${Date.now()}` }];
      }

      // Skills usually start empty

      const newSection = {
        id: sectionId,
        type,
        title: type.charAt(0).toUpperCase() + type.slice(1),
        data: initialItems,
      };

      // 2. Add to Local State (Legacy)
      setResumeData((prev) => ({
        ...prev,
        sections_obj: { ...prev.sections_obj, [sectionId]: newSection },
        section_order: [...prev.section_order, sectionId],
      }));

      // 3. Dispatch to Redux Store (V2 Sync)
      // a) Add Section
      dispatch(
        addSection({
          id: sectionId,
          type: type,
          title: newSection.title,
        }),
      );

      // b) Add Initial Items
      initialItems.forEach((item) => {
        dispatch(
          addItem({
            sectionId: sectionId,
            item: item,
          }),
        );
      });

      // 4. Update UI
      // 🎯 AUTHORITY: Predict new index based on current steps count.
      // New section adds 1 step.
      const targetIndex = formSteps.length;

      setTimeout(() => {
        setActiveIndex(targetIndex);
      }, 100);

      setShowSectionPopup(false);
      toast.success(`Checking ${type} section...`);
    } catch (err) {
      console.error("Create Section Error:", err);
      toast.error("Failed to create section: " + err.message);
    }
  };

  // SAVE STATUS STATE
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, saved, error
  const [lastSaved, setLastSaved] = useState(null);

  // Autosave Logic
  useEffect(() => {
    if (!resumeId && !user) return; // Don't autosave if new and not logged properly? Actually new resume needs explicit create first?
    // Requirement says: "Resume creation... Autosave & persistence".
    // If it's a new resume (no resumeId), we might want to wait for the first "Create" click or create it automatically?
    // Current logic: Manual `saveResume` handles Create.
    // Strategy: If isEditMode, autosave. If new, maybe autosave after title change?
    // Safe bet: Autosave only works when `resumeId` exists (Edit Mode).
    // Implementation Plan says "Manual save handles Create".
    // So validation: "All changes saved" implies we are in edit mode.

    if (!isEditMode) return;

    const timer = setTimeout(() => {
      if (saveStatus !== "error") {
        // Don't loop save if hard error
        saveResume(true); // true = isAutosave
      }
    }, 2000); // 2s debounce

    return () => clearTimeout(timer);
  }, [resumeData, isEditMode]); // Dependency on resumeData triggers this.

  // SAVE RESUME (Updated for V2 Redux)
  const saveResume = async (isAutosave = false) => {
    // Prefer Redux State for Saving
    let dataToSave = resumeData;
    if (
      reduxState &&
      reduxState.metadata &&
      reduxState.sections &&
      reduxState.sections.allIds.length > 0
    ) {
      dataToSave = denormalizeState(reduxState);
    }

    // Ensure ID is present
    if (!dataToSave.id && resumeData.id) dataToSave.id = resumeData.id;

    // Prevent double saves
    if (isAutosave) {
      setSaveStatus("saving");
    }

    // Format for backend
    // If we used Redux, dataToSave IS the structured data.
    // If not, we construct it:
    let formatted = dataToSave;
    if (dataToSave === resumeData) {
      formatted = {
        ...resumeData,
        sections: resumeData.section_order.map(
          (id) => resumeData.sections_obj[id],
        ),
      };
    }

    // DETECT IMAGE FILE (New Feature)
    const personalInfo = formatted.personal_info || {};
    const hasImageFile =
      personalInfo.image instanceof File || personalInfo.image instanceof Blob;

    let payload = formatted;
    let headers = { withCredentials: true };

    if (hasImageFile) {
      console.log("[SAVE RESUME] Image File Detected. Switching to FormData.");
      const formData = new FormData();

      // 1. Append Image
      formData.append("image", personalInfo.image);

      // 2. Append JSON payload (excluding image to avoid circular error or double send)
      // We clone to remove the File object from the JSON string
      const jsonPayload = { ...formatted };
      jsonPayload.personal_info = { ...personalInfo, image: undefined }; // Remove binary from JSON

      // Append all top-level keys
      Object.keys(jsonPayload).forEach((key) => {
        if (typeof jsonPayload[key] === "object") {
          formData.append(key, JSON.stringify(jsonPayload[key]));
        } else {
          formData.append(key, jsonPayload[key]);
        }
      });

      payload = formData;
      headers = {
        withCredentials: true,
        "Content-Type": "multipart/form-data",
      };
    }

    try {
      if (isEditMode) {
        // PATCH
        await axios.patch(
          `${backenUrl}/api/resumes/${resumeId}`,
          payload,
          headers,
        );
        setSaveStatus("saved");
        setLastSaved(new Date());
        if (!isAutosave) toast.success("Resume Updated!");
      } else {
        // POST (Create Mode)
        const res = await axios.post(
          `${backenUrl}/api/resumes`,
          payload,
          headers,
        );
        // Switch to edit mode
        const newId = res.data.resume?._id || res.data._id;
        if (newId) {
          toast.success("Resume Created!");
          navigate(`/resume/builder/${newId}`, { replace: true });
        }
        await fetchUser();
      }
    } catch (err) {
      console.error("Save error", err);
      setSaveStatus("error");
      if (!isAutosave)
        toast.error(
          "Saving failed: " + (err.response?.data?.message || err.message),
        );
    }
  };

  // Backend PDF Download (Smart Apply Method)
  const handleDownloadPDF = async () => {
    const toastId = toast.loading(
      "Generating PDF... This may take a few seconds",
    );

    try {
      const element = document.getElementById("resume-preview-container");
      if (!element) {
        toast.error("Preview element missing", { id: toastId });
        return;
      }

      // Clone and sanitize
      const clone = element.cloneNode(true);

      // ✅ CRITICAL: Add print-mode class to enable pagination rules
      clone.classList.add("print-mode");

      clone.style.transform = "none";
      clone.style.boxShadow = "none";
      clone.style.margin = "0";
      clone.style.border = "none";

      const allElements = clone.querySelectorAll("*");
      allElements.forEach((el) => {
        // Safe check for className (SVG elements have non-string className)
        const hasShadowClass =
          typeof el.className === "string" && el.className.includes("shadow");
        if (el.classList.contains("shadow-2xl") || hasShadowClass) {
          el.classList.remove(
            "shadow-2xl",
            "shadow-xl",
            "shadow-lg",
            "shadow-md",
            "shadow-sm",
            "shadow",
          );
          el.style.boxShadow = "none";
          el.style.textShadow = "none";
        }
        el.style.filter = "none";
        el.style.backdropFilter = "none";
        el.style.willChange = "auto";
      });

      // 🔥 CRITICAL FIX: Convert Blob URLs to Base64
      // Puppeteer cannot access client-side 'blob:' URLs. We must embed them as Data URIs.
      const images = Array.from(clone.querySelectorAll("img"));
      console.log(`[PDF] Found ${images.length} images to process`);

      await Promise.all(
        images.map(async (img) => {
          try {
            const src = img.getAttribute("src");
            // Only convert blobs or local object URLs.
            // We can also convert external URLs if we want to be safe against firewall issues.
            if (
              src &&
              (src.startsWith("blob:") || src.startsWith("http")) &&
              !src.startsWith("data:")
            ) {
              console.log(`[PDF] Converting image: ${src.substring(0, 50)}...`);

              const response = await fetch(src);
              const blob = await response.blob();

              const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });

              img.setAttribute("src", base64);
              console.log("[PDF] Conversion successful");
            }
          } catch (err) {
            console.warn(`[PDF] Failed to convert image: ${img.src}`, err);
            // Non-fatal: Leave original src (might work if public URL)
          }
        }),
      );

      // PDF OPTIMIZATION: Fix Page Breaks & Remove Gaps
      // The preview has 'mb-10' (40px) visual gap. We must strip this for PDF.
      Array.from(clone.children).forEach((pageEl, index) => {
        if (pageEl.classList.contains("resume-page")) {
          pageEl.classList.remove("mb-10"); // Remove visual gap
          pageEl.style.marginBottom = "0px";
          pageEl.style.pageBreakInside = "avoid";

          // Force Page Break
          if (index < clone.children.length - 1) {
            pageEl.style.pageBreakAfter = "always";
            pageEl.style.breakAfter = "page";
          }
        }
      });

      // 🔥 CRITICAL FIX: Remove hidden measurement containers from clone
      const measureContainers = clone.querySelectorAll(".measure-container");
      measureContainers.forEach((el) => el.remove());

      const contentHtml = clone.outerHTML;
      const baseUrl = window.location.origin;
      const styles = Array.from(
        document.querySelectorAll('link[rel="stylesheet"], style'),
      )
        .map((el) => el.outerHTML)
        .join("\n");

      const printStyles = `
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
          .resume-page { page-break-inside: avoid; break-inside: avoid; }
          .resume-page:last-child { page-break-after: auto; break-after: auto; }
        }
      `;

      const head = `<head>
        <base href="${baseUrl}/" />
        <meta charset="UTF-8" />
        ${styles}
        <style>${printStyles}</style>
      </head>`;

      const fullHtml = `<!DOCTYPE html>
      <html>
        ${head}
        <body style="margin: 0; padding: 0; background: white;">
          <div id="root" style="width: 210mm; margin: 0 auto; padding: 0; overflow: visible;">
            ${contentHtml}
          </div>
        </body>
      </html>`;

      // Send to backend
      const response = await axios.post(
        `${backenUrl}/api/download/pdf`,
        { html: fullHtml },
        { responseType: "blob", withCredentials: true },
      );

      console.log("[PDF Download] Response Type:", response.data.type);
      console.log("[PDF Download] Response Size:", response.data.size);

      // ✅ CRITICAL: Check if response is actually a PDF blob (not error JSON)
      if (response.data.type === "application/json") {
        const text = await response.data.text();
        const error = JSON.parse(text);
        throw new Error(error.message || "PDF generation failed on server");
      }

      // Create blob with explicit PDF MIME type
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const filename = `${resumeData.title || "Resume"}.pdf`;
      saveAs(pdfBlob, filename);
      toast.success("PDF Downloaded Successfully!", { id: toastId });
    } catch (e) {
      console.error("PDF Error:", e);
      toast.error(
        "PDF generation failed: " + (e.response?.data?.message || e.message),
        { id: toastId },
      );
    }
  };

  const AutosaveIndicator = () => {
    if (!isEditMode) return null; // Don't show for unsaved new resume

    switch (saveStatus) {
      case "saving":
        return (
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <span className="animate-spin">⟳</span> Saving...
          </div>
        );
      case "saved":
        return (
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <span className="text-green-500">✓</span> Saved{" "}
            {lastSaved ? "just now" : ""}
          </div>
        );
      case "error":
        return (
          <div className="text-xs text-red-500 font-bold flex items-center gap-1">
            ⚠ Save Failed
          </div>
        );
      default:
        return null;
    }
  };
  const handleSaveToDocuments = async () => {
    // FIX: Use correct container ID from ResumePreview.jsx
    const printContent = document.getElementById("resume-preview-container");
    if (!printContent) {
      toast.error("Resume Preview not found.");
      return;
    }

    const exportToast = toast.loading("Exporting to My Documents...");

    try {
      // 1. Capture HTML with Styles
      const styles = Array.from(
        document.querySelectorAll('style, link[rel="stylesheet"]'),
      )
        .map((node) => node.outerHTML)
        .join("");

      const htmlContent = `
    <html>
      <head>
        <title>${resumeData.title || "Resume"}</title>
        ${styles}
        <style>
          @page {margin: 0; size: auto; }
          body {
            margin: 0;
          padding: 0;
          background: white;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact; 
              }
          /* Target the Container */
          #resume-preview-container {
            width: 100%;
          margin: 0;
          box-shadow: none !important;
          transform: none !important;
              }
        </style>
      </head>
      <body>
        ${printContent.outerHTML}
      </body>
    </html>
    `;

      // 2. Send to Backend
      const res = await axios.post(
        `${backenUrl}/api/resumes/export-to-source-resume`,
        {
          htmlContent,
          title: resumeData.title,
          resumeId: resumeId,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success("Saved to Library — Available in My Resumes for reuse!", {
          id: exportToast,
          duration: 4000,
        });
      }
    } catch (err) {
      console.error("Export failed", err);
      toast.error(err.response?.data?.message || "Export failed", {
        id: exportToast,
      });
    }
  };

  const handleDownloadWord = async (forceByUser = false) => {
    // 1. Resolve Template & Capability
    const templateId = resumeData.template || "minimalist";
    const template = await loadTemplate(templateId);

    if (!template) {
      toast.error("Template definition missing.");
      return;
    }

    // 2. Fail-Safe: Default to NONE if missing (V6.6 Rule)
    const docxSupport = template.docx ? template.docx.supported : "NONE";

    // 3. Check for NONE
    if (docxSupport === "NONE") {
      toast.error("DOCX Export is not available for this template yet.");
      return;
    }

    // 4. Check for PARTIAL (Warning)
    if (docxSupport === "PARTIAL" && !forceByUser) {
      setDocxWarning({
        templateName: template.name,
        degradations: template.docx.degradation || [
          "Visual elements may vary in Word.",
        ],
      });
      return;
    }

    // 5. Proceed to Generate
    const downloadToast = toast.loading("Generating optimized DOCX...");
    try {
      const blob = await generateResumeDocx(resumeData, templateId, {
        accentColor: resumeData.accent_color,
      });
      saveAs(blob, `${resumeData.title || "resume"}.docx`);
      toast.success("Downloaded as Word", { id: downloadToast });

      // Log Success
      console.log(`[DOCX] Export Success: ${templateId} (${docxSupport})`);
    } catch (e) {
      console.error(e);
      toast.error(`Word download failed: ${e.message}`, { id: downloadToast });
    }
  };

  // FORENSIC: Style State Tracking
  useEffect(() => {
    console.log(`[BUILDER STATE] Accent Color: ${resumeData.accent_color}`);
    console.log(
      `[BUILDER STATE] Formatting:`,
      JSON.stringify(resumeData.formatting),
    );
  }, [resumeData.accent_color, resumeData.formatting]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-inter">
      {/* 1. LEFT SIDEBAR (Navigation) */}
      <ResumeBuilderSidebar
        sidebarRef={sidebarRef}
        formSteps={formSteps}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        showMobilePreview={showMobilePreview}
        setShowMobilePreview={setShowMobilePreview}
      />

      <ResumeBuilderForm
        showMobilePreview={showMobilePreview}
        isDesktop={isDesktop}
        formWidth={formWidth}
        showStylePanel={showStylePanel}
        // 🎯 FIX: Pass previewData (Redux-Synced) instead of stale resumeData
        // This ensures section_order and sections_obj are always in sync
        resumeData={previewData}
        setResumeData={setResumeData}
        activeStep={activeStep}
        activeIndex={activeIndex}
        formSteps={formSteps}
        isEditMode={isEditMode}
        setShowSectionPopup={setShowSectionPopup}
        setShowStylePanel={setShowStylePanel}
        prevStep={prevStep}
        nextStep={nextStep}
        saveResume={saveResume}
      />

      {/* DRAG HANDLE */}
      <div
        className="hidden lg:flex w-1.5 hover:w-2 bg-slate-200 hover:bg-blue-500 cursor-col-resize z-50 transition-all duration-150 items-center justify-center group"
        onMouseDown={startResizing}
      >
        <div className="h-8 w-0.5 bg-slate-400 group-hover:bg-white rounded-full" />
      </div>

      {/* 3. RIGHT PREVIEW SECTION - Remaining Width */}
      <ResumeBuilderPreview
        showMobilePreview={showMobilePreview}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        isEditMode={isEditMode}
        resumeData={previewData} // 🎯 FIX: Use merged data with Redux section order
        setResumeData={setResumeData} // Added for Quick Switcher
        setShowTemplateModal={setShowTemplateModal}
        setShowStylePanel={setShowStylePanel}
        showStylePanel={showStylePanel}
        handleDownloadPDF={handleDownloadPDF}
        handleDownloadWord={handleDownloadWord}
        handleSaveToDocuments={handleSaveToDocuments}
        saveResume={saveResume}
        previewContainerRef={previewContainerRef}
        previewScale={previewScale}
        handleSectionClick={handleSectionClick}
        templateConfig={templateConfig}
      />

      {/* MODALS */}
      <ResumeBuilderModals
        showSectionPopup={showSectionPopup}
        setShowSectionPopup={setShowSectionPopup}
        createSection={createSection}
        showTemplateModal={showTemplateModal}
        setShowTemplateModal={setShowTemplateModal}
        resumeData={resumeData}
        setResumeData={setResumeData}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        docxWarning={docxWarning}
        setDocxWarning={setDocxWarning}
        handleDownloadWord={handleDownloadWord}
      />
    </div>
  );
};

export default ResumeBuilder;
// End of file
