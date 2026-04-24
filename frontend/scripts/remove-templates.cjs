const fs = require('fs');

const file = 'd:/Builder/Builder(Fixed)/frontend/src/features/resume-builder/constants/registry.generated.js';
let content = fs.readFileSync(file, 'utf8');

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

templatesToHide.forEach(templateName => {
    const regex = new RegExp(`\\{\\s*(?:[^{}]*)*"name": "${templateName}"[\\s\\S]*?\\},?`, 'g');
    content = content.replace(regex, '');
});

// Clean up any double commas or commas at the end of the array
content = content.replace(/,\s*,/g, ',');
content = content.replace(/,\s*\]/, '\n]');

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully removed templates from registry.');
