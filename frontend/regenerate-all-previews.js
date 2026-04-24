/**
 * regenerate-all-previews.js  (v20 – Double Custom Section Layout)
 *
 * KEY FEATURES (v20):
 *  1. Double Custom Sections: Achievements (Long) + Professional Dev (Dates + 2 lines).
 *  2. 7 Sections Total: Summary, Education, Experience, Projects, Custom 1, Custom 2.
 *  3. Date Precision: Custom 2 includes a date field ("2024").
 *  4. Exclude Zen: Regenerates 8 targeted templates.
 */

import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── TARGET CONFIG ───────────────────────────────────────────────────────────
const TARGET_MAP = {
  alpine: "#14b8a6", // Teal
  engineer: "#ef4444", // Red
  essence: "#000000", // Black
  fellow: "#ec4899", // Pink
  logic: "#10b981", // Green
  nordic: "#4f46e5", // Indigo
  presidio: "#000000", // Black
  "professional-timeline": "#8b5cf6", // Purple
};

// ─── REGISTRY ────────────────────────────────────────────────────────────────
const REGISTRY_PATH = path.join(
  __dirname,
  "src/features/resume-builder/constants/registry.generated.js",
);
let GENERATED_REGISTRY;
try {
  const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  GENERATED_REGISTRY = new Function(
    "return " + raw.substring(start, end + 1),
  )();
} catch (e) {
  console.error("❌ Failed to parse registry:", e);
  process.exit(1);
}

const TARGET_IDS = Object.keys(TARGET_MAP);
const FILTERED_REGISTRY = GENERATED_REGISTRY.filter((t) =>
  TARGET_IDS.includes(t.id),
);

const TEMPLATE_DIRS = [
  path.join(__dirname, "src/templates"),
  path.join(__dirname, "src/features/resume-builder/templates"),
];
function findTemplateDir(folderName, templateId) {
  for (const root of TEMPLATE_DIRS) {
    const a = path.join(root, folderName);
    if (fs.existsSync(a)) return a;
    const b = path.join(root, templateId);
    if (fs.existsSync(b)) return b;
  }
  return null;
}

function getV20Data(isMale, accentColor) {
  const name = isMale ? "Michael Anderson" : "Sophia Martinez";
  const profession = isMale
    ? "Senior Software Engineer"
    : "Senior Product Manager";
  const email = isMale
    ? "michael.anderson@email.com"
    : "sophia.martinez@email.com";
  const phone = isMale ? "+1 (415) 789-3456" : "+1 (512) 320-7788";
  const location = isMale ? "San Francisco, CA" : "Austin, TX";

  const summary = isMale
    ? "Highly accomplished Senior Software Engineer with eight years of experience building scalable enterprise web applications and architecting high-performance distributed systems using modern TypeScript and cloud architectures to drive business value across global cross-functional engineering teams."
    : "Strategic Senior Product Manager with seven years of experience launching successful digital products in competitive global markets using data-driven research, cross-functional leadership, and deep analytical insights to deliver user-centric solutions that exceed organizational growth targets.";

  // Custom 1 Long Bullets (~45 words, 3-4 lines)
  const custom1Bullets = [
    "Successfully spearheaded the architectural overhaul of a mission-critical financial processing engine by implementing advanced fault-tolerant microservices and high-availability PostgreSQL clusters, which ultimately reduced transactional latency by over sixty percent while simultaneously increasing system throughput for millions of concurrent global users during peak market periods.",
    "Engineered a sophisticated real-time data visualization platform utilizing advanced React patterns and optimized WebSocket streams to provide executive stakeholders with instantaneous visibility into key performance indicators, resulting in a documented twenty-five percent improvement in cross-departmental decision-making efficiency and resource allocation for multi-million dollar technology initiatives.",
    "Cultivated a high-performance engineering culture by spearheading deep-dive technical workshops and implementing a rigorous automated code quality framework, which effectively reduced production bugs by forty percent and empowered junior developers to consistently deliver enterprise-grade code while maintaining a rapid bi-weekly deployment cadence across highly distributed cloud environments.",
  ];

  // Custom 2 Concise Bullets (2 lines)
  const custom2Bullets = [
    "Earned Advanced Cloud Architect certification by demonstrating proficiency in designing distributed systems, securing cloud environments, and optimizing resource costs for global enterprise-scale applications.",
    "Delivered a keynote presentation on modern frontend architectures at the International Tech Summit, where I shared insights on optimizing performance for large-scale React applications and mentoring diverse engineering teams.",
  ];

  const standardBullets = [
    "Implemented secure authentication with Google OAuth 2.0 and token-based reset for security.",
    "Architected scalable microservices using Node.js to handle high-traffic spikes efficiently.",
  ];

  const sections_obj = {
    professional_summary: summary,
    experience: [
      {
        id: "e1",
        role: profession,
        company: isMale ? "TechCorp Industries" : "InnovateTech",
        location,
        start_date: "2020",
        end_date: "Present",
        description: standardBullets,
      },
    ],
    projects: [
      {
        id: "p1",
        name: isMale ? "GlobalScale API" : "UserSense Auth",
        description: standardBullets,
        technologies: "React, Node, AWS",
        link: "https://demo.io",
      },
    ],
    education: [
      {
        id: "edu1",
        degree: "B.S. Computer Science",
        institution: "Stanford",
        location,
        date: "2016",
        description: standardBullets,
      },
    ],
    custom_1: [
      { id: "c1", title: "Special Achievements", description: custom1Bullets },
    ],
    custom_2: [
      {
        id: "c2",
        title: "Professional Development",
        date: "2024",
        description: custom2Bullets,
      },
    ],
  };

  const sections_array = [
    {
      id: "summary",
      type: "summary",
      data: summary,
      title: "Professional Overview",
    },
    {
      id: "education",
      type: "education",
      data: sections_obj.education,
      title: "Education",
    },
    {
      id: "experience",
      type: "experience",
      data: sections_obj.experience,
      title: "Experience",
    },
    {
      id: "projects",
      type: "projects",
      data: sections_obj.projects,
      title: "Key Projects",
    },
    {
      id: "custom_1",
      type: "custom",
      data: sections_obj.custom_1,
      title: "Awards & Recognition",
    },
    {
      id: "custom_2",
      type: "custom",
      data: sections_obj.custom_2,
      title: "Certifications",
    },
  ];

  return {
    personal_info: {
      full_name: name,
      profession,
      email,
      phone,
      location,
      photo: isMale
        ? "https://randomuser.me/api/portraits/men/32.jpg"
        : "https://randomuser.me/api/portraits/women/44.jpg",
    },
    professional_summary: summary,
    sections: sections_array,
    sections_obj,
    section_order: [
      "summary",
      "education",
      "experience",
      "projects",
      "custom_1",
      "custom_2",
    ],
    theme: { accentColor, fontFamily: "Inter", fontSize: "10pt" },
  };
}

