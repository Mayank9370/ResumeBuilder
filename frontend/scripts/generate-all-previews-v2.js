/**
 * generate-all-previews-v2.js
 *
 * Generates preview images ONLY for active templates (LINEAR + DUAL_COLUMN engine).
 * Replaces existing preview.png files.
 *
 * KEY FEATURES:
 *  - Targets only LINEAR & DUAL_COLUMN layout-strategy templates (currently 42)
 *  - Many sections per resume (experience, education, projects, awards, certifications,
 *    volunteering, 2 custom sections, skills) — 1 item per section
 *  - Every section item has: title/subtitle, date, exactly 2 description bullet points
 *  - Alternates male/female portrait images
 *  - Cycles through 10 accent colors
 *  - Captures A4 page 1 only (pixel-perfect crop)
 *
 * Usage:
 *   node generate-all-previews-v2.js            # first 10 templates (test run)
 *   node generate-all-previews-v2.js --all      # ALL 42 active templates
 *   node generate-all-previews-v2.js --start=10 # from index 10 onward
 */

import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── REGISTRY ─────────────────────────────────────────────────────────────────
const REGISTRY_PATH = path.join(
  __dirname,
  "src/features/resume-builder/constants/registry.generated.js",
);

let FULL_REGISTRY;
try {
  const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1)
    throw new Error("No array found in registry file");
  FULL_REGISTRY = new Function("return " + raw.substring(start, end + 1))();
  console.log(
    `✅ Registry parsed. Found ${FULL_REGISTRY.length} total templates.`,
  );
} catch (e) {
  console.error("❌ Failed to parse registry:", e.message);
  process.exit(1);
}

// ─── FILTER: Only active engine templates ─────────────────────────────────────
const ACTIVE_TEMPLATES = FULL_REGISTRY.filter(
  (t) => t.layoutStrategy === "LINEAR" || t.layoutStrategy === "DUAL_COLUMN",
);
console.log(
  `📋 Active (LINEAR + DUAL_COLUMN) templates: ${ACTIVE_TEMPLATES.length}`,
);

// ─── CLI ARGS ─────────────────────────────────────────────────────────────────
const isAll = process.argv.includes("--all");
const startArg = process.argv.find((a) => a.startsWith("--start="));
const startIndex = startArg ? parseInt(startArg.split("=")[1], 10) : 0;

let TARGETS = ACTIVE_TEMPLATES;
if (!isAll) {
  TARGETS = TARGETS.slice(startIndex, startIndex + 10); // default: first 10 as test
} else {
  TARGETS = TARGETS.slice(startIndex);
}

console.log(
  `🎯 Processing ${TARGETS.length} template(s) starting at index ${startIndex}\n`,
);

// ─── BUILD RESUME DATA ────────────────────────────────────────────────────────
/**
 * Builds rich resume data: many sections, 1 item per section, 2 bullets each.
 * @param {boolean} isMale
 * @param {string}  accentColor
 */
