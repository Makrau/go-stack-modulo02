import { startOfHour, parseISO } from 'date-fns';
import { createAppointmentValidation } from '../validations/appointment';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class AppointmentController {
  async index(req, res) {
    const appointmentsPerPage = 20;
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: appointmentsPerPage,
      offset: (page - 1) * appointmentsPerPage,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    try {
      await createAppointmentValidation(req.body);

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
        date: startOfHour(parseISO(date)),
      });
      return res.json(appointment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new AppointmentController();