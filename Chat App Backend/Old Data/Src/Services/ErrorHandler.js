class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    // super(statusCode);
    // this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