function buildData(isMale, accentColor = "#3b82f6") {
  const name = isMale ? "James Anderson" : "Sophia Martinez";
  const profession = isMale
    ? "Senior Software Engineer"
    : "Senior Product Manager";
  const email = isMale
    ? "james.anderson@email.com"
    : "sophia.martinez@email.com";
  const phone = isMale ? "+1 (415) 789-3456" : "+1 (512) 320-7788";
  const location = isMale ? "San Francisco, CA" : "Austin, TX";
  const photo = isMale
    ? "https://randomuser.me/api/portraits/men/32.jpg"
    : "https://randomuser.me/api/portraits/women/44.jpg";

  const summary = isMale
    ? "Highly accomplished Senior Software Engineer with eight years of experience building scalable enterprise web applications and architecting high-performance distributed systems using modern TypeScript and cloud architectures to drive measurable business value."
    : "Strategic Senior Product Manager with seven years of experience launching successful digital products in competitive global markets using data-driven research, cross-functional leadership, and deep analytical insights to deliver user-centric solutions.";

  // ── Experience — 1 item, 2 bullets ──
  const experience = [
    {
      id: "exp1",
      role: isMale ? "Senior Software Engineer" : "Senior Product Manager",
      company: isMale ? "TechCorp Industries" : "InnovateTech Solutions",
      location,
      start_date: "2020",
      end_date: "Present",
      description: [
        isMale
          ? "Architected and delivered a high-performance microservices platform serving 2M+ daily users, reducing API latency by 60% through advanced caching and load-balancing strategies."
          : "Led cross-functional product roadmap for flagship SaaS platform, driving 40% revenue growth by launching three major feature milestones ahead of schedule.",
        isMale
          ? "Mentored a team of 8 engineers through pair programming and systematic code reviews, increasing overall team velocity by 35% and improving release quality significantly."
          : "Collaborated with engineering, design, and data science to define KPIs and run A/B experiments that improved user retention by 25% within two quarters.",
      ],
    },
  ];

  // ── Education — 1 item, 2 bullets ──
  const education = [
    {
      id: "edu1",
      degree: isMale ? "B.S. Computer Science" : "B.S. Business Administration",
      institution: isMale ? "Stanford University" : "University of Texas",
      location: isMale ? "Stanford, CA" : "Austin, TX",
      start_date: "2012",
      graduation_date: "2016",
      description: [
        isMale
          ? "Graduated Summa Cum Laude with a 3.95 GPA, specializing in distributed systems and machine learning algorithms."
          : "Dean's List honoree for all four years with a 3.88 GPA, focusing on strategy and operations management.",
        isMale
          ? "President of the Computer Science Club; organized three annual hackathons with 200+ participants each semester."
          : "Founded the Women in Business Society, growing membership to 150+ students across all undergraduate years.",
      ],
      // Some templates read `details` instead
      details: isMale
        ? "Graduated Summa Cum Laude. Computer Science Club President."
        : "Dean's List all four years. Founded Women in Business Society.",
    },
  ];

  // ── Projects — 1 item, 2 bullets ──
  const projects = [
    {
      id: "proj1",
      title: isMale
        ? "GlobalScale API Platform"
        : "UserSense Analytics Dashboard",
      name: isMale
        ? "GlobalScale API Platform"
        : "UserSense Analytics Dashboard",
      subtitle: isMale
        ? "Open Source · github.com/janderson/globalscale"
        : "Internal Tool · innovatetech.io/usersense",
      link: isMale
        ? "github.com/janderson/globalscale"
        : "innovatetech.io/usersense",
      start_date: "2022",
      end_date: "2023",
      technologies: "React, Node.js, AWS, PostgreSQL",
      description: [
        isMale
          ? "Engineered a RESTful API gateway supporting 50+ microservices with automatic load balancing and achieving 99.99% uptime SLA across global regions."
          : "Built a real-time analytics dashboard using React and WebSocket streams, giving product teams instant visibility into user behavior and funnel metrics.",
        isMale
          ? "Implemented end-to-end observability with Prometheus and Grafana, cutting mean time to resolution for production incidents by 45%."
          : "Integrated data pipeline with Segment and BigQuery, enabling cohort-level analysis that directly informed 12 major product decisions per quarter.",
      ],
    },
  ];

  // ── Awards — 1 item, 2 bullets ──
  const awards = [
    {
      id: "aw1",
      title: isMale
        ? "Excellence in Engineering Award"
        : "Product Innovation Award",
      issuer: isMale ? "Tech Industry Association" : "Product Leaders Summit",
      date: "2023",
      description: [
        isMale
          ? "Recognized among the top 50 engineers under 35 for pioneering contributions to open-source distributed systems tooling used by millions worldwide."
          : "Honored for launching the most impactful product feature of the year, directly contributing to a 30% uplift in new subscriber growth across markets.",
        isMale
          ? "Selected from over 2,000 nominees nationwide; award presented at the annual National Technology Conference in Seattle, WA."
          : "Chosen from 500+ nominations across 12 countries; celebrated at the Global Product Excellence Gala held in San Francisco, CA.",
      ],
    },
  ];

  // ── Certifications — 1 item, 2 bullets ──
  const certifications = [
    {
      id: "cert1",
      name: isMale
        ? "AWS Certified Solutions Architect"
        : "Certified Product Manager (CPM)",
      issuer: isMale ? "Amazon Web Services" : "Product Management Institute",
      date: "2022",
      description: [
        isMale
          ? "Demonstrated expertise in designing highly available, cost-efficient, and fault-tolerant distributed cloud architectures across multiple AWS regions."
          : "Validated proficiency in agile product development, go-to-market strategy, and data-driven prioritization frameworks used by leading tech companies.",
        isMale
          ? "Applied certification knowledge to migrate three monolithic applications to serverless Lambda, reducing monthly cloud infrastructure costs by 38%."
          : "Leveraged certification frameworks to restructure the quarterly OKR process, improving team alignment and goal attainment rate by 20%.",
      ],
    },
  ];

  // ── Volunteering — 1 item, 2 bullets ──
  const volunteering = [
    {
      id: "vol1",
      role: isMale ? "Technical Mentor" : "Workshop Facilitator",
      organization: isMale ? "Code for Good" : "Women in Tech Austin",
      start_date: "2021",
      end_date: "Present",
      description: [
        isMale
          ? "Mentored 15 early-career engineers in system design, data structures, and interview preparation for software roles at top-tier technology companies."
          : "Facilitated monthly product thinking workshops for 40+ aspiring product managers, covering user research methodologies and roadmap strategy fundamentals.",
        isMale
          ? "Organized quarterly hackathons that raised $10,000 in STEM scholarships targeting underrepresented communities in technology across the Bay Area."
          : "Partnered with three local universities to deliver guest lectures on product management careers, reaching over 500 students annually.",
      ],
    },
  ];

  // ── Custom 1: Key Achievements — 1 item, 2 long bullets ──
  const custom_achievements = [
    {
      id: "ach1",
      title: isMale
        ? "Platform Scalability Initiative"
        : "Global Product Launch",
      subtitle: isMale
        ? "TechCorp Industries · 2022"
        : "InnovateTech Solutions · 2023",
      date: "2022",
      description: [
        isMale
          ? "Successfully led end-to-end architectural overhaul of the core financial processing engine by implementing fault-tolerant microservices and high-availability clusters, reducing transactional latency by 60% for millions of concurrent users during peak market periods."
          : "Orchestrated the end-to-end launch of the flagship product in 8 new international markets, coordinating cross-functional teams across engineering, marketing, legal, and customer support to deliver on time and 15% under budget.",
        isMale
          ? "Engineered a real-time auto-scaling solution leveraging Kubernetes HPA and custom Prometheus metrics, ensuring zero-downtime deployments and maintaining 99.99% SLA compliance across all production environments in three geographic regions."
          : "Defined the localization strategy and user research framework enabling culturally adapted product experiences, directly contributing to 50,000 new users and $2M in new ARR within the first 90 days of international expansion.",
      ],
    },
  ];

  // ── Custom 2: Professional Development — 1 item, 2 bullets ──
  const custom_professional_dev = [
    {
      id: "pd1",
      title: isMale
        ? "Speaker & Open Source Contributor"
        : "Keynote Speaker & Published Author",
      subtitle: isMale
        ? "Community & Industry Leadership"
        : "Thought Leadership",
      date: "2023",
      description: [
        isMale
          ? 'Delivered a keynote on "Modern Microservices Patterns" at NodeConf 2023, sharing architectural insights with 1,200+ attendees and receiving a 4.9 / 5 speaker rating.'
          : 'Authored "The Future of Product-Led Growth" published in Product Magazine, garnering 50,000+ reads and 2,000+ LinkedIn shares within the first week of release.',
        isMale
          ? "Contributed three merged pull requests to the OpenTelemetry open-source library, improving distributed tracing performance by 15% for millions of daily production users."
          : "Accepted a seat on the advisory board of ProductCon 2024, helping curate the conference program for over 3,000 product management professionals worldwide.",
      ],
    },
  ];

  // ── Skills (flat) ──
  const skills = {
    items: isMale
      ? [
          "TypeScript",
          "React",
          "Node.js",
          "AWS",
          "Kubernetes",
          "PostgreSQL",
          "Redis",
          "GraphQL",
        ]
      : [
          "Product Strategy",
          "Agile / Scrum",
          "Data Analysis",
          "A/B Testing",
          "SQL",
          "Figma",
          "JIRA",
          "Roadmapping",
        ],
  };

  const sections_obj = {
    professional_summary: summary,
    experience,
    education,
    projects,
    awards,
    certifications,
    volunteering,
    custom_achievements,
    custom_professional_dev,
    skills,
  };

  // sections array format (newer engines)
  const sections = [
    {
      id: "summary",
      type: "summary",
      title: "Professional Summary",
      data: summary,
    },
    {
      id: "experience",
      type: "experience",
      title: "Work Experience",
      data: experience,
    },
    { id: "education", type: "education", title: "Education", data: education },
    { id: "projects", type: "projects", title: "Key Projects", data: projects },
    { id: "awards", type: "awards", title: "Awards & Honors", data: awards },
    {
      id: "certifications",
      type: "certifications",
      title: "Certifications",
      data: certifications,
    },
    {
      id: "volunteering",
      type: "volunteering",
      title: "Volunteering",
      data: volunteering,
    },
    {
      id: "custom_achievements",
      type: "custom",
      title: "Key Achievements",
      data: custom_achievements,
    },
    {
      id: "custom_professional_dev",
      type: "custom",
      title: "Professional Development",
      data: custom_professional_dev,
    },
  ];

  const section_order = [
    "experience",
    "education",
    "projects",
    "awards",
    "certifications",
    "volunteering",
    "custom_achievements",
    "custom_professional_dev",
    "skills",
  ];

  return {
    personal_info: {
      full_name: name,
      profession,
      jobTitle: profession, // legacy alias
      email,
      phone,
      location,
      photo,
      image: photo, // legacy alias
      avatar: photo, // legacy alias
      summary,
      linkedin: isMale
        ? "linkedin.com/in/janderson"
        : "linkedin.com/in/smartinez",
      website: isMale ? "jamesanderson.dev" : "sophiamartinez.pm",
      portfolio: isMale ? "jamesanderson.dev" : "sophiamartinez.pm",
      socialLinks: [
        {
          id: 1,
          platform: "LinkedIn",
          url: isMale
            ? "linkedin.com/in/janderson"
            : "linkedin.com/in/smartinez",
        },
        {
          id: 2,
          platform: "Portfolio",
          url: isMale ? "jamesanderson.dev" : "sophiamartinez.pm",
        },
      ],
    },
    professional_summary: summary,
    sections,
    sections_obj,
    section_order,
    formatting: {
      spacing_scale: 1.0,
      section_spacing: 1.0,
      paragraph_spacing: 0.5,
      header_spacing: 1.0,
      heading_scale: 1.0,
      subheading_scale: 1.0,
      font_family: "Inter",
      font_size_scale: 1.0,
      line_height_scale: 1.0,
      accent_color: accentColor,
    },
    theme: { accentColor, fontFamily: "Inter", fontSize: "10pt" },
    // top-level shortcuts some templates read directly
    experience,
    education,
    projects,
    skills,
  };
}

