import User from '../models/User';
import {
  createUserValidation,
  updateUserValidation,
  checkUserExists,
} from '../validations/user';

class UserController {
  async store(req, res) {
    await createUserValidation(req.body);

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const user = await checkUserExists(req.userId);
    await updateUserValidation(req, user);

    const { id, name, provider, email } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
