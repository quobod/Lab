import { Router } from "express";
import { body, check, validationResult } from "express-validator";
import {
  userDashboard,
  addNewContact,
  searchContacts,
} from "../../controllers/user/index.js";
import { signedIn } from "../../middleware/AuthMiddleware.js";
import { lettersOnly } from "../../custom_modules/index.js";

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

user.route(`/contacts/search`).post(signedIn, searchContacts);

export default user;
