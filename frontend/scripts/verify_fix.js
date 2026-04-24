
import { GENERATED_REGISTRY } from './src/features/resume-builder/constants/registry.generated.js';

function analyzeRegistry(registry) {
    const idMap = new Map();
    const result = {
        duplicatesById: [],
    };

    registry.forEach((item) => {
        if (idMap.has(item.id)) {
            result.duplicatesById.push(item.id);
        }
        idMap.set(item.id, item);
    });

    return result;
}

const analysis = analyzeRegistry(GENERATED_REGISTRY);
console.log(JSON.stringify(analysis, null, 2));

if (analysis.duplicatesById.length === 0) {
    console.log("PASS: No duplicates found.");
    process.exit(0);
} else {
    console.error("FAIL: Duplicates remain.");
    process.exit(1);
}
