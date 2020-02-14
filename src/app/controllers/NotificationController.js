import Notification from '../schemas/Notification';
import { checkIsProvider } from '../helpers/verifications/user';

class NotificationController {
  async index(req, res) {
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
  }
}

export default new NotificationController();
