import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
import ParticleRenderer from "@/core/engine/components/ParticleRenderer";
import { applyFormattingContract } from "@/modules/resume-builder/utils/newAtsFormattingContract";
import { getFontClass } from "@/shared/utils/fontUtils";
import { waitForFonts } from "@/core/engine/pagination/utils/waitForFonts";
import { paginateDualColumn } from "@/core/engine/pagination/paginateDualColumn";
import { A4_WIDTH_PX, A4_HEIGHT_PX } from "@/core/engine/pagination/utils/constants";
import useFormattingContract from "@/core/engine/hooks/useFormattingContract";

/**
 * DualColumnLayoutStrategy
 *
 * A two-column layout engine that follows the same philosophy as LinearLayoutStrategy.
 * Splits resume sections into two independent vertical column stacks using
 * a template-defined columnMap configuration.
 *
 * Architecture:
 * - Same particle flattening as Linear
 * - Column assignment via template.columnMap
 * - Independent column measurement
 * - Dual-column pagination via paginateDualColumn
 * - Simple flexbox CSS (no absolute positioning, no floats)
 *
 * Does NOT modify the existing Linear engine or any other strategy.
 */
const DualColumnLayoutStrategy = ({
  data,
  template,
  onUpdate,
  onSectionClick,
  accentColor,
  formatting,
  mode,
  renderMode,
}) => {
  // ============================================
  // 1. STYLE RESOLUTION
  // ============================================
  const processedStyles = useMemo(() => {
    if (!template || !template.styles) return {};
    return template.styles;
  }, [template]);

  const styles = processedStyles;

  // ============================================
  // 2. STATE & REFS
  // ============================================
  const [pages, setPages] = useState([]);
  const headerMeasureRef = useRef(null);
  const leftMeasureRef = useRef(null);
  const rightMeasureRef = useRef(null);
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  const paginationTimeoutRef = useRef(null);

  // ============================================
  // 3. DATA PREPARATION
  // ============================================
  const renderData = useMemo(() => {
    if (!data) return null;
    if (mode === "new-ats") {
      return applyFormattingContract(data);
    }
    return data;
  }, [data, mode]);

  // ============================================
  // 4. COLUMN CONFIGURATION (from template)
  // ============================================
  const columnConfig = useMemo(() => {
    // Read column map from template config
    const map = template?.columnMap || {};
    const widths = template?.columnWidths || { left: "65%", right: "35%" };
    const gap = template?.columnGap || "30px";

    return { map, widths, gap };
  }, [template]);

  // ============================================
  // 5. FLATTEN DATA TO PARTICLES (same as Linear)
  // ============================================
  const flatBlocks = useMemo(() => {
    if (!renderData) return [];

    const blocks = [];

    // HEADER — always goes to header bucket, measured separately to calculate first-page offset
    // If the template specifies a specific column for the photo, extract it out of the regular header block.
    if (template?.photoColumn && renderData.personal_info) {
      blocks.push({
        type: "standalone_photo",
        data: renderData.personal_info,
        _column: template.photoColumn,
      });
      // push header without photo into the opposite column so it sits next to the photo
      blocks.push({
        type: "header_no_photo",
        data: renderData.personal_info,
        _column: template.photoColumn === "left" ? "right" : "left",
      });
    } else {
      blocks.push({
        type: "header",
        data: renderData.personal_info || {},
        _column: "header",
      });
    }

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
          _column:
            columnConfig.map["summary"] ||
            columnConfig.map["professional_summary"] ||
            "left",
          _sectionId: "summary",
        });
        blocks.push({
          type: "summary_content",
          content: summaryContent,
          _column:
            columnConfig.map["summary"] ||
            columnConfig.map["professional_summary"] ||
            "left",
          _sectionId: "summary",
        });
      }
    }

    // SECTIONS
    if (Array.isArray(renderData.sections)) {
      renderData.sections.forEach((section) => {
        if (section.id === "professional_summary" || section.id === "summary")
          return;

        // Resolve column for this section
        const col =
          columnConfig.map[section.id] ||
          columnConfig.map[section.type] ||
          "left";

        blocks.push({
          type: "section_title",
          title: section.title,
          id: section.id,
          keepWithNext: true,
          _column: col,
          _sectionId: section.id,
        });

        // Skills composite handling (same as Linear)
        const isSkillSection =
          section.type === "skills" ||
          section.type === "technical_skills" ||
          section.id === "skills" ||
          section.id === "technical_skills" ||
          (section.type && section.type.toLowerCase().includes("skill")) ||
          (section.id && section.id.toLowerCase().includes("skill"));

        if (isSkillSection) {
          let tags = [];
          let bullets = [];
          const candidates = section.items || section.data || [];

          if (Array.isArray(candidates)) {
            candidates.forEach((item) => {
              if (typeof item === "string") {
                tags.push(item);
              } else if (typeof item === "object" && item !== null) {
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
          } else if (typeof candidates === "object" && candidates !== null) {
            if (Array.isArray(candidates.items))
              candidates.items.forEach((i) => tags.push(i));
            if (Array.isArray(candidates.bullets))
              candidates.bullets.forEach((b) => bullets.push(b));
          }

          if (tags.length > 0 || bullets.length > 0) {
            blocks.push({
              type: "skills_composite",
              tags,
              bullets,
              sectionId: section.id,
              sectionType: section.type,
              _column: col,
              _sectionId: section.id,
            });
          } else {
            blocks.push({
              type: "simple_content",
              content: candidates,
              sectionId: section.id,
              sectionType: section.type,
              _column: col,
              _sectionId: section.id,
            });
          }
          return;
        }

        // Standard items
        if (Array.isArray(section.items)) {
          section.items.forEach((item, idx) => {
            if (item.type === "ListEntry") {
              blocks.push({
                type: "particle_list_entry",
                label: item.item,
                value: item.value,
                sectionId: section.id,
                idx,
                _column: col,
                _sectionId: section.id,
              });
            } else if (item.type === "NarrativeEntry") {
              blocks.push({
                type: "particle_narrative",
                content: item.content,
                sectionId: section.id,
                idx,
                _column: col,
                _sectionId: section.id,
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
                _column: col,
                _sectionId: section.id,
              });
              if (Array.isArray(item.bullets)) {
                item.bullets.forEach((b, bIdx) => {
                  blocks.push({
                    type: "particle_bullet",
                    content: b,
                    sectionId: section.id,
                    idx,
                    bIdx,
                    _column: col,
                    _sectionId: section.id,
                  });
                });
              }
            }
          });
        } else if (Array.isArray(section.data)) {
          // Classic fallback
          section.data.forEach((item, idx) => {
            if (section.type === "experience") {
              blocks.push({
                type: "particle_exp_header",
                item,
                sectionId: section.id,
                idx,
                keepWithNext: true,
                _column: col,
                _sectionId: section.id,
              });
              const desc = item.description;
              if (desc && typeof desc === "string") {
                blocks.push({
                  type: "particle_narrative",
                  content: desc,
                  sectionId: section.id,
                  idx,
                  _column: col,
                  _sectionId: section.id,
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
                    _column: col,
                    _sectionId: section.id,
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
                _column: col,
                _sectionId: section.id,
              });

              if (item.tech) {
                blocks.push({
                  type: "particle_list_entry",
                  label: "Tech Stack",
                  value: item.tech,
                  sectionId: section.id,
                  idx,
                  _column: col,
                  _sectionId: section.id,
                });
              }

              const desc = item.description;
              if (desc && typeof desc === "string") {
                blocks.push({
                  type: "particle_narrative",
                  content: desc,
                  sectionId: section.id,
                  idx,
                  _column: col,
                  _sectionId: section.id,
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
                    _column: col,
                    _sectionId: section.id,
                  });
                });
              }
            } else if (section.type === "education") {
              blocks.push({
                type: "edu_item",
                item,
                sectionId: section.id,
                idx,
                _column: col,
                _sectionId: section.id,
              });
            } else if (section.type === "certifications") {
              blocks.push({
                type: "cert_item",
                item,
                sectionId: section.id,
                idx,
                _column: col,
                _sectionId: section.id,
              });
            } else {
              blocks.push({
                type: "simple_content",
                content: item,
                sectionId: section.id,
                sectionType: section.type,
                _column: col,
                _sectionId: section.id,
              });
            }
          });
        }
      });
    }

    return blocks;
  }, [renderData, columnConfig]);

  // ============================================
  // 6. SPLIT INTO COLUMNS
  // ============================================
  const { headerParticles, leftParticles, rightParticles } = useMemo(() => {
    const header = [];
    const left = [];
    const right = [];

    flatBlocks.forEach((block) => {
      if (block._column === "header") {
        header.push(block);
      } else if (block._column === "right") {
        right.push(block);
      } else {
        left.push(block); // Default to left
      }
    });

    console.log(
      `[DualColumnEngine] Column assignment | Header: ${header.length} | Left: ${left.length} | Right: ${right.length}`,
    );

    return {
      headerParticles: header,
      leftParticles: left,
      rightParticles: right,
    };
  }, [flatBlocks]);

  // ============================================
  // 7. PAGINATION (useLayoutEffect)
  // ============================================
  useLayoutEffect(() => {
    const runPagination = async () => {
      if (!leftMeasureRef.current && !rightMeasureRef.current) return;

      // Wait for fonts
      await waitForFonts();

      // Wait for images
      const allRefs = [leftMeasureRef.current, rightMeasureRef.current].filter(
        Boolean,
      );
      for (const ref of allRefs) {
        const images = ref.querySelectorAll("img");
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
      }

      // Stabilization RAF
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );

      // Guard against unmount
      if (!leftMeasureRef.current && !rightMeasureRef.current) return;

      renderCount.current++;
      const now = Date.now();
      const timeDiff = now - lastRenderTime.current;
      lastRenderTime.current = now;

      console.log(
        `[DualColumnEngine] Pagination Cycle #${renderCount.current} | TimeDelta: ${timeDiff}ms | Left: ${leftParticles.length} | Right: ${rightParticles.length}`,
      );

      if (timeDiff < 50 && renderCount.current > 5) {
        console.error(
          "[DualColumnEngine] CRITICAL: TIGHT RENDER LOOP DETECTED. Stopping.",
        );
      }

      const newPages = await paginateDualColumn(
        headerMeasureRef,
        leftMeasureRef,
        rightMeasureRef,
        headerParticles,
        leftParticles,
        rightParticles,
        template,
      );
      setPages(newPages);
    };

    // Debounce pagination
    const debouncedRun = () => {
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }
      paginationTimeoutRef.current = setTimeout(() => {
        runPagination();
      }, 150);
    };

    debouncedRun();

    return () => {
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }
    };
  }, [
    leftParticles,
    rightParticles,
    template,
    formatting,
    accentColor,
    renderMode,
  ]);

  // ============================================
  // 8. CSS GENERATION
  // ============================================
  const { tokens: containerStyles, fontClass } = useFormattingContract(
    formatting,
    accentColor,
  );

  const fmt = {
    font_family: fontClass,
    zoom: formatting?.body_scale || 1,
  };

  const templateStyle = `
    /* ROOT & SCALING */
    .resume-page {
      zoom: var(--resume-scale);
    }

    /* DUAL COLUMN LAYOUT */
    .dual-column-container {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: ${columnConfig.gap};
      width: 100%;
    }
    .dual-column-left {
      width: ${columnConfig.widths.left};
      display: block; /* block (not flex-col) so margins collapse, matching paginateDualColumn Math.max() */
      min-width: 0;
    }
    .dual-column-right {
      width: ${columnConfig.widths.right};
      display: block; /* block (not flex-col) so margins collapse, matching paginateDualColumn Math.max() */
      min-width: 0;
    }

    /* SEMANTIC CLASS REGISTRY (same as Linear) */
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

    /* LEGACY OVERRIDES */
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

  // ============================================
  // 9. RENDER
  // ============================================
  return (
    <div className={fmt.font_family} style={containerStyles}>
      <style>{templateStyle}</style>

      {/* ====== HIDDEN MEASUREMENT CONTAINERS ====== */}
      {/* Header Measurement (100% width) */}
      <div
        ref={headerMeasureRef}
        className="measure-container resume-page absolute top-0 left-0 invisible -z-50"
        style={{
          width: `${A4_WIDTH_PX}px`,
          height: "auto",
          minHeight: "auto",
          padding: "var(--resume-padding-safe-y) var(--resume-padding-safe-x)",
        }}
      >
        <div
          className="dual-column-header"
          style={{ marginBottom: "var(--resume-spacing-section)" }}
        >
          {headerParticles.map((block, i) => (
            <ParticleRenderer
              key={`measure-header-${i}`}
              block={block}
              styles={styles}
              mode={mode}
            />
          ))}
        </div>
      </div>

      {/* Left Column Measurement */}
      {/* Width = (A4 - horizontal padding×2) × column%, matching actual rendered width */}
      <div
        ref={leftMeasureRef}
        className="measure-container resume-page absolute top-0 left-0 invisible -z-50"
        style={{
          width: `calc((${A4_WIDTH_PX}px - var(--resume-padding-safe-x) * 2) * ${parseFloat(columnConfig.widths.left) / 100})`,
          height: "auto",
          minHeight: "auto",
          padding: "0",
        }}
      >
        {leftParticles.map((block, i) => (
          <ParticleRenderer
            key={`measure-left-${i}`}
            block={block}
            styles={styles}
            mode={mode}
          />
        ))}
      </div>

      {/* Right Column Measurement */}
      {/* Width = (A4 - horizontal padding×2) × column%, matching actual rendered width */}
      <div
        ref={rightMeasureRef}
        className="measure-container resume-page absolute top-0 left-0 invisible -z-50"
        style={{
          width: `calc((${A4_WIDTH_PX}px - var(--resume-padding-safe-x) * 2) * ${parseFloat(columnConfig.widths.right) / 100})`,
          height: "auto",
          minHeight: "auto",
          padding: "0",
        }}
      >
        {rightParticles.map((block, i) => (
          <ParticleRenderer
            key={`measure-right-${i}`}
            block={block}
            styles={styles}
            mode={mode}
          />
        ))}
      </div>

      {/* ====== VISIBLE PAGES ====== */}
      {pages.length === 0 ? (
        <div
          className={`resume-page mx-auto text-left origin-top ${styles.container || "bg-white shadow-2xl"}`}
          style={{
            width: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`,
            padding:
              "var(--resume-padding-safe-y) var(--resume-padding-safe-x)",
          }}
        >
          <div className="flex items-center justify-center h-full text-gray-300">
            Layouting...
          </div>
        </div>
      ) : (
        pages.map((page, idx) => (
          <DualColumnPage
            key={idx}
            id={idx === 0 ? "resume-preview" : undefined}
            page={page}
            pageIndex={idx}
            totalPageCount={pages.length}
            styles={styles}
            columnConfig={columnConfig}
            headerParticles={idx === 0 ? headerParticles : []}
            onUpdate={onUpdate}
            onSectionClick={onSectionClick}
            mode={mode}
            fontClass={fmt.font_family}
          />
        ))
      )}
    </div>
  );
};