const BASE_URL = "http://localhost:3000/preview";
const A4_HEIGHT_PX = 1123;

async function regenerateTargetedPreviews() {
  console.log(
    "🚀 Starting Targeted Preview Regeneration (v20 – Double Custom Layout)...",
  );

  const browser = await puppeteer.launch({
    headless: "new",
    // defaultViewport: { width: 1400, height: 1200, deviceScaleFactor: 1 },
    args: ["--no-sandbox"],
  });

  for (let i = 0; i < FILTERED_REGISTRY.length; i++) {
    const template = FILTERED_REGISTRY[i];
    const templateId = template.id;
    const accentColor = TARGET_MAP[templateId];
    const dataToUse = getV20Data(i % 2 === 0, accentColor);

    const templateDir = findTemplateDir(
      template.__folder || templateId,
      templateId,
    );
    if (!templateDir) continue;

    const outputFilePath = path.join(templateDir, "assets", "preview.png");
    process.stdout.write(
      `📸 [${i + 1}/${FILTERED_REGISTRY.length}] ${template.name} (${accentColor})… `,
    );

    let page;
    try {
      page = await browser.newPage();
      await page.setViewport({ width: 1400, height: 1200 });
      await page.goto(`${BASE_URL}/${templateId}?debug=false`, {
        waitUntil: "networkidle0",
      });

      await page.evaluate((data) => {
        sessionStorage.setItem("useEnhancedSampleData", "custom");
        sessionStorage.setItem("customPreviewData", JSON.stringify(data));
      }, dataToUse);

      await page.reload({ waitUntil: "networkidle0" });
      await page.waitForSelector(".resume-page", { timeout: 20000 });

      // ✅ FORCE COLOR OVERRIDE & COMPACT 7-SECTION STYLING
      await page.addStyleTag({
        content: `
        :root { 
          --resume-color-accent: ${accentColor} !important; 
          --resume-color-header: ${accentColor} !important; 
          --resume-font-size: 10pt !important;
        }
        h1, h2, h3, h4, 
        .particle-section-title, .section-title {
          color: ${accentColor} !important;
          border-color: ${accentColor} !important;
          margin-top: 0.6rem !important;
          margin-bottom: 0.3rem !important;
        }
        .bullet-item, li { 
          margin-bottom: 0.2rem !important; 
          line-height: 1.35 !important;
        }
        .resume-page { padding: 1.25rem !important; }
        .text-blue-600 { color: ${accentColor} !important; }
        a { color: ${accentColor} !important; }
        
        /* Ensure dates in custom sections render if the template supports it */
        .section-custom .meta, .particle_meta {
          color: #6b7280 !important;
          font-weight: 600 !important;
        }
      `,
      });

      await new Promise((r) => setTimeout(r, 1500));

      await page.evaluate((h) => {
        const pages = document.querySelectorAll(".resume-page");
        if (!pages.length) return;
        pages[0].style.height = h + "px";
        pages[0].style.overflow = "hidden";
        for (let j = 1; j < pages.length; j++) pages[j].style.display = "none";
      }, A4_HEIGHT_PX);

      const rect = await page.evaluate(() => {
        const el = document.querySelector(".resume-page");
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.left),
          y: Math.round(r.top),
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      });

      if (!rect) throw new Error("No page");

      await page.screenshot({
        path: outputFilePath,
        type: "png",
        clip: { x: rect.x, y: rect.y, width: rect.width, height: A4_HEIGHT_PX },
      });

      console.log("✅");
    } catch (error) {
      console.log(`❌ ${error.message}`);
    } finally {
      if (page) await page.close();
    }
  }

  await browser.close();
  console.log("\n🎉 v20 Double Custom Complete.");
}

regenerateTargetedPreviews().catch(console.error);
