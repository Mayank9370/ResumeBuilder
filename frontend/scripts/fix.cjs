const fs = require('fs');
const path = 'src/features/resume-builder/engine/strategies/LinearLayoutStrategy.jsx';
const code = fs.readFileSync(path, 'utf8');
const isCRLF = code.includes('\r\n');
const lines = code.split(/\r?\n/);

if (lines[192].includes('keepWithNext')) {
    lines[192] = '';
}
if (lines[235].includes('keepWithNext')) {
    lines[235] = '';
}

fs.writeFileSync(path, lines.join(isCRLF ? '\r\n' : '\n'));
console.log('Script completed successfully');
