import { Strategy } from "passport-local";
import User from "../models/UserModel.js";

const passportConfig = (passport) => {
  console.log(`\n\thah`);
  passport.use(
    new Strategy(
      {
        usernameField: "email",
        passwordField: "pwd",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        console.log(`\n\n\t\tMade it to passport\n\n`);
        // Match User
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "User is not registered" });
            }

            // Match Password
            if (user.matchPassword(password)) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Invalid credentials" });
            }
          })
          .catch((err) => {
            return done(null, false, { message: `${err}` });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

export default passportConfig;
