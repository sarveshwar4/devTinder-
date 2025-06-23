const { Server } = require('socket.io');
const Chats = require('../module/chat');

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", 
        },
    });

    io.on("connection", (socket) => {
      // Handle room joining
      socket.on("joinRoom", ({ userId, targetuserId }) => {
        const roomId = [userId, targetuserId].sort().join("_");
        socket.join(roomId);
        console.log("Room joined:", roomId);
      });

      socket.on("sendMessage", async({userId, targetuserId, firstName,text})=>{
        try {
        const roomId = [userId, targetuserId].sort().join("_");
        let chat = await Chats.findOne({participants : {$all: [userId, targetuserId]}});
        console.log(chat)
        if(!chat){
          chat = await Chats.create({
            participants: [userId, targetuserId],
            message: []
          });
        }
        chat.message.push({
          senderId: userId,
          text: text
        });
        await chat.save();
        io.to(roomId).emit("recieveMessage",{firstName, text});
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
          console.log("A user disconnected with id:", socket.id);
      });
    });
};

module.exports = initializeSocket;
