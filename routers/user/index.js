import { Router } from "express";
import { body, check, validationResult } from "express-validator";
import { userDashboard, addNewContact } from "../../controllers/user/index.js";
import { signedIn } from "../../middleware/AuthMiddleware.js";

const user = Router();

user.route("/dashboard").get(signedIn, userDashboard);

user
  .route("/contacts")
  .post(
    signedIn,
    [
      body("email").isEmail().withMessage("Must provide a valid email"),
      body("phone").isMobilePhone(),
      body("fname").notEmpty().withMessage("Must provide a first name"),
      body("lname").notEmpty().withMessage("Must provide a last name"),
    ],
    addNewContact
  );

export default user;
