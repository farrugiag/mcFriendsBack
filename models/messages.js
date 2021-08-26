const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  emetteur: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  recepteur: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  message: String,
  date: Date,
});

const MessageModel = mongoose.model("messages", messageSchema);

module.exports = MessageModel;
