import { createAppointmentValidation } from '../validations/appointment';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    try {
      if (!(await createAppointmentValidation(req.body))) {
        return res.status(400).json({ error: 'Validation failed' });
      }

      const { provider_id, date } = req.body;
      const isProvider = await User.findOne({
        where: {
          id: provider_id,
          provider: true,
        },
      });

      if (!isProvider) {
        return res.status(400).json({ error: 'provider_id is not a provider' });
      }

      const appointment = await Appointment.create({
        user_id: req.userId,
        provider_id,
        date,
      });
      return res.json({ appointment });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new AppointmentController();
