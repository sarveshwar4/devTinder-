const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../module/connectionRequest");
const User = require("../module/user");
const user_safe_data = "firstName lastName email, photoUrl about skills";
userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "skills",
      "about",
    ]);
    if (!connectionRequest) {
      throw new Error("No Request Found");
    }
    res.json({ connectionRequest });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

userRouter.get("/user/connection/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "skills",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "skills",
        "about",
      ]);

    if (!connectionRequest) {
      throw new Error("No Request Found");
    }
    const data = connectionRequest.map((row) => {
      if (row.fromUserId.toString() == loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;  
    let limit = parseInt(req.query.limit) || 10;  
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;  

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    console.log(connectionRequest);
    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());

      hideUserFromFeed.add(req.toUserId.toString());
    });
    console.log(hideUserFromFeed);

    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
    .select(user_safe_data)
    .skip(skip)
    .limit(limit);

    res.json({ data: userFeed });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
