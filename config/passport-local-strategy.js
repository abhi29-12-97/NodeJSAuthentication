import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import User from "../models/Users.js";

function initialize(passport) {
  const authenticator = async (email, password, done) => {
    const user = await User.findOne({ email: email });
    if (user == null) {
      return done(null, false, { message: "No user with that email exists" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user, { message: "successfully logged in" });
      } else {
        return done(null, false, { message: "Email/Password is wrong" });
      }
    } catch (err) {
      return done(err);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticator));
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (err) {
        console.log("Error in finding user --> Passport");
        return done(err);
      }

      return done(null, user);
    });
  });
}

export default initialize;
