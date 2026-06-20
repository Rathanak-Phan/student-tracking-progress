import userService from '../service/user.service.js';
import { getPagination, getPagingData } from '../../../shared/utils/pagination.js';

class UserController {
  async register(req, res, next) {
    try {
      const user = await userService.registerUser(req.body);
      res.status(201).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const pagination = getPagination(req.query);
      const data = await userService.getAllUsers(pagination);
      const response = getPagingData(data, pagination.page, pagination.limit);
      
      res.status(200).json({
        status: 'success',
        ...response
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
