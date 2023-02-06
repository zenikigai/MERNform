// install express
// install nodemon
// install cors

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();
const bcryptSalt = bcrypt.genSaltSync(10);

// testing
// app.get("/test", (req, res) => {
//   res.json("test ok");
// });

//  middleware that parses the incoming request body as JSON. Without this line, the req.body in the app.post endpoint will be undefined and the application would be unable to access the values of name, email, and password from the request body, leading to a registration error.
app.use(express.json());
// cors (cross origin)
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173", // front end port
  })
);

// connect to mongodb
mongoose.connect(process.env.MONGO_URL);
// console.log(process.env.MONGO_URL);

// defining "register" endpoint
app.post("/register", async (req, res) => {
  // grab the data
  const { name, email, password } = req.body;
  // check if the user already exist
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(422).json({ error: "Email already exists" });
  }

  // create the new user
  try {
    const UserDoc = await User.create({
      // pass the information
      name,
      email,
      // encrypt the password
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    // response with new user information
    res.json(UserDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
  // res.json({ name, email, password });
});

// defining the login
app.post("/login", async (req, res) => {
  // grab from the request body
  const { email, password } = req.body;
  // find user with stored email from register page
  const UserDoc = await User.findOne({ email });

  if (UserDoc) {
    const passOk = bcrypt.compareSync(password, UserDoc.password);
    passOk ? res.json("pass ok") : res.status(422).json("pass not ok");
  } else {
    res.json("not found");
  }
});

// listener
app.listen(4500);
/* on terminal type "nodemon index.js", inside your browser type localhost:4500/test to see if it works */
