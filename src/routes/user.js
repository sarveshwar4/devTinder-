const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../module/connectionRequest");

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

module.exports = userRouter;
