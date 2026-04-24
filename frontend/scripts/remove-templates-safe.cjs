const fs = require('fs');

const file = 'd:/Builder/Builder(Fixed)/frontend/src/features/resume-builder/constants/registry.generated.js';
let content = fs.readFileSync(file, 'utf8');

const startStr = 'export const GENERATED_REGISTRY = ';
const startIdx = content.indexOf(startStr);
if (startIdx === -1) {
    console.error("Could not find start");
    process.exit(1);
}

const start = startIdx + startStr.length;
const end = content.lastIndexOf(']');
if (end === -1) {
    console.error("Could not find end bracket");
    process.exit(1);
}

const arrayStr = content.substring(start, end + 1);

let array = [];
try {
    array = eval('(' + arrayStr + ')');
} catch (e) {
    console.error("Failed to parse array:", e);
    process.exit(1);
}

const templatesToHide = [
    'Art Deco',
    'Neon Cyber',
    'Tech Founder',
    'Organic Flow',
    'Split Horizon',
    'The Senator',
    'Elegant Duo',
    'Corporate Classic',
    'Soft UI',
    'Modern Split',
    'Exec Brief'
];

const filtered = array.filter(t => !templatesToHide.includes(t.name));

const newContent = content.substring(0, start) + JSON.stringify(filtered, null, 4) + ';\n';

fs.writeFileSync(file, newContent, 'utf8');
console.log(`Successfully removed ${array.length - filtered.length} templates. Remaining: ${filtered.length}.`);
