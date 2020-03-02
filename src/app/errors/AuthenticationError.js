import GoBarberError from './GoBarberError';

export default class AuthenticationError extends GoBarberError {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.message = message;
    this.code = 401;
  }
}
