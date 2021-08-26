const mongoose = require("mongoose");
const EventSchema = mongoose.Schema({
  createur: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  quartier: { type: mongoose.Schema.Types.ObjectId, ref: "quartiers" },
  particants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  description: String,
  dateDebut: Date,
  dateFin: Date,
  nomEvenement: String,
  photo: String,
  video: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
});

const EventModel = mongoose.model("events", EventSchema);
module.exports = EventModel;
