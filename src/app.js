const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middleware/auth");

// Handle Auth middleware for all requests

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("get Data for usersss");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
