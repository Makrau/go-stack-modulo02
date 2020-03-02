import GoBarberError from './GoBarberError';

export default class RequestError extends GoBarberError {
  constructor(message) {
    super(message);
    this.name = 'RequestError';
    this.message = message || this.defaultMessage();
    this.code = 400;
  }

  defaultMessage() {
    return 'Invalid request body structure';
  }
}
