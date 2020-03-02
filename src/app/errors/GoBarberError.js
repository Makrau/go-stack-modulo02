export default class GoBarberError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GoBarberError';
    this.message = message;
  }
}
