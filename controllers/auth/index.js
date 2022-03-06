import asyncHandler from "express-async-handler";
import bunyan from "bunyan";
import passport from "passport";
import { body, check, validationResult } from "express-validator";
import User from "../../models/UserModel.js";
import { stringify, parse, createHash } from "../../custom_modules/index.js";

const logger = bunyan.createLogger({ name: "Auth Controller" });

// @desc        signin user
// @route       POST /auth/signin
// @access      Public
export const signinUser = asyncHandler(async (req, res, next) => {
  logger.info(`Post: /auth/signin`);
  // console.log(passport);

  const { email, pwd } = req.body;
  console.log(`\n\tEmail: ${email}\tPassword: ${pwd}`);

  passport.authenticate("local", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/auth/signin",
    failureFlash: false,
  })(req, res, next);
});

// @desc        Register user
// @route       POST /auth/register
// @access      Public
export const registerUser = (req, res) => {
  logger.info(`Post: /auth/register`);

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${location}[${param}]: ${msg}`;
  };

  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    // logger.error(`Registration Failure: ${JSON.stringify(result.array())}`);

    const err = result.array();
    const arrResult = [];

    for (const e in err) {
      const objE = err[e];
      const arrObjE = objE.split(":");
      const head = arrObjE[0];
      const value = arrObjE[1];
      const key = head.replace("body", "").replace("[", "").replace("]", "");
      const newObj = {};
      newObj[`${key}`] = value;
      arrResult.push(newObj);
    }

    console.log(`${stringify(arrResult)}\n`);

    return res.status(200).render("auth/register", {
      title: "Error",
      error: true,
      errors: arrResult,
    });
  } else {
    const { email, pwd, pwd2, fname, lname } = req.body;

    User.findOne({ email: `${email}` })
      .then((user) => {
        if (user == null) {
          const newUser = new User({
            email,
            fname,
            lname,
          });

          createHash(pwd, (results) => {
            if (results.status) {
              const { original, payload } = results;

              console.log(
                `\n\tHash Successful\n\t\tOriginal: ${original}\n\t\tPayload: ${payload}`
              );

              newUser.password = payload;
              newUser
                .save()
                .then((doc) => {
                  res.redirect("/auth/signin");
                })
                .catch((err) => {
                  console.log(err);
                  res.redirect("/auth/register");
                });
            } else {
              const { error } = results;
              console.log(`\n\tHash Error\n\t\t${error}\n`);
              res.redirect("/user/dashboard");
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/user/dashboard");
      });
  }
};

// @desc        User Signin
// @route       GET /auth/signin
// @access      Public
export const userSignin = asyncHandler(async (req, res) => {
  logger.info(`GET: /auth/signin`);

  try {
    res.render("auth/signin", {
      title: "Signin",
      csrfToken: req.csrfToken,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message,
      cause: err.stackTrace,
    });
  }
});

// @desc        User Registration
// @route       GET /auth/signin
// @access      Public
export const userRegister = asyncHandler(async (req, res) => {
  logger.info(`GET: /auth/register`);

  try {
    res.render("auth/register", {
      title: "Register",
      csrfToken: req.csrfToken,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message,
      cause: err.stackTrace,
    });
  }
});

// @desc        User Sign Out
// @route       GET /auth/signout
// @access      Private
export const userSignout = asyncHandler(async (req, res) => {
  logger.info(`GET: /auth/signout`);

  req.logout();
  delete req["user"];
  res.redirect("/");
});
