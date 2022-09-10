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
      user: req.user,
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
  static resetPage = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render("reset", {
      title: "reset",
      user: user,
    });
  };
  static update = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user.email !== req.body.email) {
        req.flash("error", "Email Doesn't match");
        return res.redirect("/home");
      }
      if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Password and Confirm Password Doesn't match");
        return res.redirect("/home");
      }
      if (await bcrypt.compare(req.body.oldPassword, user.password)) {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(req.body.password, salt);
        await User.findOneAndUpdate(
          { email: req.body.email },
          { $set: { password: hashpassword } }
        );
        req.flash("success", "Password Changed Successfully! Please Login!");
        return res.redirect("/login");
      } else {
        req.flash("error", "Password Doesn't match");
        return res.redirect("/home");
      }
    } catch (error) {
      console.log(error);
    }
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
