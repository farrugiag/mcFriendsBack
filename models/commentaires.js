const mongoose = require("mongoose");

const commentaireSchema = mongoose.Schema({
  createur: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  content: String,
  date: Date,
  post: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "events" },
});

const CommentaireModel = mongoose.model("commentaires", commentaireSchema);

module.exports = CommentaireModel;
