import User from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const { id, name, email, provider } = await User.create(req.body);

      return res.json({ id, name, email, provider });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(400).json({ error: 'User not found!' });
      }

      const { email, oldPassword } = req.body;

      if (email && email !== user.email) {
        const emailExists = await User.findOne({ where: { email } });

        if (emailExists) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }

      if (!oldPassword && req.body.password) {
        return res.status(401).json({
          error: 'Cannot change password without passing the previous password',
        });
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Password does not match' });
      }

      const { id, name, provider } = await user.update(req.body);
      return res.json({
        id,
        name,
        email,
        provider,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
