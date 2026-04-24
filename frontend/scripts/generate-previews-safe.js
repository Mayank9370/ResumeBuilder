
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Running from root d:/Resume Builder/frontend-app
const REGISTRY_PATH = path.join(__dirname, 'src/features/resume-builder/constants/registry.generated.js');

console.log(`Reading registry from: ${REGISTRY_PATH}`);

let GENERATED_REGISTRY;
try {
    const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');
    
    if (start === -1 || end === -1 || end < start) {
        throw new Error("Could not find array brackets [] in registry file");
    }
    
    const jsonLike = raw.substring(start, end + 1);
    GENERATED_REGISTRY = new Function('return ' + jsonLike)();
    
    console.log(`✅ Registry parsed manually. Found ${GENERATED_REGISTRY.length} templates.`);
} catch (e) {
    console.error(`❌ Failed to parse registry:`, e);
    process.exit(1);
}

// --- TARGETED COLOR MAPPING (The "Hard Fix" List) ---
const TARGETS = {
    // Requested in previous turn
    'geometric-layers': '#8b5cf6', // Violet
    'neo-digital': '#10b981',      // Emerald
    'geometric-angular': '#ef4444',// Red
    'hexagon-tech': '#f59e0b',     // Amber
    'sleek-sidebar': '#ec4899',    // Pink
    'golden-sidebar': '#d97706',   // Gold

    // Mentioned in "Likely Cause" prompt
    'bold-horizon': '#7C3AED',      // Violet
    'creative-sidebar': '#059669',  // Emerald
    'clean-horizontal': '#DC2626',  // Red
    'galaxy-circle': '#D97706',     // Amber
};

// --- STRICT DATA FLAVORS ---
const MALE_DATA = {
    personal_info: {
        full_name: "James Anderson",
        jobTitle: "Project Manager",
        email: "james.anderson@example.com",
        phone: "+1 (555) 010-9988",
        location: "New York, NY",
        summary: "Dedicated Project Manager with 7 years of experience in leading cross-functional teams. Proven track record of delivering complex projects on time and within budget constraints.",
        image: "https://randomuser.me/api/portraits/men/32.jpg", 
        linkedin: "linkedin.com/in/jamesa",
        website: "jamesanderson.net"
    },
    sections_obj: {
        experience: [
             {
                id: "exp1",
                role: "Senior Project Manager",
                company: "TechFlow Solutions",
                location: "New York, NY",
                start_date: "2018",
                end_date: "Present",
                description: [
                    "Oversaw the successful launch of three enterprise-level software products.",
                    "Managed a budget of $2M and a team of 15 developers and designers."
                ]
            }
        ],
        projects: [
             {
                id: "proj1",
                title: "Cloud Migration Initiative",
                link: "techflow.com/cloud",
                start_date: "2021",
                end_date: "2022",
                description: "Lead the migration of legacy systems to AWS, reducing operational costs by 20%."
            }
        ],
        education: [
            {
                id: "edu1",
                degree: "B.S. Business Administration",
                institution: "University of Pennsylvania",
                location: "Philadelphia, PA",
                graduation_date: "2016",
                details: "Cum Laude. Member of the Management Club."
            }
        ],
        skills: {
            items: [
                "Agile Methodologies",
                "Risk Management",
                "JIRA & Confluence",
                "Stakeholder Comms"
            ]
        }
    },
    section_order: ["experience", "education", "projects", "skills"]
};

const FEMALE_DATA = {
    personal_info: {
        full_name: "Sophia Martinez",
        jobTitle: "Marketing Specialist",
        email: "sophia.m@example.com",
        phone: "+1 (555) 012-3456",
        location: "Austin, TX",
        summary: "Creative Marketing Specialist with a focus on digital strategy and brand growth. Skilled in social media campaigns, content creation, and market analysis.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        linkedin: "linkedin.com/in/sophia-m",
        website: "sophia-marketing.com"
    },
    sections_obj: {
        experience: [
             {
                id: "exp1",
                role: "Digital Marketing Lead",
                company: "Creative Pulse Agency",
                location: "Austin, TX",
                start_date: "2019",
                end_date: "Present",
                description: [
                    "Developed and executed social media strategies that increased follower count by 150%.",
                    "Coordinated with design teams to produce high-impact visual content for campaigns."
                ]
            }
        ],
        projects: [
             {
                id: "proj1",
                title: "Green Earth Campaign",
                link: "creativepulse.com/green",
                start_date: "2022",
                end_date: "2022",
                description: "Directed a nationwide awareness campaign reaching over 500k individuals."
            }
        ],
        education: [
            {
                id: "edu1",
                degree: "B.A. Communications",
                institution: "University of Texas",
                location: "Austin, TX",
                graduation_date: "2018",
                details: "Dean's List 2017-2018."
            }
        ],
        skills: {
            items: [
                "Social Media Strategy",
                "Content Creation",
                "Google Analytics",
                "Copywriting"
            ]
        }
    },
    section_order: ["experience", "education", "projects", "skills"]
};

const BASE_URL = 'http://localhost:3000/preview'; 
const TEMPLATE_DIRS = [
    path.join(__dirname, 'src/templates'),
    path.join(__dirname, 'src/features/resume-builder/templates')
];

