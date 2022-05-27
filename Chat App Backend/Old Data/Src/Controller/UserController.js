import { UserModel } from "../Models";
import {
  ErrorHandler,
  SendEmail,
  SendToken,
  SuccessHandler,
} from "../Services";
import cloudinary from "cloudinary";
import Joi from "joi";
const ObjectId = require("mongoose").Types.ObjectId;
function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) {
      return true;
    }
    return false;
  }
  return false;
}
const UserController = {
  // [ + ] GET USER DETAILS
  async getUserDetails(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (user.status == "Deactivate") {
        return next(
          new ErrorHandler(
            "It Seem's You have deleted Your Account Please Check Your Mail For More Details",
            422
          )
        );
      }
      SuccessHandler(200, user, "User Details Display Successfully", res);
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  // [ + ] GET ALL USER DETAIL LOGIC
  async getAllUserDetails(req, res, next) {
    try {
      const users = await UserModel.find(
        { __v: 0 },
        { __v: 0, createdAt: 0 }
      ).sort({ createdAt: -1 });
      SuccessHandler(200, users, "User Details Display Successfully", res);
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  // [ + ] UPDATE USER PASSWORD

  async updatePassword(req, res, next) {
    try {
      const UserValidation = Joi.object({
        oldPassword: Joi.string().required().messages({
          "string.base": `User Name should be a type of 'text'`,
          "string.empty": `User Name cannot be an empty field`,
          "string.min": `User Name should have a minimum length of {3}`,
          "any.required": `User Name is a required field`,
        }),
        newPassword: Joi.string()
          .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
          .required(),
        confirmPassword: Joi.ref("password"),
      });
      const { error } = UserValidation.validate(req.body);
      if (error) {
        return next(error);
      }

      const user = await UserModel.findById(req.user.id).select("+password");
      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password Is Incorrect", 400));
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password Doesn't match", 400));
      }
      user.password = req.body.newPassword;
      user.save();
      SendToken(user, 200, res);
      SuccessHandler(200, user, "Password Change Successfully", res);
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  // [ + ] GET SINGLE USER LOGIC

  async getSingleUser(req, res, next) {
    try {
      if (!isValidObjectId(req.params.id)) {
        res.status(422).json({
          success: false,
          code: 422,
          data: "",
          message: `${req.params.id} is not valid MongoDB ID`,
        });
      }
      const user = await UserModel.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
        );
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  // [ + ] UPDATE USER ROLE LOGIC

  async updateUserRole(req, res, next) {
    if (!isValidObjectId(req.params.id)) {
      res.status(422).json({
        success: false,
        code: 422,
        data: "",
        message: `${req.params.id} is not valid MongoDB ID`,
      });
    }

    const UserValidation = Joi.object({
      name: Joi.string().trim().min(3).max(30).required().messages({
        "string.base": `User Name should be a type of 'text'`,
        "string.empty": `User Name cannot be an empty field`,
        "string.min": `User Name should have a minimum length of {3}`,
        "any.required": `User Name is a required field`,
      }),
      email: Joi.string().email().trim().required().messages({
        "string.base": `User Email should be a type of 'text'`,
        "string.empty": `User Email cannot be an empty field`,
        "any.required": `User Email is a required field`,
      }),
      role: Joi.string().required(),
    });
    const { error } = UserValidation.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || "user",
      };
      const userData = await UserModel.findById(req.params.id);
      if (userData.name !== req.body.name) {
        console.log(userData.name, req.body.name);
        return next(new ErrorHandler("You Can't Change The User Name", 400));
      }
      if (userData.email !== req.body.email) {
        return next(new ErrorHandler("You Can't Change The User Email", 400));
      }
      if (userData.status != "Active") {
        return next(
          new ErrorHandler(
            "This user is not active user, you only change the active user role",
            400
          )
        );
      }
      console.log(userData.role, newUserData.user);
      if (userData.role == req.body.role) {
        return next(
          new ErrorHandler(
            "It's Seems Like You Are Not Changing the User Role",
            400
          )
        );
      }

      let updatedData = await UserModel.findByIdAndUpdate(
        req.params.id,
        newUserData,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      SuccessHandler(200, updatedData, "User Role Updated", res);
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  // [ + ] UPDATE USER DETAIL LOGIC

  async updateUserDetails(req, res, next) {
    try {
      if (!isValidObjectId(req.params.id)) {
        res.status(422).json({
          success: false,
          code: 422,
          data: "",
          message: `${req.params.id} is not valid MongoDB ID`,
        });
      }
      const UserValidation = Joi.object({
        name: Joi.string().trim().min(3).max(30).messages({
          "string.base": `User Name should be a type of 'text'`,
          "string.min": `User Name should have a minimum length of {3}`,
        }),
        email: Joi.string().email().trim().messages({
          "string.base": `User Email should be a type of 'text'`,
        }),
        avatar: Joi.string(),
      });
      const { error } = UserValidation.validate(req.body);
      if (error) {
        return next(error);
      }
      if (req.body.email) {
        const userEmailCheck = await UserModel.exists({
          email: req.body.email,
        });
        if (userEmailCheck) {
          return next(new ErrorHandler("This email is already taken", 409));
        }
      }
      const newUserData = {
        name: req.body.name,
        email: req.body.email,
      };
      if (req.body.avatar !== undefined && req.body.avatar !== "") {
        const user = await UserModel.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const user = await UserModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(200).json({
        success: true,
        user,
      });

      next();
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  // [ + ] DELETE USER LOGIC

  async deleteAccountPermenantlyUser(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      console.log(user);
      if (!user) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.user.id}`, 400)
        );
      }

      let userStatus = user.status;

      let DeactivatedUser = {
        status: "Deactivate",
      };

      let updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        DeactivatedUser,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      let message = `We are so sorry mail here after user delete account permenantly`;
      const afterDeleteMail = await SendEmail({
        email: user.email,
        subject: `Delete Account Permenantly`,
        message,
      });
      if (!afterDeleteMail) {
        return next(
          new ErrorHandler(
            "Something Error Occurred Please Try After Some Time",
            422
          )
        );
      }
      res.status(200).json({
        success: true,
        updatedUser,
        message: "User Account Removed Successfully",
      });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  // [ > ] BLOCK USER  BY ADMIN LOGIC

  async blockUserAdmin(req, res, next) {
    try {
      if (!isValidObjectId(req.params.id)) {
        res.status(422).json({
          success: false,
          code: 422,
          data: "",
          message: `${req.params.id} is not valid MongoDB ID`,
        });
      }
      const user = await UserModel.findById(req.params.id);
      console.log(user);
      if (!user) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
      }

      let userStatus = user.status;

      let DeactivatedUser = {
        status: "Blocked",
      };

      let updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        DeactivatedUser,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json({
        success: true,
        updatedUser,
        message: "User Blocked Successfully By Admin",
      });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },

  // [ > ] Delete User - Admin

  async deleteUserAdmin(req, res, next) {
    try {
      if (!isValidObjectId(req.params.id)) {
        res.status(422).json({
          success: false,
          code: 422,
          data: "",
          message: `${req.params.id} is not valid MongoDB ID`,
        });
      }
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return next(
          new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
      }

      await user.remove();

      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
      });
    } catch (error) {
      return new ErrorHandler(error, 500);
    }
  },
};

export default UserController;
