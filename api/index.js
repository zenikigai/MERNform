
// install express
// install nodemon
// install cors

const express = require("express");
const app = express();
const cors = require("cors");

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
    origin: "http://127.0.0.1:5173",
  })
);

// defining "register" endpoint
app.post("/register", async (req, res) => {
  // grab the data
  const { name, email, password } = req.body;
  if (!req.body) {
    return res.status(400).json({ error: "no data provided" });
  }
  // response
  res.json({ name, email, password });
});

// listener
app.listen(4500);
/* on terminal type "nodemon index.js", inside your browser type localhost:4500/test to see if it works */
