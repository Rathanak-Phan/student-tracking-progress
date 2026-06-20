const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src/database/models');
const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js') && f !== 'init-models.js');

const hasUpdatedAt = ['teacher_requests.js', 'user_profiles.js', 'users.js'];

for (const file of files) {
  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('timestamps: true')) {
    const isUpdated = hasUpdatedAt.includes(file);
    const replacement = `timestamps: true,\n    createdAt: 'created_at',\n    updatedAt: ${isUpdated ? "'updated_at'" : "false"}`;
    content = content.replace('timestamps: true', replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
