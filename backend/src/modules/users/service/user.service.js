import * as userRepository from '../repository/user.repository.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

class UserService {
  async registerUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const id = uuidv4();
      
      const user = await userRepository.create({
        ...userData,
        id,
        password: hashedPassword
      });

      // You could create other related records here...
      // Example: await profileRepository.create({ userId: user.id }, { transaction });
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(pagination) {
    const { limit, offset } = pagination;
    const data = await userRepository.findAndCountAll({
      limit,
      offset
    });
    return data;
  }
}

export default new UserService();
