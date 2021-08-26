const mongoose = require("mongoose");

const quartierSchema = mongoose.Schema({
  name: String,
});

const QuartierModel = mongoose.model("quartiers", quartierSchema);

module.exports = QuartierModel;
