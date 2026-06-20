'use strict';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    return queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { username: 'admin' }, {});
  }
};
