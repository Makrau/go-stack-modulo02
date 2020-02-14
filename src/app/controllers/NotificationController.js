import Notification from '../schemas/Notification';
import { checkIsProvider } from '../helpers/verifications/user';

class NotificationController {
  async index(req, res) {
    try {
      if (!(await checkIsProvider(req.userId))) {
        return res
          .status(401)
          .json({ error: 'Only providers can load notifications' });
      }

      const notifications = await Notification.find({
        user: req.userId,
      })
        .sort({ createdAt: 'desc' })
        .limit(20);
      return res.json(notifications);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true } // retorna o registro atualizado
      );

      return res.json(notification);
    } catch (error) {
      return res.json({ error: error.message });
    }
  }
}

export default new NotificationController();
