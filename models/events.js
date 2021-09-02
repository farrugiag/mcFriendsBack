const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  createur: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  quartier: { type: mongoose.Schema.Types.ObjectId, ref: "quartiers" },
  particants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  content: String,
  dateDebut: Date,
  dateFin: Date,
  nomEvenement: String,
  photo: String,
  video: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
});

const EventModel = mongoose.model("events", eventSchema);
module.exports = EventModel;
