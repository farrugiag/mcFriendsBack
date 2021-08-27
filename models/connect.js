const mongoose = require("mongoose");

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, options, function (err) {
  if (!err) {
    console.log("Connexion à la BDD réussie");
  } else {
    console.log("Erreur lors de la connexion à la BDD: ", err);
  }
});
