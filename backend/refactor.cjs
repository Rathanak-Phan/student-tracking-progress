const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const modulesDir = path.join(srcDir, 'modules');

const singularize = (word) => {
    const rules = {
        'analytics': 'analytics',
        'auth': 'auth',
        'admin': 'admin',
        'dashboard': 'dashboard',
        'classes': 'class'
    };
    if (rules[word]) return rules[word];
    if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
    if (word.endsWith('ses')) return word.slice(0, -2);
    if (word.endsWith('s')) return word.slice(0, -1);
    return word;
};

// 1. Gather all files that need to be renamed
const renames = []; 
const modules = fs.readdirSync(modulesDir).filter(f => fs.statSync(path.join(modulesDir, f)).isDirectory());

modules.forEach(mod => {
    const modDir = path.join(modulesDir, mod);
    const singularMod = singularize(mod);
    
    const subfolders = fs.readdirSync(modDir).filter(f => fs.statSync(path.join(modDir, f)).isDirectory());
    subfolders.forEach(sub => {
        const subDir = path.join(modDir, sub);
        const indexPath = path.join(subDir, 'index.js');
        
        if (fs.existsSync(indexPath)) {
            const newFileName = `${singularMod}.${sub}.js`;
            const newPath = path.join(subDir, newFileName);
            
            if (fs.existsSync(newPath)) {
                console.log(`Skipping rename of ${indexPath} because ${newPath} already exists.`);
            } else {
                renames.push({
                    oldPath: indexPath,
                    newPath: newPath,
                    oldFileRelative: `${mod}/${sub}/index.js`,
                    newFileRelative: `${mod}/${sub}/${newFileName}`,
                    singularMod,
                    subFolder: sub,
                    moduleName: mod
                });
            }
        }
    });
});

console.log(`Found ${renames.length} index.js files to rename.`);

// Perform renames
renames.forEach(r => {
    fs.renameSync(r.oldPath, r.newPath);
    console.log(`Renamed: ${r.oldFileRelative} -> ${r.newFileRelative}`);
});

// 2. Update imports in ALL .js files
function getAllJsFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllJsFiles(fullPath));
        } else if (file.endsWith('.js')) {
            results.push(fullPath);
        }
    });
    return results;
}

const allFiles = getAllJsFiles(srcDir);
let changedFilesCount = 0;

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    const importRegex = /(import\s+.*?from\s+['"])(.*?)(['"])/g;
    const exportRegex = /(export\s+.*?from\s+['"])(.*?)(['"])/g;
    const dynamicImportRegex = /(import\(['"])(.*?)(['"]\))/g;
    
    const replacer = (match, p1, p2, p3) => {
        if (!p2.startsWith('.')) return match; 
        
        const fileDir = path.dirname(file);
        let importPath = p2;
        let resolvedAbsolute = path.resolve(fileDir, importPath);
        
        let possibleOldPaths = [
            resolvedAbsolute,
            path.join(resolvedAbsolute, 'index.js'),
            resolvedAbsolute + '.js'
        ];
        
        for (const r of renames) {
            if (possibleOldPaths.includes(r.oldPath)) {
                let newRel = path.relative(fileDir, r.newPath);
                if (!newRel.startsWith('.')) {
                    newRel = './' + newRel;
                }
                console.log(`Updating import in ${path.relative(srcDir, file)}: ${p2} -> ${newRel}`);
                return `${p1}${newRel}${p3}`;
            }
        }
        
        return match;
    };
    
    content = content.replace(importRegex, replacer);
    content = content.replace(exportRegex, replacer);
    content = content.replace(dynamicImportRegex, replacer);
    
    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        changedFilesCount++;
    }
});

console.log(`Updated imports in ${changedFilesCount} files.`);
