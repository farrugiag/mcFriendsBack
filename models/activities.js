const mongoose = require("mongoose");

var activitySchema = mongoose.Schema({
  type: String,
});

var ActivityModel = mongoose.model("activities", activitySchema);

module.exports = ActivityModel;
