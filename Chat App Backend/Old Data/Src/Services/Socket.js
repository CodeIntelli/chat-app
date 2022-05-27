socket.on("new-user", async (room) => {
  const members = await UserModel.find();
  io.emit("new-user", members);
});

socket.on("message-room", async (room, sender, content, time, date) => {
  const newMessage = await MessageModel.create({
    content,
    from: sender,
    time,
    date,
    to: room,
  });
  let roomMessage = await getLastMessages(room);
  roomMessage = sortRoomMessageByDate(roomMessage);
  // sending Message to room
  io.to(room).emit("room-message", roomMessage);
  socket.broadcast.emit("notification", room);
});

socket.on("join-room", async (room) => {
  socket.join(room);
  let roomMessage = await getLastMessages(room);
  roomMessage = sortRoomMessageByDate(roomMessage);
  socket.emit("room-message", roomMessage);
});

// // package calling
// import express from "express";
// const app = express();
// import { PORT, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } from "./Config";
// import { AuthenticationRoutes, UserRoutes } from "./Src/Routes";
// import "./Src/Database";
// import cors from "cors";
// import { Error } from "./Src/Middleware";
// import cookieParser from "cookie-parser";
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     credentials: true,
//   })
// );
// import consola from "consola";
// import cloudinary from "cloudinary";
// import bodyParser from "body-parser";
// import fileUpload from "express-fileupload";

// // For Getting Form Data In Postman
// import multipart from "connect-multiparty";
// import MessageModel from "./Src/Models/MessageModel";
// import { UserModel } from "./Src/Models";
// global.app = module.exports = express();

// //* Package Initialization
// app.use(multipart());
// app.use(fileUpload({ useTempFiles: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// // todo: All Routes Declare Here
// app.use("/api/v1/", UserRoutes);
// app.use("/api/v1/auth", AuthenticationRoutes);

// //* Middleware for Error
// app.use(Error);
// // ? when we declare any undefine variable then this error occur so we can handle this error here
// process.on("uncaughtException", (error) => {
//   consola.error(
//     `Shutting down the server due to uncaught exception:${error.message}`
//   );
//   process.exit(1);
// });
// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: CLOUD_NAME,
//   api_key: CLOUD_API_KEY,
//   api_secret: CLOUD_API_SECRET,
// });

// let server = app.listen(PORT, () => {
//   console.log("\n\n\n\n\n");
//   consola.success(`Server Connected ${PORT}`);
// });

// // Socket.io Integration
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://localhost:4200",
//     methods: ["GET", "POST"],
//   },
// });

// app.get("/room", (req, res) => {
//   res.json(rooms);
// });

// async function getLastMessages(room) {
//   let roomMessages = await MessageModel.aggregate([
//     { $match: { to: room } },
//     { $group: { _id: `$date`, messagesByDate: { $push: "$$ROOT" } } },
//   ]);
//   return roomMessages;
// }

// function sortRoomMessageByDate(message) {
//   return message.sort(function (a, b) {
//     let date1 = a._id.split("/");
//     let date2 = a._id.split("/");
//     date1 = date1[2] + date1[0] + date1[1];
//     date2 = date2[2] + date2[0] + date2[1];
//     return date1 < date2 ? -1 : 1;
//   });
// }

// io.on("connection", (socket) => {

// });

// // * unhandled promise rejection: it occur when we are put incorrect mongodb string in short it accept all mongodb connection errors
// //  * when we are handling this error we dont need to put catch block in database connection file
// process.on("unhandledRejection", (error) => {
//   consola.error(
//     `Shutting down the server due to unhandled promise rejection  : ${error.message}`
//   );
//   server.close(() => {
//     process.exit(1);
//   });
// });
