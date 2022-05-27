import express from "express";
let UserRoutes = express.Router();
import { UserController } from "../Controller";
import { Authentication, Authorization } from "../Middleware";

// [ + ]After Login this url is used for user
UserRoutes.get("/profile", Authentication, UserController.getUserDetails);

UserRoutes.put(
  "/changePassword",
  Authentication,
  UserController.updatePassword
);
UserRoutes.put(
  "/edit_profile",
  Authentication,
  UserController.updateUserDetails
);

// [ + ] Admin Credentials
UserRoutes.get(
  "/details",
  Authentication,
  Authorization("admin"),
  UserController.getAllUserDetails
);
UserRoutes.get(
  "/admin/user/:id",
  Authentication,
  Authorization("admin"),
  UserController.getSingleUser
);
UserRoutes.put(
  "/admin/user/:id",
  Authentication,
  Authorization("admin"),
  UserController.updateUserRole
);
UserRoutes.delete(
  "/user/:id",
  Authentication,
  UserController.deleteAccountPermenantlyUser
);
UserRoutes.delete(
  "/admin/user/:id",
  Authentication,
  Authorization("admin"),
  UserController.deleteUserAdmin
);
export default UserRoutes;
