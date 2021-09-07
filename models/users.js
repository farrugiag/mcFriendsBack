const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  status: String,
  nom: String,
  prenom: String,
  nameSearch: String,
  adresse: String,
  email: String,
  password: String,
  civilite: String,
  dateDeNaissance: String,
  token: String,
  profilePicture: String,
  coverPicture: String,
  centresDinteret: [
    { type: mongoose.Schema.Types.ObjectId, ref: "activities" },
  ],
  postsLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
  commercantsFavoris: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  abonnements: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  quartiersFavoris: [
    { type: mongoose.Schema.Types.ObjectId, ref: "quartiers" },
  ],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
  reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
  descriptionUser: String,
  nomEnseigne: String,
  numRCI: String,
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "notifications" },
  ],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
  domainesActivity: [
    { type: mongoose.Schema.Types.ObjectId, ref: "activities" },
  ],
  quartierActivity: { type: mongoose.Schema.Types.ObjectId, ref: "quartiers" },
});

var UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
