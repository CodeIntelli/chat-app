const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: String,
  from: Object,
  socketId: String,
  time: String,
  date: String,
  to: String,
});

const MessageModel = new mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
