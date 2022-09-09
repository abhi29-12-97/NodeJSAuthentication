import express from "express";
import expressLayouts from "express-ejs-layouts";
import router from "./routes/index.js";
import bodyParser from "body-parser";
import db from "./config/mongoose.js";
const app = express();
const port = process.env.PORT || 3000;
//static middle ware
app.use(express.static("./assets"));
//views using ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use("/", router);
//listen to port
app.listen(port, function (err) {
  if (err) {
    console.log("port connecting error", err);
    return;
  }
  console.log("server is running on port :", port);
});
