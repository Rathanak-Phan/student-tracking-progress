import fs from 'fs';
import path from 'path';

const adminPath = './src/modules/admin';

const reorganizeSubModule = (parentPath, moduleName, singularName) => {
  const modPath = path.join(parentPath, moduleName);
  if (!fs.existsSync(modPath) || !fs.lstatSync(modPath).isDirectory()) return;

  const dirs = ['controller', 'service', 'repository', 'routes'];
  
  dirs.forEach(dir => {
    const dirPath = path.join(modPath, dir);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  });

  const fileMap = {
    [`${singularName}.controller.js`]: 'controller/index.js',
    [`${singularName}.service.js`]: 'service/index.js',
    [`${singularName}.repository.js`]: 'repository/index.js',
    [`${singularName}.routes.js`]: 'routes/index.js'
  };

  Object.entries(fileMap).forEach(([oldFile, newFile]) => {
    const oldPath = path.join(modPath, oldFile);
    const newPath = path.join(modPath, newFile);

    if (fs.existsSync(oldPath)) {
      let content = fs.readFileSync(oldPath, 'utf8');
      
      // Fix internal imports
      content = content.replace(new RegExp(`./${singularName}.service.js`, 'g'), '../service/index.js');
      content = content.replace(new RegExp(`./${singularName}.repository.js`, 'g'), '../repository/index.js');
      content = content.replace(new RegExp(`./${singularName}.controller.js`, 'g'), '../controller/index.js');
      
      // Fix global imports (using relative paths, so we need to be careful)
      // Since these are in src/modules/admin/NAME/, they are 3 levels deep from src/
      content = content.replace(/..\/..\/..\/middlewares\//g, '../../../shared/middleware/');
      content = content.replace(/..\/..\/..\/utils\//g, '../../../shared/utils/');
      
      fs.writeFileSync(newPath, content);
      console.log(`Updated ${newPath}`);
      fs.unlinkSync(oldPath);
    }
  });

  // Create sub-module index.js
  const indexContent = `import * as controller from './controller/index.js';
import * as service from './service/index.js';
import * as repository from './repository/index.js';
import routes from './routes/index.js';

export {
  controller,
  service,
  repository,
  routes
};
`;
  fs.writeFileSync(path.join(modPath, 'index.js'), indexContent);
};

const adminModules = [
  { name: 'users', singular: 'user' },
  { name: 'classes', singular: 'class' },
  { name: 'teachers', singular: 'teacher' },
  { name: 'dashboard', singular: 'dashboard' },
  { name: 'logs', singular: 'log' }
];

adminModules.forEach(m => {
  try {
    reorganizeSubModule(adminPath, m.name, m.singular);
  } catch (err) {
    console.error(`Error in admin/${m.name}: ${err.message}`);
  }
});

// Final move for admin.routes.js
const oldAdminRoutes = path.join(adminPath, 'admin.routes.js');
const newAdminRoutesDir = path.join(adminPath, 'routes');
if (!fs.existsSync(newAdminRoutesDir)) fs.mkdirSync(newAdminRoutesDir);
const newAdminRoutes = path.join(newAdminRoutesDir, 'index.js');

if (fs.existsSync(oldAdminRoutes)) {
  let content = fs.readFileSync(oldAdminRoutes, 'utf8');
  // Fix sub-route imports in admin.routes.js
  // Old: import userRoutes from "./users/user.routes.js";
  // New: import { routes as userRoutes } from "./users/index.js";
  adminModules.forEach(m => {
    content = content.replace(new RegExp(`./${m.name}/${m.singular}.routes.js`, 'g'), `./${m.name}/index.js`);
  });
  
  // Also update how they are imported if they were default imports
  // But usually they were imported as 'userRoutes'
  // I'll manually check admin.routes.js content first.
}
