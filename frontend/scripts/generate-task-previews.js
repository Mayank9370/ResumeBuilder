import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
} catch (e) {
  console.error("❌ Failed to parse registry:", e.message);
  process.exit(1);
}

const ACTIVE_TEMPLATES = FULL_REGISTRY.filter(
  (t) => t.layoutStrategy === "LINEAR" || t.layoutStrategy === "DUAL_COLUMN",
);

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg
  ? parseInt(limitArg.split("=")[1], 10)
  : ACTIVE_TEMPLATES.length;

const isAll = process.argv.includes("--all");
// Always slice properly based on mode. Phase 1 is first 5. Phase 2 needs skip or all.
const offsetArg = process.argv.find((a) => a.startsWith("--offset="));
const offset = offsetArg ? parseInt(offsetArg.split("=")[1], 10) : 0;

let TARGETS = ACTIVE_TEMPLATES.slice(offset, offset + limit);

const targetIds = [
  "art-deco", "retro-typewriter", "essence", "legacy", 
  "tech-founder", "creative-director", "neon-cyber", "pastel-dream"
];
TARGETS = TARGETS.filter(t => targetIds.includes(t.id));

function buildData(isMale, accentColor) {
  const name = isMale ? "James Anderson" : "Sophia Martinez";
  const profession = isMale ? "Software Engineer" : "Frontend Developer";
  const email = isMale ? "james.a@email.com" : "sophia.m@email.com";
  const phone = isMale ? "+1 (415) 789-3456" : "+1 (512) 320-7788";
  const location = isMale ? "San Francisco, CA" : "Austin, TX";
  const photo = isMale
    ? "/preview-assets/male.jpg"
    : "/preview-assets/female.jpg";

  // Requirement: exactly 2 lines
  const summary = isMale
    ? "Backend developer with experience building scalable enterprise systems.\nFocused on performance, reliability, and clean architecture."
    : "Frontend developer with experience building scalable UI systems.\nFocused on performance, accessibility, and clean architecture.";

  // Requirement: Experience 2 items, 2 bullets each, 10-12 words per bullet
  const experience = [
    {
      id: "exp1",
      role: isMale ? "Backend Engineer" : "Frontend Engineer",
      company: isMale ? "TechNova Pvt Ltd" : "Creative Web Agency",
      location: location,
      start_date: "2021",
      end_date: "Present",
      description: [
        isMale
          ? "Architected scalable backend microservices using Node.js to enhance the system infrastructure."
          : "Developed scalable React components and cohesive UI systems for web environments.",
        isMale
          ? "Improved application performance by thirty-five percent resulting in faster query execution."
          : "Improved client satisfaction and overall engagement metrics consistently by forty percent."
      ],
    },
    {
      id: "exp2",
      role: "Software Developer",
      company: isMale ? "StartUp Inc" : "Design Solutions",
      location: location,
      start_date: "2018",
      end_date: "2021",
      description: [
        isMale
          ? "Built extensive RESTful APIs successfully supporting various mobile and web clients."
          : "Implemented highly responsive designs perfectly functioning across multiple modern device platforms.",
        isMale
          ? "Managed complex database design while automating crucial testing procedures without issues."
          : "Optimized crucial asset loading speeds while strictly enforcing thorough accessibility standards."
      ],
    },
  ];

  // Education: 1 item
  const education = [
    {
      id: "edu1",
      degree: "B.S. Computer Science",
      institution: isMale ? "Stanford University" : "University of Texas",
      location: location,
      start_date: "2014",
      graduation_date: "2018",
      description: [
        "Specialized heavily in programming logic, advanced data structures, and software engineering methodologies.",
        "Served proudly as the active President of the prestigious Computer Science Club."
      ],
      details:
        "Specialized heavily in programming logic, advanced data structures, and software engineering methodologies.\nServed proudly as the active President of the prestigious Computer Science Club.",
    },
  ];

  // Projects: 1 item, 2 bullets
  const projects = [
    {
      id: "proj1",
      title: isMale ? "E-Commerce API" : "Component Library",
      name: isMale ? "E-Commerce API" : "Component Library",
      subtitle: isMale ? "Open Source Project" : "Personal Project",
      link: isMale ? "github.com/janderson/api" : "github.com/smartinez/ui",
      start_date: "2022",
      end_date: "2023",
      description: [
        isMale
          ? "Designed a robust, high-throughput checkout system seamlessly handling thousands of daily transactions."
          : "Created a comprehensive, highly accessible component library quickly adopted by the community.",
        isMale
          ? "Implemented advanced caching strategies fundamentally improving overall system availability and response times."
          : "Enforced strict design tokens and provided detailed documentation for seamless community integration."
      ],
    },
  ];

  // Certifications: 1 item
  const certifications = [
    {
      id: "cert1",
      title: isMale ? "AWS Solutions Architect" : "Google Cloud Professional",
      issuer: isMale ? "Amazon Web Services" : "Google",
      date: "2022",
      description: [
        "Earned this official certification by effectively demonstrating strong expertise in cloud infrastructure.",
        "Successfully passed the rigorous examination covering advanced system design and security protocols."
      ]
    }
  ];

  // Skills: Exactly 4
  const skills = {
    items: ["JavaScript", "React", "Node.js", "CSS"],
  };

  const sections_obj = {
    professional_summary: summary,
    experience,
    education,
    projects,
    certifications,
    skills,
  };

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
    { id: "projects", type: "projects", title: "Key Projects", data: projects },
    { id: "education", type: "education", title: "Education", data: education },
    { id: "certifications", type: "certifications", title: "Certifications", data: certifications },
  ];

  const section_order = ["experience", "projects", "education", "certifications", "skills"];

  return {
    personal_info: {
      full_name: name,
      profession,
      jobTitle: profession,
      email,
      phone,
      location,
      photo,
      image: photo,
      avatar: photo,
      summary,
      socialLinks: [
        { id: 1, platform: "LinkedIn", url: "linkedin.com/in/user" },
        { id: 2, platform: "Portfolio", url: "myportfolio.dev" },
      ],
    },
    professional_summary: summary,
    sections,
    sections_obj,
    section_order,
    formatting: {
      spacing_scale: 0,
      section_spacing: 0,
      paragraph_spacing: 0,
      header_spacing: 0,
      font_family: "Inter",
      accent_color: accentColor,
    },
    theme: { accentColor, fontFamily: "Inter", fontSize: "10pt" },
    experience,
    education,
    projects,
    certifications,
    skills,
  };
}

