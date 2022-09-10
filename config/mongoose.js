// setting up mongoose schema for the database
import mongoose from "mongoose";
var uri = process.env.MONGOLAB_URI || `mongodb://localhost/Authentication`;
mongoose.connect(uri);

const db = mongoose.connection;

db.once("open", function () {
  console.log("Connected to Database :: MongoDB");
});

export default db;
