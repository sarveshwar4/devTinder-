const express = require('express');
const { userAuth } = require('../middleware/auth');
const Chats = require('../module/chat');
const chatRouter = express.Router();

chatRouter.get('/chat/:targetuserId',userAuth, async(req, res)=>{
      try {
        const userId = req.user._id;
        const targetuserId = req.params.targetuserId;
        const chat = await Chats.findOne({participants:{$all: [userId, targetuserId]}})
        .populate('message.senderId', 'firstName lastName')
        if(!chat){
            chat = await Chats.create({
                participants: [userId, targetuserId],
                message: []
            });
        }
        res.json(chat);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
});

module.exports = chatRouter;