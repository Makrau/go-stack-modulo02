import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';

export const checkPastDate = date => {
  const hourStart = startOfHour(parseISO(date));

  if (isBefore(hourStart, new Date())) {
    throw new Error('Past dates are not permitted');
  }
};

export const checkHasAppointment = async (provider_id, date) => {
  const hourStart = startOfHour(parseISO(date));

  const hasAppointment = await Appointment.findOne({
    where: {
      provider_id,
      canceled_at: null,
      date: hourStart,
    },
  });

  if (hasAppointment) {
    throw new Error('Appointment date not available');
  }
};

export const createAppointmentValidation = async request => {
  const schema = Yup.object().shape({
    date: Yup.date().required(),
    provider_id: Yup.string().required(),
  });

  if (!(await schema.isValid(request.body))) {
    throw new Error('invalid request body structure');
  }

  const { date, provider_id } = request.body;

  checkPastDate(date);
  await checkHasAppointment(provider_id, date);

  if (provider_id === request.userId) {
    throw new Error('cannot make an appointment with yourself');
  }
};

export default {
  createAppointmentValidation,
  checkHasAppointment,
  checkPastDate,
};
