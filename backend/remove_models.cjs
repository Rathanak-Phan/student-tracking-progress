const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const modulesDir = path.join(srcDir, 'modules');

const modules = fs.readdirSync(modulesDir).filter(f => fs.statSync(path.join(modulesDir, f)).isDirectory());

let deletedCount = 0;

modules.forEach(mod => {
    const modelDirPath = path.join(modulesDir, mod, 'model');
    if (fs.existsSync(modelDirPath)) {
        // Delete all files inside the model directory first
        const files = fs.readdirSync(modelDirPath);
        files.forEach(file => {
            fs.unlinkSync(path.join(modelDirPath, file));
        });
        // Delete the directory itself
        fs.rmdirSync(modelDirPath);
        console.log(`Deleted model folder for module: ${mod}`);
        deletedCount++;
    }
});

console.log(`Total model folders deleted: ${deletedCount}`);
