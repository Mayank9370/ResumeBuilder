import React from "react";
import { normalizeSkills } from "@/modules/resume-builder/utils/skillsNormalizer";
import PhotoRenderer from "@/core/engine/components/PhotoRenderer";
import {
  renderHTML,
  renderHTMLWithPagination,
  filterHTMLForPagination,
} from "@/modules/resume-builder/components/templates/templateHelpers";
import { useDispatch } from "react-redux";
import { setActiveItem } from "@/modules/resume-builder/state/resumeSlice";

const ParticleRenderer = ({
  block,
  styles,
  onUpdate,
  onSectionClick,
  mode,
  isFirst = false,
  shouldRenderItem,
  ...props
}) => {
  const dispatch = useDispatch();

  // Helper for interactions
  const interactProps = (targetSectionId, onSectionClick) => ({
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(
        "Item clicked - itemId:",
        block.itemId,
        "sectionId:",
        targetSectionId,
      );
      if (onSectionClick) onSectionClick(targetSectionId);
      if (block.itemId) {
        dispatch(setActiveItem(block.itemId));
      }
    },
    className: `cursor-pointer transition-all hover:outline hover:outline-1 hover:outline-blue-400 hover:bg-blue-50/10 rounded-sm p-0.5 -m-0.5 relative group/edit`,
  });

  // Class helper
  const cls = (base, targetId, onSectionClick) =>
    `${base} ${interactProps(targetId, onSectionClick).className}`;

  // Shared interaction helpers
  const handleBlur = (
    e,
    sectionId,
    itemIndex,
    field,
    isArray = false,
    arrayIndex = null,
  ) => {
    onUpdate(
      sectionId,
      itemIndex,
      field,
      e.target.innerText,
      isArray,
      arrayIndex,
    );
  };
  const handleHeaderBlur = (e, field) =>
    onUpdate("personal_info", null, field, e.target.innerText);
  const handleSummaryBlur = (e) =>
    onUpdate("professional_summary", null, null, e.target.innerText);

  const key = block.key || Math.random();

  // HTML Wrapper Helper for row-level pagination
  const getPaginatedHTML = (rawContent, sectionId, idx) => {
    const { pagination } = props;
    if (
      pagination &&
      !pagination.isMeasurementPass &&
      pagination.pageIndex !== undefined
    ) {
      return filterHTMLForPagination(
        rawContent,
        sectionId,
        idx,
        pagination.pageIndex,
        pagination.itemMap,
      );
    }
    return renderHTMLWithPagination(rawContent, sectionId, idx);
  };

  switch (block.type) {
    case "header":
    case "header_no_photo":
      const info = block.data || {};
      if (!styles) return <div className="hidden" data-empty="true" />; // Safety check

      const isNoPhoto = block.type === "header_no_photo";

      // --- COMPACT HEADER VARIANT ---
      if (styles.headerVariant === "compact") {
        const isCentered = styles.headerAlign === "center";
        const alignTextClass = isCentered ? "text-center" : "text-left";
        const alignItemsClass = isCentered ? "items-center" : "items-start";
        const justifyContactsClass = isCentered
          ? "justify-center"
          : "justify-start";

        return (
          <header
            key={key}
            className={`mb-4 pb-2 runtime-contrast ${styles.headerContainer || ""} ${interactProps("personal_info", onSectionClick).className}`}
            onClick={interactProps("personal_info", onSectionClick).onClick}
            data-keep-with-next="true"
            {...props}
          >
            <div
              className={`flex flex-col ${alignTextClass} ${alignItemsClass}`}
            >
              <h1
                className={styles.name || ""}
                style={{
                  fontSize: "calc(var(--resume-font-size-h2) + 3px)",
                  fontWeight: "700",
                  marginBottom: "4px",
                }}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleHeaderBlur(e, "full_name")}
              >
                {info.full_name || "Your Name"}
              </h1>

              {/* V8.6 Integrity: Inject Job Title */}
              {info.profession && (
                <div
                  className={`${styles.sectionContent || ""} text-[14px] opacity-90 mb-1 font-medium`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleHeaderBlur(e, "profession")}
                >
                  {info.profession}
                </div>
              )}

              <div
                className={`${styles.contactInfo || ""} flex flex-wrap ${alignItemsClass} ${justifyContactsClass} gap-2 text-[13px] text-gray-800 particle-meta w-full`}
              >
                {info.email && (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Email:</span>
                    <a
                      href={`mailto:${info.email}`}
                      className="hover:underline"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleHeaderBlur(e, "email")}
                    >
                      {info.email}
                    </a>
                  </div>
                )}
                {info.phone && (
                  <div className="flex items-center gap-1">
                    {info.email && (
                      <span className="opacity-50 font-normal mx-0.5">|</span>
                    )}
                    <span className="font-semibold">Phone:</span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleHeaderBlur(e, "phone")}
                    >
                      {info.phone}
                    </span>
                  </div>
                )}

                {(() => {
                  const linksList = [];
                  let hasPrevious = !!(info.email || info.phone);
                  const addLink = (url, label) => {
                    if (!url || typeof url !== "string") return;
                    const safeHref = url.startsWith("http")
                      ? url
                      : `https://${url}`;
                    linksList.push(
                      <React.Fragment key={label}>
                        {hasPrevious && (
                          <span className="opacity-50 font-normal mx-0.5">
                            |
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          {label && (
                            <span className="font-semibold">{label}:</span>
                          )}
                          <a
                            href={safeHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600"
                            style={{
                              textDecoration: "underline",
                              textUnderlineOffset: "2px",
                            }}
                          >
                            {url.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </React.Fragment>,
                    );
                    hasPrevious = true;
                  };

                  const links = info.socialLinks || info.social_links || [];
                  if (links.length > 0) {
                    links.forEach((l) =>
                      addLink(
                        l.url || l.link || l.href,
                        l.platform || l.network || l.label || "Link",
                      ),
                    );
                  } else {
                    addLink(info.linkedin, "LinkedIn");
                    addLink(info.github, "GitHub");
                    addLink(info.portfolio || info.website, "Portfolio");
                    addLink(info.link || info.url, "Link");
                  }
                  return linksList;
                })()}

                {info.location && (
                  <div className="flex items-center gap-1">
                    {(info.email ||
                      info.phone ||
                      info.linkedin ||
                      info.github ||
                      info.portfolio) && (
                      <span className="opacity-50 font-normal mx-0.5">|</span>
                    )}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleHeaderBlur(e, "location")}
                    >
                      {info.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>
        );
      }
      // --- END COMPACT HEADER VARIANT ---

      return (
        <header
          key={key}
          className={`mb-6 border-b-2 border-gray-800 pb-4 runtime-contrast ${styles.headerContainer} ${interactProps("personal_info", onSectionClick).className}`}
          onClick={interactProps("personal_info", onSectionClick).onClick}
          {...props}
        >
          {styles.headerLayout === "PHOTO_LEFT_STACKED_TEXT" ? (
            <div className="flex items-center gap-6 header-row">
              {!isNoPhoto &&
                styles.renderHeaderPhoto &&
                (() => {
                  const photoSrc = block.data?.image;
                  if (photoSrc) {
                    return (
                      <div className="flex-shrink-0">
                        <PhotoRenderer
                          src={photoSrc}
                          shape={styles.photoShape}
                          borderStyle={styles.photoBorder}
                          size={styles.photoSize}
                          className="mb-0"
                        />
                      </div>
                    );
                  }
                  return null;
                })()}

              <div className="flex flex-col header-text-column">
                <h1
                  className={styles.name}
                  style={{ fontSize: "var(--resume-font-size-h1)" }}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleHeaderBlur(e, "full_name")}
                >
                  {info.full_name || "Your Name"}
                </h1>

                {/* V8.6 Integrity: Inject Job Title */}
                {info.profession && (
                  <div
                    className={`${styles.sectionContent} text-xl opacity-90 mb-2 font-medium`}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleHeaderBlur(e, "profession")}
                  >
                    {info.profession}
                  </div>
                )}
                <div
                  className={`${(styles.contactInfo || "").replace("flex-col", "flex-row")} flex flex-row flex-wrap gap-4 mt-2 items-center particle-meta`}
                >
                  {info.email && (
                    <a
                      href={`mailto:${info.email}`}
                      className="hover:underline"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleHeaderBlur(e, "email")}
                    >
                      {info.email}
                    </a>
                  )}
                  {info.phone && (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleHeaderBlur(e, "phone")}
                    >
                      {info.phone}
                    </span>
                  )}
                  {(() => {
                    const renderLink = (url, label) => {
                      if (!url || typeof url !== "string")
                        return <div className="hidden" data-empty="true" />;
                      const safeHref = url.startsWith("http")
                        ? url
                        : `https://${url}`;
                      return (
                        <a
                          href={safeHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-600"
                          style={{
                            textDecoration: "underline",
                            textUnderlineOffset: "2px",
                          }}
                        >
                          {label}
                        </a>
                      );
                    };
                    const links = info.socialLinks || info.social_links;
                    if (links && Array.isArray(links) && links.length > 0) {
                      return links.map((link, idx) => (
                        <React.Fragment key={link.id || idx}>
                          {renderLink(
                            link.url || link.link || link.href,
                            link.platform ||
                              link.network ||
                              link.label ||
                              "Link",
                          )}
                        </React.Fragment>
                      ));
                    }

                    // Fallback: Legacy Field Support
                    return (
                      <>
                        {renderLink(info.linkedin, "LinkedIn")}
                        {renderLink(info.github, "GitHub")}
                        {renderLink(info.website, "Portfolio")}
                        {renderLink(info.portfolio, "Portfolio")}
                        {/* Add generic 'link' or 'url' fields if they exist at top level */}
                        {renderLink(info.link, "Link")}
                        {renderLink(info.url, "Website")}
                      </>
                    );
                  })()}
                  {info.location && (
                    <span
                      className="particle-meta"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleHeaderBlur(e, "location")}
                    >
                      {info.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header Photo Injection (Skipped if header_no_photo) */}
              {!isNoPhoto &&
                styles.renderHeaderPhoto &&
                (() => {
                  const photoSrc = block.data?.image;
                  if (photoSrc) {
                    return (
                      <PhotoRenderer
                        src={photoSrc}
                        shape={styles.photoShape}
                        borderStyle={styles.photoBorder}
                        size={styles.photoSize}
                        className="mb-4"
                      />
                    );
                  }
                  return <div className="hidden" data-empty="true" />;
                })()}

              <h1
                className={`${styles.name} text-center`}
                style={{ fontSize: "var(--resume-font-size-h1)" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleHeaderBlur(e, "full_name")}
              >
                {info.full_name || "Your Name"}
              </h1>

              {/* V8.6 Integrity: Inject Job Title */}
              {info.profession && (
                <div
                  className={`${styles.sectionContent} text-center text-xl opacity-90 mb-2 font-medium`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleHeaderBlur(e, "profession")}
                >
                  {info.profession}
                </div>
              )}
              <div
                className={`${styles.contactInfo} flex flex-wrap justify-center text-center gap-4 mt-2 items-center particle-meta`}
              >
                {info.email && (
                  <a
                    href={`mailto:${info.email}`}
                    className="hover:underline"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleHeaderBlur(e, "email")}
                  >
                    {info.email}
                  </a>
                )}
                {info.phone && (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleHeaderBlur(e, "phone")}
                  >
                    {info.phone}
                  </span>
                )}
                {(() => {
                  const renderLink = (url, label) => {
                    if (!url || typeof url !== "string")
                      return <div className="hidden" data-empty="true" />;
                    const safeHref = url.startsWith("http")
                      ? url
                      : `https://${url}`;
                    return (
                      <a
                        href={safeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                        style={{
                          textDecoration: "underline",
                          textUnderlineOffset: "2px",
                        }}
                      >
                        {label}
                      </a>
                    );
                  };
                  const links = info.socialLinks || info.social_links;
                  if (links && Array.isArray(links) && links.length > 0) {
                    return links.map((link, idx) => (
                      <React.Fragment key={link.id || idx}>
                        {renderLink(
                          link.url || link.link || link.href,
                          link.platform || link.network || link.label || "Link",
                        )}
                      </React.Fragment>
                    ));
                  }

                  // Fallback: Legacy Field Support
                  return (
                    <>
                      {renderLink(info.linkedin, "LinkedIn")}
                      {renderLink(info.github, "GitHub")}
                      {renderLink(info.website, "Portfolio")}
                      {renderLink(info.portfolio, "Portfolio")}
                      {/* Add generic 'link' or 'url' fields if they exist at top level */}
                      {renderLink(info.link, "Link")}
                      {renderLink(info.url, "Website")}
                    </>
                  );
                })()}
                {info.location && (
                  <span
                    className="particle-meta"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleHeaderBlur(e, "location")}
                  >
                    {info.location}
                  </span>
                )}
              </div>
            </>
          )}
        </header>
      );

    case "standalone_photo":
      const photoData = block.data || {};
      const standaloneSrc = photoData.image;
      if (!standaloneSrc || !styles || !styles.renderHeaderPhoto)
        return <div className="hidden" data-empty="true" />;

      return (
        <div
          key={key}
          className={`flex ${styles.standalonePhotoContainer || "justify-center mb-6"} ${interactProps("personal_info", onSectionClick).className}`}
          onClick={interactProps("personal_info", onSectionClick).onClick}
          {...props}
        >
          <PhotoRenderer
            src={standaloneSrc}
            shape={styles.photoShape}
            borderStyle={styles.photoBorder}
            size={styles.photoSize}
          />
        </div>
      );

    case "summary_title":
      return (
        <h2
          key={key}
          onClick={interactProps("summary", onSectionClick).onClick}
          className={cls(
            `${styles.sectionTitle} particle-section-title`,
            "summary",
            onSectionClick,
          )}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("root", null, "summary_title", e.target.innerText)
          }
          {...props}
        >
          {block.title}
        </h2>
      );

    case "summary_content":
      return (
        <div
          key={key}
          onClick={interactProps("summary", onSectionClick).onClick}
          className={cls(
            `${styles.sectionContent} particle-narrative summary-content rich-text`,
            "summary",
            onSectionClick,
          )}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleSummaryBlur}
          dangerouslySetInnerHTML={{ __html: renderHTML(block.content) }}
          {...props}
        />
      );

    case "section_title":
      return (
        <div className={isFirst ? "" : "particle-section-discriminator"}>
          <h2
            key={key}
            onClick={interactProps(block.id, onSectionClick).onClick}
            className={cls(
              `${styles.sectionTitle} particle-section-title ${isFirst ? "!mt-0" : ""}`,
              block.id,
              onSectionClick,
            )}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate(block.id, null, "title", e.target.innerText)
            }
            {...props}
          >
            {block.title}
          </h2>
        </div>
      );

    case "section_group": {
      // Atomic Section Wrapper
      const { children, sectionId } = block;
      if (!children || children.length === 0)
        return <div className="hidden" data-empty="true" />;

      return (
        <div
          key={key}
          className="particle-section-container relative"
          data-pagination-section={sectionId}
          style={{ breakInside: "avoid" }} // Hint for print
          {...props}
        >
          {children.map((child, i) => (
            <ParticleRenderer
              key={child.key || i}
              block={child}
              styles={styles}
              onUpdate={onUpdate}
              onSectionClick={onSectionClick}
              mode={mode}
              isFirst={i === 0 && isFirst} // Only first child of first group isFirst
            />
          ))}
        </div>
      );
    }

    case "skills_composite": {
      // V8.9 New: Separate Tags and Bullets for Skills
      const { tags, bullets, sectionId, sectionType } = block;

      // SANITIZATION: Filter out empty/invalid items
      const text = (item) =>
        !item
          ? ""
          : typeof item === "object"
            ? item.name || item.content || item.value || ""
            : item;
      const isValid = (item) =>
        text(item) && String(text(item)).trim().length > 0;

      const validTags = (tags || []).filter(isValid);
      const validBullets = (bullets || []).filter(isValid);

      const tagNodes = validTags
        .map((tag, i) => {
          const isLast = i === validTags.length - 1;
          if (shouldRenderItem && !shouldRenderItem(i))
            return (
              <span
                key={`t-${i}-hidden`}
                className="hidden"
                data-empty="true"
              />
            );
          return (
            <span
              key={`t-${i}`}
              data-pagination-item="true"
              data-section-id={sectionId}
              data-item-index={i}
              className={`${styles.sectionContent} inline font-medium mr-1`}
            >
              {text(tag)}
              {!isLast ? "," : ""}
            </span>
          );
        })
        .filter(Boolean);

      const bulletNodes = validBullets
        .map((bullet, i) => {
          const originalIdx = validTags.length + i;
          if (shouldRenderItem && !shouldRenderItem(originalIdx))
            return <div className="hidden" data-empty="true" />;
          return (
            <li
              key={`b-${i}`}
              data-pagination-item="true"
              data-section-id={sectionId}
              data-item-index={originalIdx}
              className={`${styles.sectionContent} pl-1 marker:opacity-70`}
            >
              {text(bullet)}
            </li>
          );
        })
        .filter(Boolean);

      if (tagNodes.length === 0 && bulletNodes.length === 0)
        return <div className="hidden" data-empty="true" />;

      return (
        <div
          key={key}
          className={`particle-narrative ${interactProps(sectionId, onSectionClick).className}`}
          onClick={interactProps(sectionId, onSectionClick).onClick}
          {...props}
        >
          {/* 1. TAGS: Comma Separated Text */}
          {tagNodes.length > 0 && (
            <div className="mb-3 leading-relaxed tracking-wide">{tagNodes}</div>
          )}

          {/* 2. BULLETS: Semantic List */}
          {bulletNodes.length > 0 && (
            <ul className="list-disc ml-5 space-y-1">{bulletNodes}</ul>
          )}
        </div>
      );
    }

    // --- PARTICLE RENDERERS ---

    case "particle_std_header": {
      // Standard Entry Header (New ATS - used for Projects, etc.)
      const { header, subheader, meta, url, sectionId, idx } = block;
      // Use semantic classes instead of fixed Tailwind
      const headerClass = `particle-job-title ${styles.jobTitle || ""}`;
      const subheaderClass = `italic opacity-90 ${styles.companyName || ""}`;
      const metaClass = `particle-meta text-sm opacity-80 ${styles.dateLocation || ""}`;

      return (
        <div
          key={key}
          className={`particle-entry-container ${isFirst ? "!mt-0" : ""} ${interactProps(sectionId, onSectionClick).className}`}
          onClick={interactProps(sectionId, onSectionClick).onClick}
          data-pagination-item="true"
          data-section-id={sectionId}
          data-item-index={idx}
          {...props}
        >
          <div className="flex flex-col mb-1">
            <div className="flex justify-between items-baseline">
              {/* Title & Link */}
              <div className="flex-1">
                {header &&
                  (() => {
                    const safeUrl =
                      typeof url === "string"
                        ? url
                        : typeof url?.href === "string"
                          ? url.href
                          : null;
                    // If URL exists, make the header clickable AND show the icon
                    if (safeUrl) {
                      return (
                        <div className="flex items-center gap-2">
                          <a
                            href={
                              safeUrl.startsWith("http")
                                ? safeUrl
                                : `https://${safeUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${headerClass} hover:underline decoration-1 text-blue-600`}
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleBlur(e, sectionId, idx, "header")
                            }
                          >
                            {header}
                          </a>
                          <a
                            href={
                              safeUrl.startsWith("http")
                                ? safeUrl
                                : `https://${safeUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 ml-1 opacity-100 hover:text-blue-700"
                            title="Project Link"
                          >
                            🔗
                          </a>
                        </div>
                      );
                    }
                    return (
                      <span
                        className={headerClass}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleBlur(e, sectionId, idx, "header")}
                      >
                        {header}
                      </span>
                    );
                  })()}
              </div>

              {/* Meta / Date (Right Aligned) */}
              {meta && (
                <span
                  className={metaClass}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(e, sectionId, idx, "meta")}
                >
                  {meta}
                </span>
              )}
            </div>

            {/* Subheader / Role */}
            {subheader && (
              <div className={`${subheaderClass} mt-0.5`}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(e, sectionId, idx, "subheader")}
                >
                  {subheader}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    case "particle_exp_header": {
      // Classic Experience Header
      const { item, sectionId, idx } = block;
      return (
        <div
          key={key}
          className={`particle-entry-container ${isFirst ? "!mt-0" : ""} ${interactProps(sectionId, onSectionClick).className}`}
          onClick={interactProps(sectionId, onSectionClick).onClick}
          data-pagination-item="true"
          data-section-id={sectionId}
          data-item-index={idx}
          {...props}
        >
          {/* Top Row: Title & Company */}
          <div className="flex flex-col mb-1">
            <div className="flex justify-between items-baseline">
              <div>
                <span
                  className={`${styles.jobTitle} particle-job-title`}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(e, sectionId, idx, "position")}
                >
                  {item.position || item.role}
                </span>
                {item.company && (
                  <span className={styles.companyName}>
                    {" "}
                    –{" "}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleBlur(e, sectionId, idx, "company")}
                    >
                      {item.company}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Second Row: Location & Date */}
            <div
              className={`${styles.dateLocation} particle-meta text-sm opacity-80 mt-1 flex w-full justify-between`}
            >
              {item.location && (
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlur(e, sectionId, idx, "location")}
                  >
                    {item.location}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1 ml-auto">
                <span>📅</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(e, sectionId, idx, "start_date")}
                >
                  {item.start_date}
                </span>
                {(item.end_date || item.is_current) && (
                  <>
                    {" "}
                    –{" "}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleBlur(e, sectionId, idx, "end_date")}
                    >
                      {item.is_current ? "Present" : item.end_date}
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      );
    }

    case "particle_bullet": {
      const { content, sectionId, idx, bIdx } = block;
      // V8.6 Hygiene: Guard against empty content
      if (!content || !content.trim())
        return <div className="hidden" data-empty="true" />;

      // V8.9 Rich Text Fix: Check for HTML
      const hasHTML = /<\/?[a-z][\s\S]*>/i.test(content);

      // If HTML is present (Rich Text), render as a block without the forced bullet.
      // The Rich Text content itself will handle bullets (ul/li) or paragraphs.
      if (hasHTML) {
        return (
          <div
            key={key}
            className={`particle-bullet-item particle-narrative rich-text relative ${interactProps(sectionId, onSectionClick).className}`}
            onClick={interactProps(sectionId, onSectionClick).onClick}
            data-pagination-item="true"
            data-section-id={sectionId}
            data-item-index={idx}
            {...props}
          >
            <div
              className={`${styles.sectionContent} block`}
              style={{ display: "block" }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleBlur(e, sectionId, idx, "bullets", true, bIdx)
              }
              dangerouslySetInnerHTML={{
                __html: renderHTMLWithPagination(content, sectionId, idx),
              }}
            />
          </div>
        );
      }

      // Default: Plain Text -> Render with Bullet
      return (
        // Note: Plain text bullets DON'T get particle-narrative because they aren't Rich Text containers
        // and we want strict control over the bullet format.
        <div
          key={key}
          className={`particle-bullet-item pl-4 relative ${interactProps(sectionId, onSectionClick).className}`}
          onClick={interactProps(sectionId, onSectionClick).onClick}
          {...props}
        >
          <div className="flex items-start">
            <span className="mr-2 opacity-70">•</span>
            <div
              className={`${styles.sectionContent} block`}
              style={{ display: "block" }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleBlur(e, sectionId, idx, "bullets", true, bIdx)
              }
              dangerouslySetInnerHTML={{ __html: renderHTML(content) }}
            />
          </div>
        </div>
      );
    }

    case "particle_list_entry": {
      const { label, value, sectionId, idx } = block;
      return (
        <div
          key={key}
          className={`particle-narrative ${interactProps(sectionId, onSectionClick).className}`}
          onClick={interactProps(sectionId, onSectionClick).onClick}
          data-pagination-item="true"
          data-section-id={sectionId}
          data-item-index={idx}
          {...props}
        >
          <div className="flex items-baseline flex-wrap gap-2">
            <span
              className={`${styles.sectionContent} font-bold mr-2 text-gray-800`}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(e, sectionId, idx, "label")}
            >
              {label}:
            </span>
            <span
              className={styles.sectionContent}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(e, sectionId, idx, "value")}
            >
              {value}
            </span>
          </div>
        </div>
      );
    }

    case "particle_narrative": {
      // Strip structural pagination attributes from the wrapper, because the innerHTML generates its own data-pagination-item nodes!
      // We don't want the parent wrapper tricking the pagination engine into thinking the whole block belongs to one page.
      const {
        "data-pagination-item": _dpi,
        "data-section-id": _dsi,
        "data-item-index": _dii,
        "data-sub-item-index": _dsii,
        ...cleanProps
      } = props;
      return (
        <div
          key={key}
          onClick={interactProps(block.sectionId, onSectionClick).onClick}
          className={cls(
            `${styles.sectionContent} particle-narrative rich-text`,
            block.sectionId,
            onSectionClick,
          )}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur(e, block.sectionId, block.idx, "content")}
          dangerouslySetInnerHTML={{
            __html: getPaginatedHTML(block.content, block.sectionId, block.idx),
          }}
          {...cleanProps}
        />
      );
    }

    case "edu_item": {
      const { item, sectionId, idx } = block;
      return (
        <div
          key={key}
          className="particle-entry-container mb-3"
          data-pagination-item="true"
          data-section-id={sectionId}
          data-item-index={idx}
          {...props}
        >
          {/* Row 1: Institution */}
          <div
            className={`${styles.jobTitle} particle-job-title block mb-1`}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleBlur(e, sectionId, idx, "institution")}
          >
            {item.institution}
          </div>

          {/* Row 2: Degree & Field */}
          <div className={styles.sectionContent}>
            <div className="font-medium">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleBlur(e, sectionId, idx, "degree")}
              >
                {item.degree}
              </span>
              {item.field && (
                <>
                  {" "}
                  in{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlur(e, sectionId, idx, "field")}
                  >
                    {item.field || item.major || item.study}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Row 3: Meta (Location, Date, Percentage/GPA) */}
          <div
            className={`${styles.dateLocation} particle-meta text-sm opacity-90 mt-1 flex flex-wrap gap-x-4 gap-y-1`}
          >
            {item.location && (
              <span className="flex items-center gap-1">
                <span>📍</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(e, sectionId, idx, "location")}
                >
                  {item.location}
                </span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <span>📅</span>
              {item.start_date && (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(e, sectionId, idx, "start_date")}
                >
                  {item.start_date} –{" "}
                </span>
              )}
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleBlur(e, sectionId, idx, "graduation_date")}
              >
                {item.is_current
                  ? "Present"
                  : item.graduation_date || item.end_date}
              </span>
            </span>
            {item.gpa && (
              <span className="flex items-center gap-1">
                <span>🎓</span>
                <span>
                  GPA/Score:{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlur(e, sectionId, idx, "gpa")}
                  >
                    {item.gpa}
                  </span>
                </span>
              </span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div
              className={`${styles.sectionContent} particle-narrative mt-2 text-sm opacity-90`}
              dangerouslySetInnerHTML={{
                __html: renderHTMLWithPagination(
                  item.description,
                  sectionId,
                  idx,
                ),
              }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(e, sectionId, idx, "description")}
            />
          )}
        </div>
      );
    }

    case "cert_item": {
      const { item, sectionId, idx } = block;
      return (
        <div
          key={key}
          className="particle-entry-container mb-2"
          data-pagination-item="true"
          data-section-id={sectionId}
          data-item-index={idx}
          {...props}
        >
          <div className="flex justify-between items-baseline">
            <span
              className="font-bold particle-job-title"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(e, sectionId, idx, "name")}
            >
              {item.name}
            </span>
            <span
              className={`${styles.dateLocation} particle-meta`}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlur(e, sectionId, idx, "date")}
            >
              {item.date || item.issue_date}
            </span>
          </div>

          {/* V8.6 Integrity: Issuer & ID */}
          {(item.issuer || item.credential_id) && (
            <div className={`${styles.sectionContent} text-sm opacity-90`}>
              {item.issuer && (
                <span
                  className="mr-2"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur(e, sectionId, idx, "issuer")}
                >
                  {item.issuer}
                </span>
              )}
              {item.credential_id && (
                <span className="italic text-xs opacity-80">
                  (ID:{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleBlur(e, sectionId, idx, "credential_id")
                    }
                  >
                    {item.credential_id}
                  </span>
                  )
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    case "simple_content": {
      const { content, sectionId, sectionType } = block;

      // Safeguard: Do not render empty blocks
      if (!content || (Array.isArray(content) && content.length === 0))
        return <div className="hidden" data-empty="true" />;

      let displayContent = content;
      if (
        mode === "new-ats" &&
        (sectionType === "skills" || sectionType === "technical_skills")
      ) {
        // Try normalization, but safeguard against crashes
        try {
          displayContent = normalizeSkills(content);
        } catch (e) {
          console.warn("Skill normalization failed, using raw content", e);
        }
      }

      // Simplified render for simple content blocks (usually just Skills list)
      return (
        <div
          key={key}
          className="particle-narrative"
          data-pagination-item="true"
          data-section-id={sectionId}
          {...props}
        >
          <div
            className={styles.sectionContent}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleBlur(e, sectionId, null, "data")}
          >
            {(() => {
              if (Array.isArray(displayContent)) {
                return displayContent
                  .map((item) => {
                    if (typeof item === "object")
                      return item.name || item.value || JSON.stringify(item);
                    return item;
                  })
                  .join(", ");
              }
              return typeof displayContent === "object"
                ? JSON.stringify(displayContent)
                : displayContent;
            })()}
          </div>
        </div>
      );
    }

    default:
      return <div className="hidden" data-empty="true" />;
  }
};

export default ParticleRenderer;
