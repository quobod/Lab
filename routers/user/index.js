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

user.route("/contacts").post(
  signedIn,
  [
    body("email").isEmail().withMessage("Must provide a valid email"),
    body("phone").isMobilePhone(),
    body("fname")
      .notEmpty()
      .withMessage("Must provide a first name")
      .custom((value, { req }) => {
        if (!/[a-zA-Z]+/.test(req.body.fname)) {
          throw new Error("First name must consist of letters only");
        }
      })
      .withMessage("First name must be letters only"),
    body("lname")
      .notEmpty()
      .withMessage("Must provide a last name")
      .custom((value, { req }) => {
        if (!/[a-zA-Z]+/.test(req.body.fname)) {
          throw new Error("Last name must consist of letters only");
        }
      })
      .withMessage("Last name must be letters only"),
  ],
  addNewContact
);

user.route(`/contact`).post(signedIn, searchContacts);

export default user;
