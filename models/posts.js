const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  content: String,
  image: String,
  video: String,
  createur: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  quartier: { type: mongoose.Schema.Types.ObjectId, ref: "quartiers" },
  commerceAssocie: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  type: String,
  date: Date
});

const PostModel = mongoose.model("posts", postSchema);

module.exports = PostModel;
