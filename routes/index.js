import express from "express";
import Home from "../controllers/homeController.js";
import Auth from "../config/auth.js";
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
//logging out the user
router.get("/logout", Home.logoutUser);
export default router;
