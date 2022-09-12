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
    console.log("local ends");
    done(null, user);
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
  // check if the user is authenticated
  passport.checkAuthentication = function (req, res, next) {
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()) {
      return next();
    }

    // if the user is not signed in
    return res.redirect("/users/sign-in");
  };

  passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
      // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
      res.locals.user = req.user;
    }

    next();
  };
}

export default initialize;
