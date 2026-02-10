const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Virat",
    lastName: "Kohli",
    email: "virat111@gmail.com",
    password: "virat123",
  };

  // Creating a new instance of the User model and saving it to the database
  const user = new User(userObj);

  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user:", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection estabished");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