// ─── ACCENT COLOR ROTATION ─────────────────────────────────────────────────────
const ACCENT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#ef4444", // red
  "#f59e0b", // amber
  "#ec4899", // pink
  "#14b8a6", // teal
  "#6366f1", // indigo
  "#f97316", // orange
  "#06b6d4", // cyan
];

// ─── TEMPLATE DIRS ─────────────────────────────────────────────────────────────
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

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:5173/preview";
const A4_HEIGHT = 1123; // A4 px at 96dpi

// ─── MAIN ──────────────────────────────────────────────────────────────────────
async function generatePreviews() {
  console.log(`🚀 Starting Preview Generator v2`);
  console.log(`   Targets : ${TARGETS.length} templates\n`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  } catch (_) {
    browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  }

  let successCount = 0;
  let failCount = 0;
  const failures = [];

  for (let i = 0; i < TARGETS.length; i++) {
    const template = TARGETS[i];
    const templateId = template.id;
    const folderName = template.__folder || templateId;
    const isMale = i % 2 === 0;
    const accentColor = ACCENT_COLORS[i % ACCENT_COLORS.length];
    const data = buildData(isMale, accentColor);
    const gender = isMale ? "♂" : "♀";
    const strategy = template.layoutStrategy;

    const templateDir = findTemplateDir(folderName, templateId);
    if (!templateDir) {
      console.warn(
        `⚠️  [${i + 1}/${TARGETS.length}] ${templateId} — folder not found, skipping`,
      );
      failCount++;
      failures.push({ id: templateId, reason: "folder not found" });
      continue;
    }

        const assetsDir  = path.join(templateDir, 'assets');
        const outputPath = path.join(assetsDir, 'preview.png');
        const debugPath  = path.join(assetsDir, 'error_debug.png');

        console.log(`📸 [${i + 1}/${TARGETS.length}] [${strategy}] ${template.name} (${templateId}) ${gender}…`);

        let page;
        try {
            if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

            page = await browser.newPage();
            // console.log("   [DEBUG] Page created");
            
            // Capture console logs from browser
            page.on('console', msg => {
                if (msg.type() === 'error') console.log(`   [BROWSER ERROR] ${msg.text()}`);
                // else console.log(`   [BROWSER LOG] ${msg.text()}`);
            });

            await page.setViewport({ width: 1400, height: 3500, deviceScaleFactor: 1 });

            // 1️⃣  Hit the origin
            const targetUrl = `${BASE_URL}/${templateId}?debug=false`;
            // console.log(`   [DEBUG] Going to ${targetUrl}`);
            await page.goto(targetUrl, { waitUntil: 'load', timeout: 30000 });

            // 2️⃣  Inject data
            // console.log(`   [DEBUG] Injecting storage items`);
            await page.evaluate((d) => {
                sessionStorage.setItem('useEnhancedSampleData', 'custom');
                sessionStorage.setItem('customPreviewData', JSON.stringify(d));
            }, data);

            // 3️⃣  Reload
            // console.log(`   [DEBUG] Navigating again to confirm data`);
            await page.goto(targetUrl, { waitUntil: 'load', timeout: 30000 });

            // 4️⃣  Wait for data load visibility
            // console.log(`   [DEBUG] Waiting for Loading Preview Data to disappear`);
            await page.waitForFunction(() => {
                const bodyText = document.body.innerText;
                return !bodyText.includes('Loading Preview Data');
            }, { timeout: 10000 });

            // 5️⃣  Wait for content with a more relaxed check first
            // console.log(`   [DEBUG] Waiting for .resume-page`);
            await page.waitForSelector('.resume-page', { timeout: 20000 });
            
            const targetName = data.personal_info.full_name;
            // console.log(`   [DEBUG] Waiting for name "${targetName}" in page`);
            await page.waitForFunction((name) => {
                const el = document.querySelector('.resume-page');
                return el && el.innerText.includes(name);
            }, { timeout: 20000 }, targetName);

            // 6️⃣  Wait for images
            await page.evaluate(async () => {
                const imgs = Array.from(document.images);
                await Promise.all(
                    imgs.map((img) =>
                        img.complete ? Promise.resolve() : new Promise((res) => { 
                            const t = setTimeout(res, 3000); 
                            img.onload = () => { clearTimeout(t); res(); }; 
                            img.onerror = () => { clearTimeout(t); res(); }; 
                        })
                    )
                );
            });

            // 7️⃣  CSS Injection
            await page.evaluate((color) => {
                const style = document.createElement('style');
                style.innerHTML = `
                    :root {
                        --resume-accent-color: ${color} !important;
                        --resume-primary-color: ${color} !important;
                        --resume-color-accent: ${color} !important;
                        --resume-color-header: ${color} !important;
                        --theme-primary: ${color} !important;
                        --accent: ${color} !important;
                    }
                    .accent-bg { background-color: ${color} !important; }
                    .accent-text { color: ${color} !important; }
                    .accent-border { border-color: ${color} !important; }
                    .resume-page { 
                        background-color: white !important; 
                        box-shadow: none !important; 
                        margin: 0 !important;
                        transform: none !important;
                    }
                    body { background: #f3f4f6 !important; }
                `;
                document.head.appendChild(style);
            }, accentColor);

            // 8️⃣  Settle
            await new Promise((r) => setTimeout(r, 2500));

            // 9️⃣  Clip preparation
            await page.evaluate((h) => {
                const pages = document.querySelectorAll('.resume-page');
                if (!pages.length) return;
                pages[0].style.height = h + 'px';
                pages[0].style.minHeight = h + 'px';
                pages[0].style.maxHeight = h + 'px';
                pages[0].style.overflow = 'hidden';
                pages[0].style.visibility = 'visible';
                pages[0].style.opacity = '1';
                for (let j = 1; j < pages.length; j++) pages[j].style.display = 'none';
                document.body.style.margin = '0';
                document.body.style.padding = '0';
                window.scrollTo(0, 0);
            }, A4_HEIGHT);

            // 🔟  Screenshot
            const rect = await page.evaluate(() => {
                const el = document.querySelector('.resume-page');
                if (!el) return null;
                const r = el.getBoundingClientRect();
                return { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
            });

            if (!rect || rect.width === 0 || rect.height === 0) {
                throw new Error(`Invalid Rect: ${JSON.stringify(rect)}`);
            }

            await page.screenshot({
                path: outputPath,
                clip: { x: Math.max(0, rect.x), y: Math.max(0, rect.y), width: rect.width, height: A4_HEIGHT }
            });

            const size = fs.statSync(outputPath).size;
            console.log(`   ✅ Success (${Math.round(size/1024)}KB)`);
            successCount++;
        } catch (err) {
            console.log(`   ❌ Failed: ${err.message}`);
            if (page) {
                try {
                    const html = await page.content();
                    const bodyText = await page.evaluate(() => document.body.innerText);
                    fs.writeFileSync(path.join(assetsDir, 'error_log.txt'), 
                        `URL: ${page.url()}\nError: ${err.message}\nBody Text:\n${bodyText.substring(0, 5000)}`);
                    await page.screenshot({ path: debugPath, fullPage: true });
                } catch (sw) {}
            }
            failCount++;
            failures.push({ id: templateId, reason: err.message });
        } finally {
            if (page) await page.close();
        }
    }

  await browser.close();

  console.log("\n─────────────────────────────────────────────");
  console.log(
    `🎉 Done!  ✅ ${successCount} succeeded   ❌ ${failCount} failed`,
  );
  if (failures.length > 0) {
    console.log("\nFailed templates:");
    failures.forEach(({ id, reason }) => console.log(`  • ${id}: ${reason}`));
  }
  console.log("─────────────────────────────────────────────\n");
}

generatePreviews().catch(console.error);
