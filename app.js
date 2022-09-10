import express from "express";
import expressLayouts from "express-ejs-layouts";
import router from "./routes/index.js";
import flash from "connect-flash";
import session from "express-session";
import db from "./config/mongoose.js";
import cookieParser from "cookie-parser";

import passport from "passport";
import passportLocal from "./config/passport-local-strategy.js";
const app = express();
const port = process.env.PORT || 3000;

//passport middle ware setup
passportLocal(passport);

//static middle ware
app.use(express.static("./assets"));
//views using ejs

//views ejs
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//express session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

//connect -flash

app.use(flash());
//middleware
app.use((req, res, next) => {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  next();
});

app.use(passport.initialize());
app.use(passport.session());
//Routes
app.use("/", router);

//listen to port
app.listen(port, function (err) {
  if (err) {
    console.log("port connecting error", err);
    return;
  }
  console.log("server is running on port :", port);
});
