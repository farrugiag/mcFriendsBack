var express = require("express");
var router = express.Router();

const userModel = require("../models/users");

const bcrypt = require("bcrypt");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", async function (req, res, next) {
  console.log(">>req.body", req.body);
  const result = false;
  // const user = null;
  // const error = [];

  if (req.body.email == "" || req.body.password == "") {
    res.json({ result: false });
  }

  // if (error.length == 0) {
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.json({ result: true });
      return;
    }
  }

  res.json({ result });
});

module.exports = router;
