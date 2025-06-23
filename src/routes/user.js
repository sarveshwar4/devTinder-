const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../module/connectionRequest");
const User = require("../module/user");
const user_safe_data = "firstName lastName photoUrl age gender about";

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
    res.json(connectionRequest);
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
        "age",
        "gender"
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "skills",
        "about",
        "age",
        "gender"
      ]).exec();

    if (!connectionRequest) {
      throw new Error("No Request Found");
    }
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

userRouter.get("/user/request/send/view", userAuth, async(req, res)=>{
   try{
    const loggedInUser = req.user;
    const sendingRerquestThatIsPensing =await ConnectionRequest.find({
      fromUserId : loggedInUser._id,
       status : "interested"
    }).populate("toUserId", user_safe_data);

    if(!sendingRerquestThatIsPensing){
      throw new Error("User is not avilable there");
    }
    res.send(sendingRerquestThatIsPensing);
   }catch(error){
    res.status(400).send("ERROR: " + error.message);
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

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());

      hideUserFromFeed.add(req.toUserId.toString());
    });

    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
    .select(user_safe_data)
    .skip(skip)
    .limit(limit);
    res.json({
      success:true,
      message: "User Feed Fetched Successfully",
      data : userFeed,
      err:{}
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
