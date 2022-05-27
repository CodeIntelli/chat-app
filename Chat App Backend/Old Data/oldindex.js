// let express = require("express");
// let app = express();

// let http = require("http");
// let server = http.Server(app);

// let socketIO = require("socket.io");
// let io = socketIO(server);

// const port = process.env.PORT || 3000;

// // func

// /*
// ? Socket.io Events That we need

// socket.on('online',onlineStatus);
// socket.on('join-chat',newUserLogin);
// socket.on('new-user',allUserList);
// socket.on('send-message',sendMessage);
// socket.on('typing',showTypingStatus);
// socket.on('stop-typing',stopTypingStatus);
// socket.off('online',offlineStatus);

// */

// io.on("connection", (socket) => {
//   socket.on("new-user", async (room) => {
//     io.emit("new-user", room);
//   });

//   socket.on("join", (data) => {
//     joinFunc(socket, data);
//   });

//   socket.on("message", (data) => {
//     console.log("data.message", data.message);
//     io.in(data.room).emit("new message", {
//       user: data.user,
//       message: data.message,
//     });
//   });
// });

// function joinFunc(socketData, data) {
//   console.log(data.room);
//   socketData.join(data.room);
//   socketData.broadcast.to(data.room).emit("user joined");
// }

// server.listen(port, () => {
//   console.log(`started on port: ${port}`);
// });
