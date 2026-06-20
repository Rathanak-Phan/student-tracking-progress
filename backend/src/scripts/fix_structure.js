import fs from 'fs';
import path from 'path';

const modulesPath = './src/modules';

const reorganizeModule = (moduleName, singularName) => {
  const modPath = path.join(modulesPath, moduleName);
  const dirs = ['controller', 'service', 'repository', 'model', 'routes', 'validation'];
  
  dirs.forEach(dir => {
    const dirPath = path.join(modPath, dir);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  });

  const fileMap = {
    [`${singularName}.controller.js`]: 'controller/index.js',
    [`${singularName}.service.js`]: 'service/index.js',
    [`${singularName}.repository.js`]: 'repository/index.js',
    [`${singularName}.routes.js`]: 'routes/index.js',
    [`${singularName}.validation.js`]: 'validation/index.js',
    [`model/${singularName}.model.js`]: 'model/index.js'
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
      content = content.replace(new RegExp(`./${singularName}.validation.js`, 'g'), '../validation/index.js');
      
      // Fix global imports
      content = content.replace(/..\/..\/core\/utils\/asyncHandler.js/g, '../../shared/utils/asyncHandler.js');
      content = content.replace(/..\/..\/core\/middlewares\//g, '../../shared/middleware/');
      content = content.replace(/..\/..\/middlewares\//g, '../../shared/middleware/');
      content = content.replace(/..\/..\/utils\//g, '../../shared/utils/');
      
      fs.writeFileSync(newPath, content);
      console.log(`Updated ${newPath}`);
      // fs.unlinkSync(oldPath); // Keep for safety or delete later
    }
  });

  // Create module index.js
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

const modules = [
  { name: 'auth', singular: 'auth' },
  { name: 'assignments', singular: 'assignment' },
  { name: 'submissions', singular: 'submission' },
  { name: 'grades', singular: 'grade' },
  { name: 'dashboard', singular: 'dashboard' },
  { name: 'materials', singular: 'material' },
  { name: 'goals', singular: 'goal' },
  { name: 'messages', singular: 'message' },
  { name: 'students', singular: 'student' },
  { name: 'logs', singular: 'log' },
  { name: 'permissions', singular: 'permission' }
];

modules.forEach(m => {
  try {
    reorganizeModule(m.name, m.singular);
  } catch (err) {
    console.error(`Error in ${m.name}: ${err.message}`);
  }
});