// ============================================
// DUAL COLUMN PAGE COMPONENT
// ============================================
const DualColumnPage = ({
  id,
  page,
  pageIndex,
  totalPageCount,
  styles,
  columnConfig,
  headerParticles,
  onUpdate,
  onSectionClick,
  mode,
  fontClass,
}) => {
  const leftParticles = page?.regions?.left?.particles || [];
  const rightParticles = page?.regions?.right?.particles || [];

  const pageStyle = {
    width: `${A4_WIDTH_PX}px`,
    height: `${A4_HEIGHT_PX}px`,
    minHeight: `${A4_HEIGHT_PX}px`,
  };

  return (
    <div
      id={id}
      className={`resume-page mx-auto overflow-hidden text-left origin-top mb-10 ${fontClass || ""} ${styles.container?.replace(/min-h-\[[^\]]+\]/, "") || "bg-white shadow-2xl"}`}
      style={{
        ...pageStyle,
        padding: "var(--resume-padding-safe-y) var(--resume-padding-safe-x)",
      }}
    >
      {/* Header (only on first page) */}
      {headerParticles.length > 0 && (
        <div
          className="dual-column-header"
          style={{ marginBottom: "var(--resume-spacing-section)" }}
        >
          {headerParticles.map((block, i) => (
            <ParticleRenderer
              key={`header-${i}`}
              block={block}
              styles={styles}
              onUpdate={onUpdate}
              onSectionClick={onSectionClick}
              mode={mode}
              isFirst={i === 0}
            />
          ))}
        </div>
      )}

      {/* Two Column Body */}
      <div className="dual-column-container">
        {/* Left Column */}
        <div className="dual-column-left">
          {leftParticles.map((block, i) => (
            <ParticleRenderer
              key={block.key || `${pageIndex}-left-${i}`}
              block={block}
              styles={styles}
              onUpdate={onUpdate}
              onSectionClick={onSectionClick}
              mode={mode}
              isFirst={
                i === 0
              } /* Strip top margin on first item every page — matches paginateDualColumn gap=0 */
            />
          ))}
        </div>

        {/* Right Column */}
        <div className="dual-column-right">
          {rightParticles.map((block, i) => (
            <ParticleRenderer
              key={block.key || `${pageIndex}-right-${i}`}
              block={block}
              styles={styles}
              onUpdate={onUpdate}
              onSectionClick={onSectionClick}
              mode={mode}
              isFirst={
                i === 0
              } /* Strip top margin on first item every page — matches paginateDualColumn gap=0 */
            />
          ))}
        </div>
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-2 right-4 text-[10px] text-gray-400 pointer-events-none opacity-50">
        Page {pageIndex + 1} of {totalPageCount}
      </div>
    </div>
  );
};

export default DualColumnLayoutStrategy;