const ACCENT_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
];

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

const BASE_URL = "http://localhost:5173/preview";

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      http
        .get(url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 500) {
            resolve(true);
          } else {
            retry();
          }
        })
        .on("error", retry);
    };

    const retry = () => {
      if (Date.now() - start > timeout) {
        reject(new Error("Dev server did not start within timeout"));
      } else {
        setTimeout(attempt, 500);
      }
    };

    attempt();
  });
}

async function generatePreviews() {
  console.log("⏳ Waiting for Vite dev server...");
  await waitForServer("http://localhost:5173");
  console.log("✅ Dev server detected. Starting preview generation.");

  const browser = await puppeteer
    .launch({
      headless: "new",
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--proxy-server='direct://'",
        "--proxy-bypass-list=*",
        "--disable-web-security"
      ],
    })
    .catch(() =>
      puppeteer.launch({
        headless: true,
        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--proxy-server='direct://'",
          "--proxy-bypass-list=*",
          "--disable-web-security"
        ],
      }),
    );

  for (let i = 0; i < TARGETS.length; i++) {
    const template = TARGETS[i];
    const templateId = template.id;
    const folderName = template.__folder || templateId;
    const isMale = i % 2 === 0;
    const accentColor = ACCENT_COLORS[i % ACCENT_COLORS.length];
    const data = buildData(isMale, accentColor);

    const templateDir = findTemplateDir(folderName, templateId);
    if (!templateDir) continue;

    const assetsDir = path.join(templateDir, "assets");
    const outputPath = path.join(assetsDir, "preview.png");
    console.log(
      `📸 [${i + 1}/${TARGETS.length}] ${templateId} with color ${accentColor}`,
    );

    let page;
    try {
      if (!fs.existsSync(assetsDir))
        fs.mkdirSync(assetsDir, { recursive: true });
      page = await browser.newPage();

      page.on("console", (msg) => {
        if (msg.type() === "error")
          console.log(`   [BROWSER ERROR] ${msg.text()}`);
      });
      page.on("requestfailed", (request) => {
        console.log(`   [REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText || request.errorText}`);
      });

      await page.setViewport({
        width: 1400,
        height: 3500,
        deviceScaleFactor: 2,
      });
      const targetUrl = `${BASE_URL}/${templateId}?debug=false`;

      const gotoWithRetry = async (url, options, maxRetries = 1) => {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            await page.goto(url, options);
            return;
          } catch (e) {
            if (attempt === maxRetries) {
              console.log(`Timeout on goto ${url}`);
              throw e;
            }
            console.log(`Retrying goto ${url} (attempt ${attempt + 1})`);
            await new Promise(r => setTimeout(r, 1000));
          }
        }
      };

      await gotoWithRetry(targetUrl, { waitUntil: "load", timeout: 30000 });

      await page.evaluate((d) => {
        sessionStorage.setItem("useEnhancedSampleData", "custom");
        sessionStorage.setItem("customPreviewData", JSON.stringify(d));
      }, data);

      await gotoWithRetry(targetUrl, { waitUntil: "load", timeout: 30000 });

      await page.waitForFunction(
        () => {
          const bodyText = document.body.innerText;
          return !bodyText.includes("Loading Preview Data");
        },
        { timeout: 10000 },
      );

      await page.waitForFunction(
        () => {
          const bodyText = document.body.innerText;
          return !bodyText.includes("Loading Preview Data");
        },
        { timeout: 10000 },
      ).catch((e) => {
        console.log('Timeout waiting for Loading Preview Data');
        throw e;
      });

      await page.waitForSelector(".resume-page", { timeout: 20000 }).catch((e) => {
        console.log('Timeout waiting for .resume-page selector');
        throw e;
      });

      await new Promise(r => setTimeout(r, 1500));

      await page.evaluate((color) => {
        const style = document.createElement("style");
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
                .resume-page { box-shadow: none !important; margin: 0 !important; transform: none !important; }
                body { background: #f3f4f6 !important; margin: 0; padding: 0; }
            `;
        document.head.appendChild(style);
      }, accentColor);

      await new Promise((r) => setTimeout(r, 2500));

      await page.setViewport({
        width: 1400,
        height: 3500,
        deviceScaleFactor: 1.424,
      });

      const rect = await page.evaluate(() => {
        const el = document.querySelector(".resume-page");
        if (el) {
          const r = el.getBoundingClientRect();
          return { x: r.left, y: r.top, width: r.width, height: r.height };
        }
        return null;
      });

      if (rect) {
        await page.screenshot({
          path: outputPath,
          clip: {
            x: Math.max(0, rect.x),
            y: Math.max(0, rect.y),
            width: rect.width,
            height: Math.min(rect.height, 1123),
          },
        });
        console.log(`✅ Success for ${templateId}`);
      } else {
        console.log(`❌ Failed: Could not get bounding rect for .resume-page`);
      }
    } catch (e) {
      console.log(`❌ Failed: ${e.message}`);
    } finally {
      if (page) await page.close();
    }
  }
  await browser.close();
  console.log("Done");
}

generatePreviews().catch(console.error);
