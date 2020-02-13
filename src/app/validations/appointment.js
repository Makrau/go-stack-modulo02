import * as Yup from 'yup';

export const createAppointmentValidation = requestBody => {
  const schema = Yup.object().shape({
    date: Yup.date().required(),
    provider_id: Yup.string().required(),
  });

  return schema.isValid(requestBody);
};

export default { createAppointmentValidation };
