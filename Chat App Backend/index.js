const express = require("express");
const app = express();
const userRoutes = require("./Routes/userRoutes");
const rooms = ["general", "tech", "finance", "crypto"];
const cors = require("cors");
const MessageModel = require("./Models/MessageModel");
const UserModel = require("./Models/UserModel");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);
require("./Database/index");
const server = require("http").createServer(app);

const PORT = 5000;
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Room logic
app.get("/rooms", (req, res) => {
  res.join(rooms);
});

async function getLastMessages(room) {
  let roomMessages = await MessageModel.aggregate([
    { $match: { to: room } },
    { $group: { _id: `$date`, messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessageByDate(message) {
  return message.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = a._id.split("/");
    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    return date1 < date2 ? -1 : 1;
  });
}

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await UserModel.find();
    console.log(members);
    socket.emit("new-user", members);
  });

  socket.on("join-room", async (room) => {
    socket.join(room);
    let roomMessage = await getLastMessages(room);
    roomMessage = sortRoomMessageByDate(roomMessage);
    socket.emit("room-message", roomMessage);
  });
});

server.listen(PORT, () => {
  console.log(`Listining to the ${PORT}`);
});
