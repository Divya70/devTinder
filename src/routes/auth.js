const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { ValidateSignupData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  // Validate the data
  // Encrypt the password

  // Creating a new instance of the User model and saving it to the database

  try {
    const { firstName, lastName, email, password } = req.body;
    ValidateSignupData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    console.log(token);

    // Add token to cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 + 3600000),
    });

    res.json({ message: "User created successfully", user: savedUser });
  } catch (err) {
    res.status(400).json({ error: "ERROR: " + err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      // const token = await jwt.sign({ _id: user.id }, "DevTiner@790", {
      //   expiresIn: "7d",
      // });

      const token = await user.getJWT();
      console.log(token);

      // Add token to cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 + 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout successful");
});

module.exports = authRouter;
