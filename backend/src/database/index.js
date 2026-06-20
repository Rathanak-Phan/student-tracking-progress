import { Sequelize } from 'sequelize';
import dbConfig from '../config/database.js';
import initModels from './models/init-models.js';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const models = initModels(sequelize);

const db = {
  sequelize,
  Sequelize,
  models
};

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected via Sequelize');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export { initializeDatabase };
export default db;
