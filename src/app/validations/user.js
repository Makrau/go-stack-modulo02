import * as Yup from 'yup';
import User from '../models/User';
import RequestError from '../errors/RequestError';
import AuthenticationError from '../errors/AuthenticationError';

const checkEmailExists = async email => {
  const emailExists = await User.findOne({
    where: { email },
  });

  if (emailExists) {
    throw new RequestError('Email already exists');
  }
};

export const checkUserExists = async userId => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new RequestError('User not found');
  }

  return user;
};

const checkCreateUserSchema = async requestBody => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string()
      .required()
      .min(6),
  });

  if (!(await schema.isValid(requestBody))) {
    throw new RequestError('Invalid request body structure');
  }
};

const checkUpdateUserSchema = async requestBody => {
  const schema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    oldPassword: Yup.string().min(6),
    password: Yup.string()
      .min(6)
      .when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
    confirmPassword: Yup.string().when('password', (password, field) =>
      password ? field.required().oneOf([Yup.ref('password')]) : field
    ),
  });

  if (!(await schema.isValid(requestBody))) {
    throw new RequestError('Invalid request body structure');
  }
};

const checkChangePassword = async (oldPassword, password, user) => {
  if (!oldPassword && password) {
    throw new AuthenticationError(
      'Cannot change password without passing the previous password'
    );
  }

  if (oldPassword && !(await user.checkPassword(oldPassword))) {
    throw new AuthenticationError('Password does not match');
  }
};

export const updateUserValidation = async (request, user) => {
  if (!user) {
    user = await checkUserExists(request.userId);
  }

  await checkUpdateUserSchema(request.body);

  const { email, oldPassword, password } = request.body;

  if (email && email !== user.email) {
    await checkEmailExists(email);
  }

  await checkChangePassword(oldPassword, password, user);
};

export const createUserValidation = async requestBody => {
  await checkCreateUserSchema(requestBody);
  await checkEmailExists(requestBody.email);
};

export default { createUserValidation, updateUserValidation, checkUserExists };
