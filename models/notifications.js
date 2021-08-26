const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  type: String,
  postAssocie: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
  eventAssocie: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
});

const NotificationModel = mongoose.model("notifications", notificationSchema);

module.exports = NotificationModel;
