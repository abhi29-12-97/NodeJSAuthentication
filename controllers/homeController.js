import User from "../models/Users.js";
import bcrypt from "bcrypt";
import passport from "passport";
export default class Home {
  static home = (req, res) => {
    res.render("home", {
      title: "home",
    });
  };
  static dashBoard = (req, res) => {
    res.render("dashboard", {
      title: "dashboard",
      name: req.user.name,
    });
  };

  static signUpPage = (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/home");
    }
    res.render("signup", {
      title: "signup",
    });
  };

  static signInPage = (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/home");
    }
    res.render("signin", {
      title: "signin",
    });
  };

  static createUser = async (req, res) => {
    try {
      if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Passwords do not match");
        return res.redirect("/signup");
      }
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(req.body.password, salt);
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        const newUser = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: hashpassword,
        });
        req.flash("success", "You have signed up, login to continue!");
        return res.redirect("/login");
      } else {
        req.flash("error", "User Already exist");
        return res.redirect("/login");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  static loginUser = (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: true,
    })(req, res, next);
  };

  static logoutUser = (req, res) => {
    req.logout(function (err) {
      if (err) {
        console.log(err);
      }
      req.flash("success", "You have successfully logged out!");
      res.redirect("/login");
    });
  };
}
