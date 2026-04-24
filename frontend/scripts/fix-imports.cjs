const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('src');

function getOldPathFromNew(newPathRel) {
    if (newPathRel.startsWith('app/')) return newPathRel.replace('app/', '');
    if (newPathRel.startsWith('styles/')) return newPathRel.replace('styles/', '');
    if (newPathRel.startsWith('shared/components/')) return newPathRel.replace('shared/components/', 'components/');
    if (newPathRel.startsWith('shared/utils/')) return newPathRel.replace('shared/utils/', 'utils/');
    if (newPathRel.startsWith('shared/hooks/')) return newPathRel.replace('shared/hooks/', 'features/resume-builder/hooks/');
    if (newPathRel.startsWith('core/engine/')) return newPathRel.replace('core/engine/', 'features/resume-builder/engine/');
    if (newPathRel.startsWith('modules/templates/linear/')) return newPathRel.replace('modules/templates/linear/', 'templates/');
    if (newPathRel.startsWith('modules/templates/dual-column/')) return newPathRel.replace('modules/templates/dual-column/', 'templates/');
    if (newPathRel.startsWith('modules/templates/shared/')) return newPathRel.replace('modules/templates/shared/', 'templates/');
    if (newPathRel.startsWith('modules/')) return newPathRel.replace('modules/', 'features/');
    return newPathRel;
}

function getNewPathFromOld(oldPathRel) {
    if (oldPathRel === 'App.jsx' || oldPathRel === 'main.jsx') return 'app/' + oldPathRel;
    if (oldPathRel === 'index.css' || oldPathRel === 'App.css') return 'styles/' + oldPathRel;
    if (oldPathRel.startsWith('components/')) return oldPathRel.replace('components/', 'shared/components/');
    if (oldPathRel.startsWith('utils/')) return oldPathRel.replace('utils/', 'shared/utils/');
    if (oldPathRel.startsWith('features/resume-builder/hooks/useStableImage')) return oldPathRel.replace('features/resume-builder/hooks/', 'shared/hooks/');
    if (oldPathRel.startsWith('features/resume-builder/engine/')) return oldPathRel.replace('features/resume-builder/engine/', 'core/engine/');
    
    if (oldPathRel.startsWith('templates/')) {
        const t = oldPathRel.split('/')[1];
        if (fs.existsSync(path.join(srcDir, `modules/templates/dual-column/${t}`))) 
            return oldPathRel.replace('templates/', 'modules/templates/dual-column/');
        else if (fs.existsSync(path.join(srcDir, `modules/templates/shared/${t}`))) 
            return oldPathRel.replace('templates/', 'modules/templates/shared/');
        return oldPathRel.replace('templates/', 'modules/templates/linear/');
    }
    if (oldPathRel.startsWith('features/')) return oldPathRel.replace('features/', 'modules/');
    return oldPathRel;
}

function walk(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            walk(fullPath);
        } else if (/\.(js|jsx)$/.test(file.name)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const relativeToSrc = path.relative(srcDir, fullPath).replace(/\\/g, '/');
            const oldPathRel = getOldPathFromNew(relativeToSrc);
            const oldDirRel = path.dirname(oldPathRel);

            let modified = false;
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                if ((line.includes('import ') || line.includes('import(') || line.includes('export ')) && line.includes('from ') || line.includes('import')) {
                    if (line.includes("'./") || line.includes("'../") || line.includes('\"./') || line.includes('\"../')) {
                        const importQuote = line.includes("'") ? "'" : '"';
                        const parts = line.split(importQuote);
                        if (parts.length >= 3) {
                            const importTarget = parts[parts.length - 2]; 
                            if (importTarget.startsWith('.')) {
                                const oldTargetAbs = path.resolve(path.join(srcDir, oldDirRel), importTarget).replace(/\\/g, '/');
                                if (oldTargetAbs.indexOf('/src/') === -1) continue;
                                let oldTargetRel = oldTargetAbs.substring(oldTargetAbs.indexOf('/src/') + 5);
                                
                                let ext = '';
                                if (!path.extname(oldTargetRel)) {
                                    if (fs.existsSync(path.join(srcDir, getNewPathFromOld(oldTargetRel + '.js')))) ext = '.js';
                                    else if (fs.existsSync(path.join(srcDir, getNewPathFromOld(oldTargetRel + '.jsx')))) ext = '.jsx';
                                    else if (fs.existsSync(path.join(srcDir, getNewPathFromOld(oldTargetRel + '/index.js')))) ext = '/index.js';
                                    else if (fs.existsSync(path.join(srcDir, getNewPathFromOld(oldTargetRel + '/index.jsx')))) ext = '/index.jsx';
                                    else if (fs.existsSync(path.join(srcDir, getNewPathFromOld(oldTargetRel + '.css')))) ext = '.css';
                                }

                                const oldTargetWithExt = oldTargetRel + ext;
                                const newTargetRel = getNewPathFromOld(oldTargetWithExt);
                                let finalAliasTarget = newTargetRel.replace(/\.jsx?$/, '').replace(/\/index$/, '');
                                
                                const newAlias = '@/' + finalAliasTarget;
                                lines[i] = line.replace(importTarget, newAlias);
                                modified = true;
                            }
                        }
                    }
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
                console.log('Fixed imports in ' + relativeToSrc);
            }
        }
    }
}
walk(srcDir);
