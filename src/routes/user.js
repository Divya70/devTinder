const express = require("express");
const { userAuth } = require("../middleware/auth");
const res = require("express/lib/response");
const connectionRequestModal = require("../models/ConnectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

const populateUserFields =
  "firstName lastName age gender about photoUrl skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedinUSer = req.user;
    const connectionRequests = await connectionRequestModal
      .find({
        toUserId: loggedinUSer._id,
        status: "interested",
      })
      .populate("fromUserId", populateUserFields)
      .populate("toUserId", populateUserFields);
    res.json({
      message: "Data Fecthed Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error fetching users:" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequests = await connectionRequestModal
      .find({
        $or: [
          { toUserId: loggedinUser._id, status: "accepted" },
          { fromUserId: loggedinUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", populateUserFields)
      .populate("toUserId", populateUserFields);

    console.log(connectionRequests);

    const connections = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedinUser._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.json({ data: connections });
  } catch (err) {
    res.status(400).send("Error fetching connections:" + err.message);
  }
});

// Feed API
userRouter.get("/feed", userAuth, async (req, res) => {
  // User should see all the cards except
  //  1. His/ Her own card
  //  2. Cards of users who have rejected him/ her or whom he/ she has rejected
  //  3. Cards of users who have accepted him/ her or whom he/ she has accepted
  //  4. Cards of users who have sent him/ her a connection request or to whom he/ she has sent a connection request
  //  5. his/ her connections
  try {
    const loggedinUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // Max limit of 50
    const skip = (page - 1) * limit;

    const connectionRequests = await connectionRequestModal
      .find({
        $or: [{ fromUserId: loggedinUser._id }, { toUserId: loggedinUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedinUser._id } },
      ],
    })
      .select(populateUserFields)
      .skip(skip)
      .limit(limit);

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching feed:" + err.message);
  }
});

module.exports = userRouter;
