const fs = require('fs');
const registryFile = 'd:/Builder/New folder (2)/Builder2/frontend/src/features/resume-builder/constants/registry.generated.js';

let content = fs.readFileSync(registryFile, 'utf8');

const newTemplate = `,
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
];`;

content = content.replace(/    \}\n\];/, '    }' + newTemplate);

const newPath = `    "teal-side-label": "minimalist",\n    "horizon": "horizon"\n};`;
content = content.replace(/    "teal-side-label": "minimalist"\n\};/, newPath);

fs.writeFileSync(registryFile, content);
console.log("Registry updated for horizon template.");
