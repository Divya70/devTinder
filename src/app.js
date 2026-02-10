const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const req = require("express/lib/request");

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);

  // Creating a new instance of the User model and saving it to the database
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user:", err.message);
  }
});

// Get API -get , to get all the users from the database
app.get("/users", async (req, res) => {
  const userEmail = req.body.email;
  console.log(req.body);

  try {
    const user = await User.findOne({ email: userEmail });
    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(400).send("Error fetching users:", err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(400).send("Error fetching users:", err.message);
  }
});

app.delete("/users", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting user:", err.message);
  }
});

app.patch("/users", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User Updated successfully");
  } catch (err) {
    res.status(400).send("Error Updating user:", err.message);
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
