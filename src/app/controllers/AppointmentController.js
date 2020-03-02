import { startOfHour, parseISO, format, subHours, isBefore } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { createAppointmentValidation } from '../validations/appointment';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import { checkIsProvider } from '../helpers/verifications/user';

import CancellationMailJob from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const appointmentsPerPage = 20;
    const { page = 1 } = req.query;
    const appointments = await Appointment.finddAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
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
      await createAppointmentValidation(req);

      const { provider_id, date } = req.body;

      if (!(await checkIsProvider(provider_id))) {
        return res.status(400).json({ error: 'provider_id is not a provider' });
      }

      const hourStart = startOfHour(parseISO(date));

      const appointment = await Appointment.create({
        user_id: req.userId,
        provider_id,
        date: hourStart,
      });

      const user = await User.findByPk(req.userId);
      const formattedDate = format(
        hourStart,
        "'dia' dd 'de' MMMM', às' H:mm'h'",
        { locale: pt }
      );

      await Notification.create({
        content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
        user: provider_id,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const appointment = await Appointment.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'provider',
            attributes: ['name', 'email'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['name'],
          },
        ],
      });

      if (appointment.user_id !== req.userId) {
        return res.status(401).json({
          error: "You don't have permission to cancel this appointment",
        });
      }

      if (appointment.canceled_at) {
        return res.status(400).json({
          error: 'This appointment has already been canceled',
        });
      }

      const dateWithSub = subHours(appointment.date, 2);

      if (isBefore(dateWithSub, new Date())) {
        return res.status(400).json({
          error: 'You can only cancel appointments 2 hours in advance',
        });
      }

      appointment.canceled_at = new Date();

      await appointment.save();

      await Queue.add(CancellationMailJob.key, {
        appointment,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new AppointmentController();
