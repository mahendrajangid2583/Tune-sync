const socket = require("socket.io");
const User = require("../models/User");
const Group = require("../models/Group"); // Adjust the path based on your project structure

const socketConnection = (server) => {
  const io = socket(server, {
    cors: {
      origin: "*", // Allow all origins (adjust in production)
    },
  });

  global.onlineUsers = new Map();

  io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("add-user", async (userId) => {
      onlineUsers.set(userId, socket.id);

      //notify all clients that this user is online
      io.emit("user-online", userId);
      //send all online user list to all user
      const onlineUserIds = Array.from(onlineUsers.keys());
      io.emit("recieve-user", onlineUserIds);
      const user = await User.findByIdAndUpdate(userId, {
        lastOnline: new Date(),
      });
    });

    socket.on("disconnect", async () => {
      // Find the user who disconnected and remove them from the onlineUsers Map

      for (let [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          const user = await User.findByIdAndUpdate(userId, {
            lastOnline: new Date(),
          });
          console.log("ofline", user);
          // Notify all clients that this user is offline
          io.emit("user-offline", userId);
          //send all online user list to all user
          const onlineUserIds = Array.from(onlineUsers.keys());
          io.emit("recieve-user", onlineUserIds);

          break;
        }
      }
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      console.log("msg", data);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data);
      }
    });

    
    socket.on("send-invitaion", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      console.log("invitaion re", data);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("recieved-invitation", data);
      }
    });
    
    socket.on("send-accepted", async (data) => {
      const sendUserSocket = await onlineUsers.get(data.to);
      const groupId = data.groupId;
      const userId = data.from;
      // Step 1: Find the group by ID
      const group = await Group.findById(groupId);
      // Step 2: Check if the user exists
      const user = await User.findById(userId);
      //if user already a member
      if (group.members.includes(userId)) {
        if (sendUserSocket) {
          // socket.to(sendUserSocket).emit("receive-accept", {});
        }
      } else {
        group.members.push(userId);
        await group.save();
        
        user.group = groupId;
        await user.save();
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("receive-accept", data);
        }
      }
    });
    
    socket.on("send-group-msg", async(data) => {
      const groupId = data.groupId;
      const group = await Group.findById(groupId);

      if(group){
        const members = group.members;
        for(const memberId of members){
           try {
            const sendUserSocket = await onlineUsers.get(memberId.toString());
            if (sendUserSocket) {
              socket.to(sendUserSocket).emit("recieve-group-msg", data);
            }
           } catch (error) {
            console.error(
              `Error sending song data to user ${memberId}:`,
              error
            );
           }
        }
      }

    });
    

    //send and recive songs data
    socket.on("send-songs-to-user", async (data) => {
      if (data.to) {
        const sendUserSocket = await onlineUsers.get(data.to);

        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("recive-songs-from-user", data);
        }
      } else {
        //find all users in group and send them data
        const groupId = data.groupId;
        console.log("song data recieved at backend", data, "Group id", groupId);
        const group = await Group.findById(groupId);
        //get all member of this group
        if (group) {
          const members = group.members;
          for (const memberId of members) {
            try {
              const sendUserSocket = onlineUsers.get(memberId.toString()); // Ensure memberId is a string
              if (sendUserSocket) {
                console.log(`Sending song data to user: ${memberId}`);
                socket.to(sendUserSocket).emit("recive-songs-from-user", data);
              } else {
                console.log(`User ${memberId} is offline`);
              }
            } catch (error) {
              console.error(
                `Error sending song data to user ${memberId}:`,
                error
              );
            }
          }
        }
      }
    });

    // Add a new event to check if a user is online
    socket.on("check-online", (userId) => {
      const isOnline = onlineUsers.has(userId);
      socket.emit("user-online-status", { userId, isOnline });
    });

    // get list of all online user
    socket.on("getAll-user", () => {
      const onlineUserIds = Array.from(onlineUsers.keys());
      socket.emit("recieve-user", onlineUserIds);
    });
  });
};

module.exports = socketConnection;
