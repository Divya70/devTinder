const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const connectionRequestModal = require("../models/ConnectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .send({ message: "Invalid status types" + status });
      }
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await connectionRequestModal.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.send({ message: "Connection request already exists" });
      }
      const connectionRequest = new connectionRequestModal({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (err) {
      res.status(400).send("Error sending request:" + err.message);
    }
    // console.log("Connect Request Sent");

    // res.send(user.firstName + "Sent the connect request");
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedinUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }

      const connectionRequest = await connectionRequestModal.findOne({
        _id: requestId,
        toUserId: loggedinUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request" + status,
        data,
      });
    } catch (err) {
      res.status(400).send("Error reviewing request:" + err.message);
    }
  },
);

module.exports = requestRouter;
