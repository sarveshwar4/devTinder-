const { Server } = require("socket.io");
const Chats = require("../module/chat");
const connectionRequest = require("../module/connectionRequest");
const socketAuth = require("./socketAuth");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
     origin: "http://16.171.255.250",
      // origin: "http://localhost:5173",
      credentials: true,
    },
  });
  io.use(socketAuth);

  
 const onlineUsers = {};

  io.on("connection", (socket) => {  
     onlineUsers[socket.userId] = socket.id;
      socket.on("joinRoom", async ({ userId, targetuserId }) => {
      const connection = await connectionRequest.findOne({
        $or: [
          { fromUserId: userId, toUserId: targetuserId },
          { fromUserId: targetuserId, toUserId: userId },
        ],
        status: "accepted",
      });
      if (!connection) {
        console.log("Connection not found or not accepted");
        socket.emit("joinRoomFailed", "No accepted connection found");
        return;
      }
      const roomId = [userId, targetuserId].sort().join("_");
      socket.join(roomId);
      console.log("Room joined:", roomId);
    });

    socket.on(
      "sendMessage",
      async ({ userId, targetuserId, firstName, text }) => {
        try {
          const roomId = [userId, targetuserId].sort().join("_");
          let chat = await Chats.findOne({
            participants: { $all: [userId, targetuserId] },
          });
          console.log(chat);
          if (!chat) {
            chat = await Chats.create({
              participants: [userId, targetuserId],
              message: [],
            });
          }
          chat.message.push({
            senderId: userId,
            text: text,
          });
          await chat.save();
          io.to(roomId).emit("recieveMessage", { firstName, text });
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    );

    socket.on("checkOnline", (targetUserId)=>{
      targetUserId = targetUserId.toString()
      const isOnline = !!onlineUsers[targetUserId];
      console.log("User is online ...:", isOnline);
      socket.emit("isOnline",({targetUserId, isOnline}));
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      delete onlineUsers[socket.userId];
      console.log("A user disconnected with id:", socket.id);
    });
  });
};

module.exports = initializeSocket;
