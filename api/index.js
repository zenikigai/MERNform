// importing "express" module
const express = require("express");

// creating an express aplication
const app = express();

// importing the "cors" module for Cross-Origin Resource Sharing (CORS)
const cors = require("cors");

// importing the mongoose module for connecting to MongoDB database
const mongoose = require("mongoose");

// importing "bcryptjs" module for password hashing
const bcrypt = require("bcryptjs");

// importing "jsonwebtoken" module for creating JSON Web Token
const jwt = require("jsonwebtoken");

// importing the user model for working with user document
const User = require("./models/User");

// load environtment variables from the ".env" file
require("dotenv").config();

// generating a salt for password hashing using "bcrypt"
const bcryptSalt = bcrypt.genSaltSync(10);

// defining a secret for signing JSON Web Token
const jwtSecret = "mustBeRandomStrings";

/*testing
 app.get("/test", (req, res) => {
  res.json("test ok");
 });*/

// middleware for parsing incoming request bodies as JSON
app.use(express.json());

// Middleware for handling CORS
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173", // front end port
  })
);

// connecting to mongoDB database
mongoose.connect(process.env.MONGO_URL);
console.log(process.env.MONGO_URL);

// defining "register" endpoint for creating a new user
app.post("/register", async (req, res) => {
  // extracting the name, email, and password from the request body
  const { name, email, password } = req.body;
  // check if the user with the same email already exist
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(422).json({ error: "Email already exists" });
  }
  // create the new user
  try {
    const UserDoc = await User.create({
      // providing the user's name and email
      name,
      email,
      // hashing the user's password with bcrypt
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    // response with new user information
    res.json(UserDoc);
  } catch (err) {
    // responding with a 500 error if the user creation failed
    res.status(500).json({ error: "Failed to create user" });
  }
  // res.json({ name, email, password });
});

// defining the login endpoint for logging in an exixting user
app.post("/login", async (req, res) => {
  // extracting the email and password from the request body
  const { email, password } = req.body;
  // find user with specific email
  const UserDoc = await User.findOne({ email });
  // checking if the user exists
  if (UserDoc) {
    // comparing the provided password with the hashed one that stored in the database
    const passOk = bcrypt.compareSync(password, UserDoc.password);

    // if the password match, create a JSON Web Token
    passOk
      ? jwt.sign(
          {
            // information we want to sign to this token
            email: UserDoc.email,
            id: UserDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            // if ther's an error throw the error
            if (err) throw err;
            // otherwise send the token back to the client in a cookie
            res
              .cookie("token", token)
              .send({ message: "pass ok", token: token });
          }
        )
      : // if the password don't match, send an error response with a status code of 422
        res.status(422).json("pass not ok");
  } else {
    // if the user doesn't exist, send a response indicating that the user was not found
    res.json("not found");
  }
});

// listener
app.listen(4500);

/* on terminal type "nodemon index.js", inside your browser type localhost:4500/test to see if it works */
