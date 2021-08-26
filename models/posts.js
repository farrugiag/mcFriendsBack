const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  textContent: String,
  image: String,
  video: String,
  createur: { type: mongoose.Schema.Types.ObjectID, ref: "users" },
  likes: [{ type: mongoose.Schema.Types.ObjectID, ref: "users" }],
  quartier: { type: mongoose.Schema.Types.Objectif, ref: "quartiers" },
  commerceAssocie: { type: mongoose.Schema.Types.ObjectID, ref: "users" },
  type: String,
});

const PostModel = mongoose.model("posts", postSchema);

module.exports = PostModel;
