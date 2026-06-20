const fs = require('fs');
const path = require('path');

const deleteFolderRecursive = function (directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file, index) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};

deleteFolderRecursive(path.join(__dirname, 'src/shared/repositories'));
if (fs.existsSync(path.join(__dirname, 'src/database/index.js'))) {
    fs.unlinkSync(path.join(__dirname, 'src/database/index.js'));
}
console.log('Deleted unused folders/files.');
