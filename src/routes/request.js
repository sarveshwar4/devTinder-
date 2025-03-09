const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../module/user");
const ConnectionRequest = require("../module/connectionRequest");

// Route to send a connection request
requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    // Check if the status is valid
    const allowed_update = ['interested', 'ignored'];
    if (!allowed_update.includes(status)) {
      res.status(400).send("Invalid status");
    }

    // Check if the request is already sent
    const userConnectedData = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (userConnectedData) {
      throw new Error("Request is Already Sent");
    }

    // Check if the user is valid to send the request
    const isValidatetoUserId = await User.findById({ _id: toUserId });
    if (!isValidatetoUserId) {
      throw new Error("id is not valid ");
    }

    // Create a new connection request
    const connectionRequests = await new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    // Save the connection request to the database
    const data = await connectionRequests.save();
    res.json({ message: `${user.firstName} request sent to ${isValidatetoUserId.firstName}`, data });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

// Route to review a connection request
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const curr_status = req.params.status;
    const requestId = req.params.requestId;
    const loggedInUserId = user._id;

    // Check if the status is valid
    const allowed_update = ['accepted', 'rejected'];
    if (!allowed_update.includes(curr_status)) {
      throw new Error("Invalid Status");
    }

    // Find the connection request
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested"
    });

    if (!connectionRequest) {
      throw new Error("Request is not valid");
    }

    // Update the status of the connection request
    connectionRequest.status = curr_status;
    const data = await connectionRequest.save();
    res.status(200).json({ message: `Request Updated by ${user.firstName}`, data });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = requestRouter;