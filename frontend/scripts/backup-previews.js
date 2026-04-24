
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Roots to search
const SOURCE_ROOTS = [
    path.join(__dirname, 'src/templates'),
    path.join(__dirname, 'src/features/resume-builder/templates')
];

const BACKUP_ROOT = path.join(__dirname, 'preview-backups');

console.log("🚀 Starting Preview Backup Process (SAFE MODE)...");
console.log(`📂 Backup Target: ${BACKUP_ROOT}`);

if (!fs.existsSync(BACKUP_ROOT)) {
    fs.mkdirSync(BACKUP_ROOT);
    console.log("✅ Created backup root directory.");
}

let copiedCount = 0;
let missedCount = 0;

for (const sourceRoot of SOURCE_ROOTS) {
    if (!fs.existsSync(sourceRoot)) {
        console.warn(`⚠️  Source root not found: ${sourceRoot}`);
        continue;
    }

    const templates = fs.readdirSync(sourceRoot, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const template of templates) {
        const templatePath = path.join(sourceRoot, template);
        const previewPath = path.join(templatePath, 'assets', 'preview.png');

        if (fs.existsSync(previewPath)) {
            // Target specific folder
            const targetFolder = path.join(BACKUP_ROOT, template);
            const targetFile = path.join(targetFolder, 'preview.png');

            // 1. Create subfolder
            if (!fs.existsSync(targetFolder)) {
                fs.mkdirSync(targetFolder, { recursive: true });
            }

            // 2. Copy File (Overwrite allowed in backup, but we log it)
            try {
                fs.copyFileSync(previewPath, targetFile);
                console.log(`✅ Backed up: ${template}/preview.png`);
                copiedCount++;
            } catch (err) {
                console.error(`❌ Failed to copy ${template}:`, err.message);
            }
        } else {
            console.warn(`⚠️  No preview.png found for: ${template}`);
            missedCount++;
        }
    }
}

console.log(`\n🎉 Backup Complete!`);
console.log(`Copied: ${copiedCount}`);
console.log(`Missing/Skipped: ${missedCount}`);
