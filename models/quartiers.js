const mongoose = require("mongoose");

const QuartierSchema = mongoose.Schema({
  name: String,
});

const QuartierModel = mongoose.model("quartiers", QuartierSchema);

module.exports = QuartierModel;