function findTemplateDir(folderName, templateId) {
    for (const root of TEMPLATE_DIRS) {
        let attempt = path.join(root, folderName);
        if (fs.existsSync(attempt)) return attempt;
        
        if (folderName !== templateId) {
            attempt = path.join(root, templateId);
            if (fs.existsSync(attempt)) return attempt;
        }
    }
    return null;
}

async function generatePreviews() {
    console.log("🚀 Starting HARD-MODE COLOR CORRECTION...");
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: {
                width: 1200, 
                height: 1600,
                deviceScaleFactor: 2 
            }
        });
    } catch (e) {
        console.error("❌ Failed to launch puppeteer. Trying without 'new' headless mode...", e);
        browser = await puppeteer.launch({ headless: true });
    }

    const page = await browser.newPage();
    let successCount = 0;
    let failCount = 0;

    // Filter to targets
    const targets = GENERATED_REGISTRY.filter(t => TARGETS.hasOwnProperty(t.id));
    console.log(`ℹ️ Processing ${targets.length} priority templates...`);

    for (const template of targets) {
        const templateId = template.id;
        const targetColor = TARGETS[templateId];
        const folderName = template.__folder || templateId;
        
        const dataToUse = (successCount % 2 === 0) ? MALE_DATA : FEMALE_DATA;
        
        // Data color hint
        dataToUse.formatting = {
            spacing_scale: 1.0,
            accent_color: targetColor
        };

        const templateDir = findTemplateDir(folderName, templateId);
        
        if (!templateDir) {
            console.error(`⚠️  Template folder not found for: ${template.name} (${templateId})`);
            failCount++;
            continue;
        }

        const assetsDir = path.join(templateDir, 'assets');
        const outputFilePath = path.join(assetsDir, 'preview.png');

        console.log(`📸 Processing ${template.name} -> ${targetColor}...`);

        try {
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir, { recursive: true });
            }

            // Inject Data
            await page.evaluateOnNewDocument((data, color) => {
                sessionStorage.setItem('useEnhancedSampleData', 'custom');
                sessionStorage.setItem('customPreviewData', JSON.stringify(data));
                
                // Early Injection
                document.documentElement.style.setProperty('--resume-color-accent', color);
                document.documentElement.style.setProperty('--primary', color);
                document.documentElement.style.setProperty('--accent-color', color);
            }, dataToUse, targetColor);

            await page.goto(`${BASE_URL}/${templateId}?debug=false`, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });

            // --- HARD FIX: AGGRESSIVE BLUE REPLACEMENT ---
            await page.evaluate((targetColor) => {
                // Tailwind Blue-500, 600, 700 approximations in RGB
                // We map these specific blue values to our target color
                const blueMap = {
                    'rgb(59, 130, 246)': targetColor, // blue-500
                    'rgb(37, 99, 235)': targetColor,  // blue-600
                    'rgb(29, 78, 216)': targetColor,  // blue-700
                    'rgb(96, 165, 250)': targetColor, // blue-400
                    'rgba(59, 130, 246, 1)': targetColor,
                    '#3b82f6': targetColor,
                    '#2563eb': targetColor,
                    '#1d4ed8': targetColor
                };

                const elements = document.querySelectorAll('*');
                let replacedCount = 0;

                elements.forEach(el => {
                    const style = window.getComputedStyle(el);

                    // Check Background
                    if (blueMap[style.backgroundColor]) {
                        el.style.backgroundColor = targetColor;
                        el.style.setProperty('background-color', targetColor, 'important');
                        replacedCount++;
                    }

                    // Check Text Color
                    if (blueMap[style.color]) {
                        el.style.color = targetColor;
                        el.style.setProperty('color', targetColor, 'important');
                        replacedCount++;
                    }

                    // Check Border Color
                    if (blueMap[style.borderColor]) {
                        el.style.borderColor = targetColor;
                        el.style.setProperty('border-color', targetColor, 'important');
                        replacedCount++;
                    }
                });

                // SVG Fills
                document.querySelectorAll('svg [fill]').forEach(node => {
                    const fill = node.getAttribute('fill');
                    if (fill && (
                        fill.includes('#3b82f6') || 
                        fill.includes('#3B82F6') || 
                        fill.includes('rgb(59, 130, 246)')
                    )) {
                        node.setAttribute('fill', targetColor);
                        replacedCount++;
                    }
                });

                console.log(`[ColorFix] Replaced ${replacedCount} blue elements with ${targetColor}`);
                
                // Force CSS vars again
                document.documentElement.style.setProperty('--resume-color-accent', targetColor);
                document.documentElement.style.setProperty('--primary', targetColor);
                document.documentElement.style.setProperty('--accent-color', targetColor);

            }, targetColor);

            // Wait for repaint
            await new Promise(r => setTimeout(r, 1000));

            const element = await page.$('#resume-preview-container');
            
            if (element) {
                await element.screenshot({
                    path: outputFilePath,
                    type: 'png'
                });
                console.log(`   ✅ Saved to: .../${path.basename(templateDir)}/assets/preview.png`);
                successCount++;
            } else {
                console.error(`   ❌ Error: #resume-preview-container not found`);
                failCount++;
            }

        } catch (error) {
            console.error(`   ❌ FATAL ERROR for ${templateId}:`, error.message);
            failCount++;
        }
    }

    await browser.close();
    console.log(`\n🎉 Targeted Hard-Fix Complete!`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

generatePreviews().catch(console.error);
