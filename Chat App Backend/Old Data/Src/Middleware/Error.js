import { ErrorHandler } from "../Services";
import { ValidationError } from "joi";
const errorDetails = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal Server Error";

  // Wrong Mongodb ID Error
  if (error.name === "CastError") {
    const message = `Resource not found Invalid: ${error.path}`;
    error = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate error
  if (error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
    error = new ErrorHandler(message, 400);
  }

  //Wrong JWT Token
  if (error.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    error = new ErrorHandler(message, 400);
  }

  // JWT Expire Token
  if (error.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, try again`;
    error = new ErrorHandler(message, 400);
  }
  // Joi Error
  if (error instanceof ValidationError) {
    console.log(error.message);
    error.statusCode = 422;
    // const data = {
    //   message: error,
    // };
    error = new ErrorHandler(error.message, error.statusCode);
  }
  res.status(error.statusCode).json({
    success: false,
    code: error.statusCode,
    data: "",
    message: error.message,
  });
};

export default errorDetails;
