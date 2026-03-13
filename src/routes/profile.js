const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateProfileEditData } = require("../utils/validation");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  // Validate the token
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowedUpdate = validateProfileEditData(req);
    if (!isAllowedUpdate) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field]),
    );
    res.json({
      message: `${loggedInUser.firstName} ${loggedInUser.lastName}, Your profile updated successfully`,
      data: loggedInUser,
    });
    await loggedInUser.save();
  } catch (err) {
    res.status(400).send("Error updating profile:" + err.message);
  }
});

module.exports = profileRouter;
