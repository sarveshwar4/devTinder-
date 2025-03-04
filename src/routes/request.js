const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const connectionRequest = require("../module/connectionRequest");
const User = require("../module/user")
requestRouter.post("/send/request/:status/:userId",userAuth, async(req, res)=>{
      try{
        const user = req.user;
        const fromUserId = user._id;
        const toUserId = req.params.userId;

        // sending request to ourself
        if(fromUserId == toUserId){
          throw new Error("You can't send request to yourself");
        }
        const userConnectedData = await connectionRequest.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
          ]
        });
      //  checking the request is already sent or not
        if(userConnectedData){
          throw new Error("Request is Already Sent")
        }
        // checking the user id is valid or not                   
        const isValidatetoUserId = await User.findById({_id : toUserId});
        if(!isValidatetoUserId){
          throw new Error("id is not valid ")
        }
        const status = req.params.status;
  
        const connectionRequests = await new connectionRequest(
        //  creating the object of connectionRequest
          {
            fromUserId,
            toUserId,
            status
          }
        )
        const connectionRequestSaved = await connectionRequests.save();

        res.json({connectionRequestSaved});
      }
      catch(error){
        res.status(400).send("ERROR:" + error.message);
      }
  });

module.exports = requestRouter;