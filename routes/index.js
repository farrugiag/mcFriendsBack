const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const fs = require("fs");
var uniqid = require("uniqid");

const request = require("sync-request");
const UserModel = require("../models/users");
const QuartierModel = require("../models/quartiers");
const PostModel = require("../models/posts");
const CommentaireModel = require("../models/commentaires");
const EventModel = require("../models/events");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//POST SIGNUP PARTICULIER
router.post("/signup-particulier", async function (req, res, next) {
  console.time("TIME SIGNUP PARTICULIER");
  console.log("req.body PARTICULIERS", req.body);
  console.log("centres d'interet", req.body.centresDinteret);
  console.log("quartiers fav", req.body.quartiersFavoris);
  console.time("TIME SIGNUP PARTICULIER USERMODEL BDD");
  const findIfUserExists = await UserModel.findOne({ email: req.body.email });
  console.timeEnd("TIME SIGNUP PARTICULIER USERMODEL BDD");
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
  console.time("TIME SIGNUP PARTICULIER QUARTIERMODEL BDD");
  const quartierActivity = await QuartierModel.findOne({
    name: req.body.quartierActivity,
  });
  console.timeEnd("TIME SIGNUP PARTICULIER QUARTIERMODEL BDD");
  const quartierId = quartierActivity._id;
  console.time("TIME SIGNUP PARTICULIER USERMODEL SAVE BDD");
  const newUser = new UserModel({
    status: "Particulier",
    prenom: req.body.prenom,
    dateDeNaissance: req.body.dateDeNaissance,
    nom: req.body.nom,
    nameSearch: `${req.body.prenom} ${req.body.nom}`,
    civilite: req.body.civilite,
    email: req.body.email,
    centresDinteret: req.body.centresDinteret,
    quartiersFavoris: req.body.quartiersFavoris,
    quartierActivity: quartierId,
    token: uid2(32),
    password: hash,
  });
  console.time("TIME SIGNUP PARTICULIER USERMODEL SAVE BDD");
  const newUserSaved = await newUser.save();
  console.timeEnd("TIME SIGNUP PARTICULIER USERMODEL SAVE BDD");
  console.timeEnd("TIME SIGNUP PARTICULIER");
  res.json({ result: true, token: newUserSaved.token });
});

// POST SIGNUP COMMERCANT
router.post("/signup-commercant", async function (req, res, next) {
  console.time("TIME SIGNUP COMMERCANT");
  console.log("req.body COMMERCANTS", req.body);
  console.time("TIME SIGNUP COMMERCANT USERMODEL FINDONE");
  const findIfUserExists = await UserModel.findOne({ email: req.body.email });
  console.timeEnd("TIME SIGNUP COMMERCANT USERMODEL FINDONE");
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
  console.time("TIME SIGNUP COMMERCANT QUARTIERMODEL FINDONE");
  const quartierActivity = await QuartierModel.findOne({
    name: req.body.quartierActivity,
  });
  console.timeEnd("TIME SIGNUP COMMERCANT QUARTIERMODEL FINDONE");
  const quartierId = quartierActivity._id;
  const newUser = new UserModel({
    status: "Commercant",
    nomEnseigne: req.body.nomEnseigne,
    numRCI: req.body.numRCI,
    adresse: req.body.adresse,
    email: req.body.email,
    domainesActivity: req.body.domainesActivity,
    quartierActivity: quartierId,
    token: uid2(32),
    password: hash,
  });
  console.time("TIME SIGNUP COMMERCANT USERMODEL SAVE");
  const newUserSaved = await newUser.save();
  console.timeEnd("TIME SIGNUP COMMERCANT USERMODEL SAVE");
  console.timeEnd("TIME SIGNUP COMMERCANT");
  res.json({ result: true, token: newUserSaved.token });
});

// POST LOGIN
router.post("/login", async function (req, res, next) {
  console.time("TIME LOGIN");
  console.log(">>req.body", req.body);
  let result = false;
  const error = [];
  let token = null;
  let user = null;

  if (req.body.email == "" || req.body.password == "") {
    //ON VERIFIE QUE L'UTILISATEUR A BIEN REMPLIS LES CHAMPS DE SAISIES
    error.push("Champs vides, veuillez entrer votre email et mot de passe");
  }
  if (error.length == 0) {
    console.time("TIME LOGIN USERMODEL FINDONE");
    //SI IL N'Y A PAS D'ERREUR ON VA CHERCHER SI L'UTILISATEUR EXISTE DANS NOTRE BDD
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    console.timeEnd("TIME LOGIN USERMODEL FINDONE");

    if (user) {
      console.time("TIME LOGIN BCRYPT COMPARE");
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //ON COMPARE LE MOT DE PASSE ENVOYE PAR L'UTILISATEUR ET CELUI CRYPTE EN BDD
        result = true;
        token = user.token;
      } else {
        result = false;
        error.push("Email ou mot de passe incorrect");
      }
      console.time("TIME LOGIN BCRYPT COMPARE");
    } else {
      error.push("Email ou mot de passe incorrect");
    }
  }
  console.timeEnd("TIME LOGIN");
  res.json({ result, user, error, token });
});

