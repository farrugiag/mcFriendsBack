const mongoose = require("mongoose");

const commentaireSchema = mongoose.Schema({
  createur: { type: mongoose.Schema.Types.Objectif, ref: "users" },
  content: String,
  date: Date,
  post: { type: mongoose.Schema.Types.Objectif, ref: "posts" },
});

const CommentaireModel = mongoose.model("commentaires", commentaireSchema);

module.exports = CommentaireModel;
