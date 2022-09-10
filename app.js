import express from "express";
import expressLayouts from "express-ejs-layouts";
import router from "./routes/index.js";
import flash from "connect-flash";
import session from "express-session";
import db from "./config/mongoose.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportLocal from "./config/passport-local-strategy.js";

//initializing express app
const app = express();
const port = process.env.PORT || 3000;

//passport middle ware setup to use local strategy
passportLocal(passport);

//static middle ware to use static files from the code
app.use(express.static("./assets"));

//Express layout setup setting up views and extraction css and scriptstag from the child views
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//bodyparser to parse the form data from the req.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//express session to set up passport local strategy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

//connect -flash initialization for the flash messages and setting up flash middleware
app.use(flash());

app.use((req, res, next) => {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  next();
});

//initializing passport and session to get inbuilt passport functionality like logout,isAuthenticated
app.use(passport.initialize());
app.use(passport.session());

// setting up routes and using the index.js file from the routes folder
app.use("/", router);

//make app listen to port
app.listen(port, function (err) {
  if (err) {
    console.log("port connecting error", err);
    return;
  }
  console.log("server is running on port :", port);
});
