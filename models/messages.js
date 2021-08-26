const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  emetteur: { type: mongoose.Schema.Types.Objectif, ref: "users" },
  recepteur: { type: mongoose.Schema.Types.Objectif, ref: "users" },
  message: String,
  date: Date,
});

<<<<<<< HEAD
const MessageModel = mongoose.model("messages", messageSchema);
=======
const MessagesModel = mongoose.model('messages', message)
>>>>>>> ae864fdc99cee76e7d98b59ab63aade19adf3465

module.exports = MessageModel;
