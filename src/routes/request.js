const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.post("/sendConnectRequest", userAuth, async (req, res) => {
  console.log("Connect Request Sent");
  res.send("Connect Request Sent");
});

module.exports = requestRouter;
