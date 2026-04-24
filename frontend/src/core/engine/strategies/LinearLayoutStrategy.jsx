import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
import ParticleRenderer from "@/core/engine/components/ParticleRenderer";
import ResumePage from "@/core/engine/components/ResumePage";
import { applyFormattingContract } from "@/modules/resume-builder/utils/newAtsFormattingContract";
import { getContrastColor } from "@/modules/resume-builder/utils/contrastUtils";
import { getFontClass } from "@/shared/utils/fontUtils";
import { waitForFonts } from "@/core/engine/pagination/utils/waitForFonts";
import { paginateParticles } from "@/core/engine/pagination/paginateParticles";
import { A4_WIDTH_PX, A4_HEIGHT_PX } from "@/core/engine/pagination/utils/constants";
import useFormattingContract from "@/core/engine/hooks/useFormattingContract";

const LinearLayoutStrategy = ({
  data,
  template,
  onUpdate,
  onSectionClick,
  accentColor,
  formatting,
  mode,
  renderMode, // NEW: Propagate renderMode
}) => {
  // 1. Style Resolution
  const processedStyles = useMemo(() => {
    if (!template || !template.styles) return {};
    return template.styles;
  }, [template]);

  const styles = processedStyles;

  // 2a. State & Refs (Missing Declarations Restored)
  const [pages, setPages] = useState([]);
  const measureRef = useRef(null);
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  const paginationTimeoutRef = useRef(null);

  // 2. Data Preparation
  const renderData = useMemo(() => {
    if (!data) return null;
    if (mode === "new-ats") {
      return applyFormattingContract(data);
    }
    return data;
  }, [data, mode]);

  // 3. Flatten Data to Particles
  const flatBlocks = useMemo(() => {
    if (!renderData) return [];

    const blocks = [];

    // HEADER
    blocks.push({ type: "header", data: renderData.personal_info || {} });

    // SUMMARY
    if (renderData.professional_summary) {
      const summaryContent =
        typeof renderData.professional_summary === "string"
          ? renderData.professional_summary
          : Array.isArray(renderData.professional_summary)
            ? renderData.professional_summary.join(" ")
            : "";

      if (summaryContent) {
        blocks.push({
          type: "summary_title",
          title: renderData.summary_title || "Professional Summary",
        });
        blocks.push({ type: "summary_content", content: summaryContent });
      }
    }

    // SECTIONS
    if (Array.isArray(renderData.sections)) {
      renderData.sections.forEach((section) => {
        if (section.id === "professional_summary" || section.id === "summary")
          return;

        blocks.push({
          type: "section_title",
          title: section.title,
          id: section.id,
          keepWithNext: true,
        });

        // 🎯 NEW: Special handling for Skills aggregate (Linear Strategy)
        const isSkillSection = section.type === 'skills' || section.type === 'technical_skills' || section.id === 'skills' || section.id === 'technical_skills' || (section.type && section.type.toLowerCase().includes('skill')) || (section.id && section.id.toLowerCase().includes('skill'));

        if (isSkillSection) {
          let tags = [];
          let bullets = [];
          const candidates = section.items || section.data || [];

          if (Array.isArray(candidates)) {
            candidates.forEach(item => {
              if (typeof item === 'string') {
                tags.push(item);
              } else if (typeof item === 'object' && item !== null) {
                if (item.isBullet === true) {
                  bullets.push(item);
                } else if (item.name || item.content || item.value) {
                  tags.push(item);
                } else if (item.id && Object.keys(item).length === 1) {
                  // Skip empty
                } else {
                  tags.push(item);
                }
              }
            });
          } else if (typeof candidates === 'object' && candidates !== null) {
            if (Array.isArray(candidates.items)) candidates.items.forEach(i => tags.push(i));
            if (Array.isArray(candidates.bullets)) candidates.bullets.forEach(b => bullets.push(b));
          }

          if (tags.length > 0 || bullets.length > 0) {
            blocks.push({
              type: "skills_composite",
              tags,
              bullets,
              sectionId: section.id,
              sectionType: section.type,
            });
          } else {
            blocks.push({
              type: "simple_content",
              content: candidates,
              sectionId: section.id,
              sectionType: section.type,
            });
          }
          return; // Skip standard item iteration
        }

        if (Array.isArray(section.items)) {
          section.items.forEach((item, idx) => {
            if (item.type === "ListEntry") {
              blocks.push({
                type: "particle_list_entry",
                label: item.item,
                value: item.value,
                sectionId: section.id,
                idx,
              });
            } else if (item.type === "NarrativeEntry") {
              blocks.push({
                type: "particle_narrative",
                content: item.content,
                sectionId: section.id,
                idx,
              });
            } else {
              blocks.push({
                type: "particle_std_header",
                header: item.header,
                subheader: item.subheader,
                meta: item.meta,
                url: item.url,
                sectionId: section.id,
                idx,
                keepWithNext: true,
              });
              if (Array.isArray(item.bullets)) {
                item.bullets.forEach((b, bIdx) => {
                  blocks.push({
                    type: "particle_bullet",
                    content: b,
                    sectionId: section.id,
                    idx,
                    bIdx,
                  });
                });
              }
            }
          });
        } else if (Array.isArray(section.data)) {
          // Classic Fallback
          section.data.forEach((item, idx) => {
            if (section.type === "experience") {
              blocks.push({
                type: "particle_exp_header",
                item,
                sectionId: section.id,
                idx,
                keepWithNext: true,
              });
              const desc = item.description;
              if (desc && typeof desc === "string") {
                blocks.push({
                  type: "particle_narrative",
                  content: desc,
                  sectionId: section.id,
                  idx,

                });
              }
              if (Array.isArray(item.bullets)) {
                item.bullets.forEach((b, bIdx) => {
                  blocks.push({
                    type: "particle_bullet",
                    content: b,
                    sectionId: section.id,
                    idx,
                    bIdx,
                  });
                });
              }
            } else if (section.type === "project") {
              blocks.push({
                type: "particle_std_header",
                header: item.name,
                subheader: item.role || item.type,
                meta: `${item.start_date || ""} ${item.end_date || item.is_current ? " - " + (item.is_current ? "Present" : item.end_date) : ""}`.trim(),
                url: item.link,
                sectionId: section.id,
                idx,
                keepWithNext: true,
              });

              if (item.tech) {
                blocks.push({
                  type: "particle_list_entry",
                  label: "Tech Stack",
                  value: item.tech,
                  sectionId: section.id,
                  idx,
                });
              }

              const desc = item.description;
              if (desc && typeof desc === "string") {
                blocks.push({
                  type: "particle_narrative",
                  content: desc,
                  sectionId: section.id,
                  idx,

                });
              }

              if (Array.isArray(item.bullets)) {
                item.bullets.forEach((b, bIdx) => {
                  blocks.push({
                    type: "particle_bullet",
                    content: b,
                    sectionId: section.id,
                    idx,
                    bIdx,
                  });
                });
              }
            } else if (section.type === "education") {
              blocks.push({
                type: "edu_item",
                item,
                sectionId: section.id,
                idx,
              });
            } else if (section.type === "certifications") {
              blocks.push({
                type: "cert_item",
                item,
                sectionId: section.id,
                idx,
              });
            } else {
              blocks.push({
                type: "simple_content",
                content: item,
                sectionId: section.id,
                sectionType: section.type,
              });
            }
          });
        }
      });
    }

    return blocks;
  }, [renderData]);

  useLayoutEffect(() => {
    const runPagination = async () => {
      if (!measureRef.current) return;

      // 🔥 CRITICAL FIX: Wait for fonts to load before measuring
      await waitForFonts();

      // 🎯 PHASE 2: Wait for images and layout stability
      const images = measureRef.current.querySelectorAll("img");
      if (images?.length > 0) {
        await Promise.all(
          Array.from(images).map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 500);
              }),
          ),
        );
      }

      // stabilization RAF
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );

      // Guard against unmount during async wait
      if (!measureRef.current) return;

      renderCount.current++;
      const now = Date.now();
      const timeDiff = now - lastRenderTime.current;
      lastRenderTime.current = now;

      console.log(
        `[LAYOUT] LinearStrategy | Cycle #${renderCount.current} | TimeDelta: ${timeDiff}ms | Particles: ${flatBlocks.length}`,
      );

      if (timeDiff < 50 && renderCount.current > 5) {
        console.error(
          "[LAYOUT] CRITICAL: TIGHT RENDER LOOP DETECTED. Stopping measurement to prevent freeze.",
        );
        // return; // Uncomment to safe-break
      }

      const newPages = await paginateParticles(measureRef, flatBlocks, template);
      setPages(newPages);
    };

    // Debounce pagination to prevent excessive recalculations
    const debouncedRunPagination = () => {
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }

      paginationTimeoutRef.current = setTimeout(() => {
        runPagination();
      }, 150); // 150ms debounce
    };

    debouncedRunPagination();

    // Cleanup: clear pending timeout on unmount or dependency change
    return () => {
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }
    };
  }, [flatBlocks, template, formatting, accentColor, renderMode]);

  // 5. CSS Generation (Phase B4-S Variable Contract)
  // 🎯 STANDARDIZATION: Use Centralized Hook
  const { tokens: containerStyles, fontClass } = useFormattingContract(
    formatting,
    accentColor,
  );

  const fmt = {
    font_family: fontClass, // Maintain for class injection
    zoom: formatting?.body_scale || 1, // Maintain for render logic if needed
  };

  const templateStyle = `
                /* ROOT & SCALING */
                .resume-page {
                    zoom: var(--resume-scale);
                }

                /* SEMANTIC CLASS REGISTRY */
                .particle-section-title {
                    font-size: var(--resume-font-size-h2);
                    color: var(--resume-color-header);
                    margin-bottom: var(--resume-spacing-header);
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .particle-job-title {
                    font-size: var(--resume-font-size-h3);
                    color: var(--resume-color-title);
                    font-weight: 700;
                }
                .particle-narrative {
                    font-size: var(--resume-font-size-body);
                    color: var(--resume-color-text);
                    line-height: var(--resume-line-height-body);
                    margin-bottom: var(--resume-spacing-paragraph);
                }
                /* Rich Text List Support */
                .particle-narrative ul { list-style-type: disc; padding-left: 1.25rem; margin-bottom: var(--resume-spacing-paragraph); }
                .particle-narrative ol { list-style-type: decimal; padding-left: 1.25rem; margin-bottom: var(--resume-spacing-paragraph); }
                .particle-narrative li { margin-bottom: calc(var(--resume-spacing-paragraph) * 0.5); }
                .particle-narrative p { margin-bottom: var(--resume-spacing-paragraph); }
                
                .particle-narrative p:last-child, .particle-narrative ul:last-child, .particle-narrative ol:last-child, .particle-narrative li:last-child { margin-bottom: 0 !important; }
                .particle-section-container { 
                    margin-bottom: var(--resume-spacing-section); 
                }
                /* Section Spacing: Applied to the top of the title wrapper to separate from previous section */
                .particle-section-discriminator { 
                    margin-top: var(--resume-spacing-section);
                }

                .particle-entry-container { 
                    margin-top: var(--resume-spacing-entry); 
                }
                .particle-bullet-item { 
                    margin-bottom: var(--resume-spacing-paragraph); 
                }
                .particle-meta { 
                    color: var(--resume-color-muted); 
                    font-size: var(--resume-font-size-h4); 
                }

                /* LEGACY OVERRIDES (Backward Compatibility) */
                .resume-accent-text { color: var(--resume-color-accent) !important; }
                .resume-accent-bg { background-color: var(--resume-color-accent) !important; }
                .resume-accent-border { border-color: var(--resume-color-accent) !important; }
                .resume-accent-marker { color: var(--resume-color-accent) !important; }
                .resume-accent-marker li::marker { color: var(--resume-color-accent) !important; }

                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
    `;

  // 6. Render
  return (
    <div className={fmt.font_family} style={containerStyles}>
      <style>{templateStyle}</style>

      {/* Hidden Measure Container */}
      <div
        ref={measureRef}
        className={`measure-container resume-page absolute top-0 left-0 invisible -z-50`}
        style={{
          width: `${A4_WIDTH_PX}px`,
          height: "auto",
          minHeight: "auto",
          padding: "var(--resume-padding-safe-y) var(--resume-padding-safe-x)"
        }}
      >
        {flatBlocks.map((block, i) => (
          <ParticleRenderer
            key={`measure-${i}`}
            block={block}
            styles={styles}
            mode={mode}
          />
        ))}
      </div>

      {/* Visible Pages */}
      {pages.length === 0 ? (
        <div
          className={`resume-page mx-auto text-left origin-top ${styles.container || "bg-white shadow-2xl"}`}
          style={{
            width: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`,
            padding: "var(--resume-padding-safe-y) var(--resume-padding-safe-x)",
          }}
        >
          <div className="flex items-center justify-center h-full text-gray-300">
            Layouting...
          </div>
        </div>
      ) : (
        pages.map((page, idx) => (
          <ResumePage
            key={idx}
            id={idx === 0 ? "resume-preview" : undefined}
            page={page}
            styles={styles}
            pageIndex={idx}
            totalPageCount={pages.length}
            onUpdate={onUpdate}
            onSectionClick={onSectionClick}
            mode={mode}
            fontClass={fmt.font_family} // Pass Font Class
            style={{
              padding:
                "var(--resume-padding-safe-y) var(--resume-padding-safe-x)",
            }}
          />
        ))
      )}
    </div>
  );
};

export default LinearLayoutStrategy;
