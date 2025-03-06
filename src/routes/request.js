const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const connectionRequest = require("../module/connectionRequest");
const User = require("../module/user")
requestRouter.post("/request/send/:status/:userId",userAuth, async(req, res)=>{
      try{
        const user = req.user;
        const fromUserId = user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        // checking the status is valid or not
        const allowed_update = ['interested', 'ignored'];
        if(!allowed_update.includes(status)){
          res.status(400).send("Invalid status");
        }
        // checking the request is already sent or not
        const userConnectedData = await connectionRequest.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
          ]
        });
      //checking the request is already sent or not
        if(userConnectedData){
          throw new Error("Request is Already Sent")
        }
        // checking the user is valid or not to send the request
        const isValidatetoUserId = await User.findById({_id : toUserId});
        if(!isValidatetoUserId){
          throw new Error("id is not valid ")
        }
        const connectionRequests = await new connectionRequest(
        //  creating the object of connectionRequest
          {
            fromUserId,
            toUserId,
            status
          }
        )
        const data = await connectionRequests.save();

        res.json({message : `${user.firstName} request sent to ${isValidatetoUserId.firstName}`, data});
      }
      catch(error){
        res.status(400).send("ERROR:" + error.message);
      }
  });

module.exports = requestRouter;