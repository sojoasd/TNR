export default class AppError extends Error {
  status: Number;
  constructor(message, status) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);

    this.status = status || 500;
  }
}
