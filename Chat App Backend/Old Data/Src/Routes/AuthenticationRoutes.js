import express from "express";
let AuthenticationRoutes = express.Router();
import { AuthenticationController } from "../Controller";
import { Authentication } from "../Middleware";

// [ + ] User Routes
AuthenticationRoutes.post("/register", AuthenticationController.registerUser);
AuthenticationRoutes.post(
  "/users/:id/verify/:token",
  AuthenticationController.verifyEmail
);
AuthenticationRoutes.post("/login", AuthenticationController.login);
AuthenticationRoutes.post(
  "/password/forgot",
  AuthenticationController.forgotPassword
);
AuthenticationRoutes.put(
  "/password/reset/:token",
  AuthenticationController.resetPassword
);
AuthenticationRoutes.get(
  "/logout",
  Authentication,
  AuthenticationController.logout
);

export default AuthenticationRoutes;
