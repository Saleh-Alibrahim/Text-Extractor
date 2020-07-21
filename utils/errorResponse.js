class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
