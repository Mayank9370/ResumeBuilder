import fs from 'fs';
const file = 'src/features/resume-builder/constants/registry.generated.js';
let content = fs.readFileSync(file, 'utf8');

const anchor1 = '    }';
const anchor2 = '];';
const parts = content.split('];');
if (parts.length >= 2) {
    const arrPart = parts[0];
    const newEntry = `    },
{
        "id": "horizon",
        "name": "The Horizon",
        "version": "1.0.0",
        "author": "Antigravity",
        "layoutStrategy": "LINEAR",
        "capabilities": { "photo": false, "geometric": false },
        "tags": ["Innovative", "Minimal", "Balanced"],
        "pricing": { "premium": false },
        "__folder": "horizon"
    }
`;
    // Find the last "    }" and replace it with the new entry
    const lastBraceIndex = arrPart.lastIndexOf('    }');
    if (lastBraceIndex !== -1) {
        const modifiedArr = arrPart.substring(0, lastBraceIndex) + newEntry;
        content = modifiedArr + '];' + parts.slice(1).join('];');
    }
}

content = content.replace('"teal-side-label": "minimalist"', '"teal-side-label": "minimalist",\n    "horizon": "horizon"');

fs.writeFileSync(file, content);
console.log("Patched registry successfully.");
