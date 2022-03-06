import { Router } from "express";

import { body, check, validationResult } from "express-validator";
import {
  registerUser,
  signinUser,
  userReauthenticate,
  userReauthenticateSubmission,
  userRegister,
  userSignin,
  userSignout,
} from "../../controllers/auth/index.js";
import { reauthenticate, signedIn } from "../../middleware/AuthMiddleware.js";

const auth = Router();

auth.route("/signin").get(userSignin).post(signinUser);

auth
  .route("/register")
  .get(userRegister)
  .post(
    [
      body("email").isEmail().withMessage("Must provide a valid email"),
      body("pwd").notEmpty().withMessage("Must create a password"),
      body("pwd2")
        .notEmpty()
        .custom((value, { req }) => {
          if (value !== req.body.pwd) {
            throw new Error("Password confirmation does not match password");
          }
          return true;
        }),
      body("fname").notEmpty().withMessage("Must provide a first name"),
      body("lname").notEmpty().withMessage("Must provide a last name"),
    ],
    registerUser
  );

auth.route("/signout").get(userSignout);

auth
  .route("/reauthenticate")
  .get(reauthenticate, userReauthenticate)
  .post(
    [
      body("email").isEmail().withMessage("Must provide a valid email"),
      body("pwd").notEmpty().withMessage("Must enter a password"),
    ],
    signedIn,
    userReauthenticateSubmission
  );

export default auth;
