const { Server } = require('socket.io');

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

      socket.on("sendMessage", ({userId, targetuserId, firstName,text})=>{
        const roomId = [userId, targetuserId].sort().join("_");
        io.to(roomId).emit("recieveMessage",{firstName, text});
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
          console.log("A user disconnected with id:", socket.id);
      });
    });
};

module.exports = initializeSocket;
