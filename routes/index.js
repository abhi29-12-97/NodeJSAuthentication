import express from "express";
import Home from "../controllers/homeController.js";
import Auth from "../config/auth.js";
import passport from "passport";
const router = express.Router();

//entry point to our site in which user will see the login signup button
router.get("/", Home.home);

//signup page get request to show the form
router.get("/signup", Home.signUpPage);
//Signin page get request to show the form
router.get("/login", Home.signInPage);
//signup page post request to create the user
router.post("/signup", Home.createUser);
//signin page post request to Login
router.post("/login", Home.loginUser);
//dashBoard page to render once the user is login and if the user is logged in it can't access signup and signin page without logging out
router.get("/home", Auth.checkAuthenticated, Home.dashBoard);
//rendering the reset request
router.get("/reset/:id", Auth.checkAuthenticated, Home.resetPage);
//updating the new password
router.post("/reset/:id", Home.update);
//logging out the user
router.get("/logout", Home.logoutUser);

//google routes
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/home",
    failureRedirect: "/login",
  })
);
export default router;
