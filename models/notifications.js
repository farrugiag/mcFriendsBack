const mongoose = require("mongoose");
const NotificationSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  type: String,
  postAssocie: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
  eventAssocie: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
});

const NoitficationModel = mongoose.model("notifications", NotificationSchema);
module.exports = NotificationModel;
