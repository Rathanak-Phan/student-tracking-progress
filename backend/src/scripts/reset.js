/**
 * Database Reset Script
 * Drops and recreates the database schema
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runScript = (scriptName) => {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [path.join(__dirname, scriptName)], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} failed with code ${code}`));
    });
  });
};

const reset = async () => {
  try {
    console.log('🔄 Resetting database...');
    await runScript('migrate.js');
    await runScript('seed.js');
    console.log('✅ Database reset successfully!');
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
};

reset();