//POST SEARCH UTILISATEUR
router.post("/recherche-utilisateur", async function (req, res, next) {
  console.time("TIME RECHERCHE UTILISATEUR");
  console.log("POST SEARCH UTILISATEUR BODY: ", req.body);
  const regexSearch = new RegExp(req.body.search, "i");
  console.time("TIME RECHERCHE UTILISATEUR QUARTIER MODEL FINDONE");
  const quartierActivity = await QuartierModel.findOne({
    name: req.body.quartierSearch,
  });
  console.timeEnd("TIME RECHERCHE UTILISATEUR QUARTIER MODEL FINDONE");
  const quartierId = quartierActivity._id;
  console.time("TIME RECHERCHE UTILISATEUR USERMODEL FINDONE");
  const findUsers = await UserModel.find({
    nameSearch: regexSearch,
    quartierActivity: quartierId,
    status: req.body.typeUtilisateurSearch,
  });
  console.timeEnd("TIME RECHERCHE UTILISATEUR USERMODEL FINDONE");
  console.log("findUsers", findUsers);
  const userTableau = [];
  for (let i = 0; i < findUsers.length; i++) {
    const user = findUsers[i];
    userTableau.push({
      nom: user.nom,
      nomEnseigne: user.nomEnseigne,
      prenom: user.prenom,
      description: user.description,
      profilePicture: user.profilePicture,
      status: user.status,
    });
  }
  console.timeEnd("TIME RECHERCHE UTILISATEUR");
  res.json({ userTableau });
});

/*--------------------Add Post-------------------------------*/
router.post("/addPost", async function (req, res, next) {
  console.log("req.body", req.body);
  const searchTokenUser = await UserModel.findOne({
    token: req.body.token,
  });
  const userId = searchTokenUser._id;

  const searchStatusUser = await UserModel.findById(searchTokenUser._id);
  // console.log("satus search", searchStatusUser);
  const status = searchStatusUser.status;

  const searchQuartier = await QuartierModel.findOne({
    name: req.body.quartier,
  });
  const quartierId = searchQuartier._id;
  console.log("id quartier", quartierId);

  const datePost = new Date();

  const newPost = new PostModel({
    content: req.body.content,
    type: req.body.type,
    createur: userId,
    quartier: quartierId,
    commerceAssocie: userId,
    date: datePost,
    type: status,
    image: req.body.photoAdded ? req.body.photoAdded : "",
  });
  const newPostSaved = await newPost.save();
  // console.log("newPostSaved", newPostSaved);
  res.json({ result: true, post: newPostSaved });
});

// POST RECEPTION ET ENVOI COMMENTAIRE EN BDD
router.post("/comment", async function (req, res, next) {
  console.log("récup comment dans route:", req.body);
  const searchUser = await UserModel.findOne({ token: req.body.token });
  console.log("recherche user via token", searchUser);
  const userId = searchUser._id;
  console.log("userId via token:", userId);
  const dateComment = new Date();
  console.log("date comment:", dateComment);
  const newComment = new CommentaireModel({
    createur: userId,
    content: req.body.comment,
    date: dateComment,
  });
  const newCommentSaved = await newComment.save();
  console.log("new comment saved:", newCommentSaved);
  res.json({ result: true, comment: newCommentSaved });
});
// RENVOI POST AU FEED
router.get("/feed", async function (req, res, next) {
  const posts = await PostModel.find()
    .populate("createur")
    .populate("quartier")
    .exec();
  const events = await EventModel.find()
    .populate("createur")
    .populate("quartier")
    .exec();
  console.log("events", events);
  res.json({ result: true, posts, events });
});

router.post("/event", async function (req, res, next) {
  // console.log('POST /event req.body', req.body)

  const searchTokenUser = await UserModel.findOne({
    token: req.body.token,
  });
  const userId = searchTokenUser._id;

  const searchQuartier = await QuartierModel.findOne({
    name: req.body.quartier,
  });
  console.log("Event quartier ID", searchQuartier._id);
  const quartierId = searchQuartier._id;
  let dateDebutBdd = new Date(req.body.dateDebut);
  let dateFinBdd = new Date(req.body.dateFin);

  const newEvent = new EventModel({
    createur: userId,
    content: req.body.content,
    nomEvenement: req.body.nomEvenement,
    quartier: quartierId,
    dateDebut: dateDebutBdd,
    dateFin: dateFinBdd,
  });
  const newEventSaved = await newEvent.save();
  res.json({ result: true, event: newEventSaved });
});

router.post("/upload", async function (req, res, next) {
  console.log("ROUTER POST UPLOAD req.files", req.files);
  const adresseTMP = "./tmp/" + uniqid() + ".jpg";
  const resultCopy = await req.files.photo.mv(adresseTMP);
  const resultCloudinary = await cloudinary.uploader.upload(adresseTMP);
  fs.unlinkSync(adresseTMP);
  res.json(resultCloudinary);
});

router.get("/chat", async function (req, res, next) {
  console.log(">>req.query", req.query);
  const searchUser = await UserModel.findOne({ token: req.query.token });
  const searchMessage = await MessageModel.find({
    emetteur: searchUser._id,
  });
  console.log("searchMessage", searchMessage);
  res.json({ result: true, messages: searchMessage });
});

module.exports = router;
