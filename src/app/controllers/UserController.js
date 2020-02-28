import User from '../models/User';
import {
  createUserValidation,
  updateUserValidation,
  checkUserExists,
} from '../validations/user';

class UserController {
  async store(req, res) {
    try {
      await createUserValidation(req.body);

      const { id, name, email, provider } = await User.create(req.body);

      return res.json({ id, name, email, provider });
    } catch (error) {
      const errorCode = error.code ? error.code : 400;
      return res.status(errorCode).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await checkUserExists(req.userId);
      await updateUserValidation(req, user);

      const { id, name, provider, email } = await user.update(req.body);
      return res.json({
        id,
        name,
        email,
        provider,
      });
    } catch (error) {
      const errorCode = error.code ? error.code : 400;
      return res.status(errorCode).json({ error: error.message });
    }
  }
}

export default new UserController();
