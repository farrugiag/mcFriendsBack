const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
// const uid2 = require("uid2");
const UserModel = require("../models/users");
const QuartierModel = require("../models/quartiers");
const PostModel = require("../models/posts");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup-particulier", async function (req, res, next) {
  console.log("req.body PARTICULIERS", req.body);
  console.log("centres d'interet", req.body.centresDinteret);
  console.log("quartiers fav", req.body.quartiersFavoris);
  const findIfUserExists = await UserModel.findOne({ email: req.body.email });
  console.log("findIfUserExists", findIfUserExists);
  if (findIfUserExists) {
    //ON VÉRIFIE QUE SI L'EMAIL EST DÉJÀ UTILISÉ, ON NE CRÉE PAS UN DEUXIÈME COMPTE DANS LA BASE DE DONNÉES
    res.json({
      errorMessage: "Cet email a déjà été utilisé pour créer un compte.",
    }); //ON NE TRAVAILLE QU'AVEC L'EMAIL CAR DEUX PERSONNES PEUVENT AVOIR LE MÊME NOM/PRÉNOM
    return;
  }
  const cost = 18;
  const hash = bcrypt.hashSync(req.body.password, cost);
  const newUser = new UserModel({
    status: "particulier",
    prenom: req.body.prenom,
    dateDeNaissance: req.body.dateDeNaissance,
    nom: req.body.nom,
    civilite: req.body.civilite,
    email: req.body.email,
    centresDinteret: req.body.centresDinteret,
    quartiersFavoris: req.body.quartiersFavoris,
    token: uid2(32),
    password: hash,
  });
  const newUserSaved = await newUser.save();
  res.json({ result: true, token: newUserSaved.token });
});

router.post("/signup-commercant", async function (req, res, next) {
  console.log("req.body COMMERCANTS", req.body);
  const findIfUserExists = await UserModel.findOne({ email: req.body.email });
  console.log("findIfUserExists", findIfUserExists);
  if (findIfUserExists) {
    //ON VÉRIFIE QUE SI L'EMAIL EST DÉJÀ UTILISÉ, ON NE CRÉE PAS UN DEUXIÈME COMPTE DANS LA BASE DE DONNÉES
    res.json({
      errorMessage: "Cet email a déjà été utilisé pour créer un compte.",
    }); //ON NE TRAVAILLE QU'AVEC L'EMAIL CAR DEUX PERSONNES PEUVENT AVOIR LE MÊME NOM/PRÉNOM
    return;
  }
  const cost = 18;
  const hash = bcrypt.hashSync(req.body.password, cost);
  const quartierActivity = await QuartierModel.findOne({
    name: req.body.quartierActivity,
  });
  const quartierId = quartierActivity._id;
  const newUser = new UserModel({
    status: "commercant",
    nomEnseigne: req.body.nomEnseigne,
    numRCI: req.body.numRCI,
    adresse: req.body.adresse,
    email: req.body.email,
    domainesActivity: req.body.domainesActivity,
    quartierActivity: quartierId,
    token: uid2(32),
    password: hash,
  });
  const newUserSaved = await newUser.save();
  res.json({ result: true, token: newUserSaved.token });
});

router.post("/login", async function (req, res, next) {
  console.log(">>req.body", req.body);
  let result = false;
  const error = [];
  let token = null;
  let user = null;

  if (req.body.email == "" || req.body.password == "") {
    error.push("Champs vides, veuillez entrer votre email et mot de passe");
  }
  if (error.length == 0) {
    const user = await userModel.findOne({
      email: req.body.email,
    });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        result = true;
        token = user.token;
      } else {
        result = false;
        error.push("Email ou mot de passe incorrect");
      }
    } else {
      error.push("Email ou mot de passe incorrect");
    }
  }
  res.json({ result, user, error, token });
});

router.post("/addPost", async function (req, res, next){
  console.log('req.body', req.body)

  const searchTokenUser = await UserModel.findOne({
    token: req.body.token
  })
  console.log('user token', searchTokenUser._id)
  const userId = searchTokenUser._id

  const newPost = new PostModel({
    content: req.body.content,
    type: req.body.type,
    createur: userId
  })
  
  const newPostSaved = await newPost.save()
  res.json({ result:true, post:newPostSaved })
})

module.exports = router;
