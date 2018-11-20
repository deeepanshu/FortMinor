var express = require("express");
var router = express.Router();
const passport = require("passport");
const keys = require("../../config/keys"),
  mongoose = require("mongoose"),
  bcrypt = require("bcryptjs"),
  User = mongoose.model("user"),
  randomstring = require("randomstring"),
  _ = require("lodash"),
  Verifications = mongoose.model("verifications");
const sgMail = require("@sendgrid/mail");

router.get("/current_user", (req, res) => {
  res.send(req.user);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
router.post(
  "/login/local",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  function(req, res) {
    // req.session.user = req.user;
    // console.log(req.session);
    // res.redirect("http://localhost:3000");
  }
);
router.post("/add/user/basic", async (req, res) => {
  let existingUser = await User.findOne({ email: req.body.user.email });
  if (!existingUser) {
    let userBody = _.pick(req.body.user, [
      "fullName",
      "contact",
      "organisationName",
      "email"
    ]);
    console.log(req.body);
    var salt = bcrypt.genSaltSync(10);
    userBody["password"] = bcrypt.hashSync(req.body.user.password, salt);
    userBody["isAdmin"] = false;
    userBody["isSupplier"] = false;
    userBody["supplier"] = {};
    console.log(userBody);
    let user = new User(userBody);
    console.log(user);
    user.save(err => {
      if (err) res.status(400).send(err);
      res.status(200).send(user);
    });
  } else {
    res.status(400).send({});
  }
});

router.get("/list/users", async (req, res) => {
  let usernames = await User.find({}).exec();
  var i,
    username = [];
  for (i = 0; i < usernames.length; i++) {
    var body = _.pick(usernames[i], [
      "_id",
      "email",
      "contact",
      "fullName",
      "organisationName",
      "google_plus_url",
      "addresses",
      "supplier",
      "isSupplier",
      "isAdmin"
    ]);
    var user = new User(body);
    username.push(user);
  }
  res.send(username);
});

router.post("/get/user/:id", async (req, res) => {
  const obj = await User.findById({ _id: req.pararms.id }).exec();
  var body = _.pick(obj, [
    "_id",
    "email",
    "contact",
    "fullName",
    "organisationName",
    "google_plus_url",
    "addresses",
    "supplier",
    "isSupplier",
    "isAdmin"
  ]);
  var user = new User(body);
  res.send(user);
});

router.post("/add/verify", async (req, res) => {
  var verify = new Verifications();

  verify.userID = req.body.email;
  User.findOne({ email: verify.userID }, function(err, user) {
    if (err) throw err;
    if (user) res.send({ status: 0 });
  });
  verify.time = new Date().getTime();
  verify.token = randomstring.generate();
  verify.save();
  let url = `${keys.HOSTNAME}/register/verify/${verify.token}`;
  sgMail.setApiKey(keys.SENDGRID_API);
  const msg = {
    from: "support@fortminor.com",
    to: req.body.email,
    subject: "Important Work",
    html: `<h3>Welcome to MMB!</h3><b>Registration Link: <a href="${url}">Click here</a></b>`
  };

  //status : 1; timeout
  sgMail.send(msg, (err, info) => {
    console.log(err, info);
    if (err) res.send(err);
    //res.send(info);
    if (info[0].statusCode === 202) {
      res.send({ status: 2 });
    }
  });
});

router.get("/reverse/verify/:token", async (req, res) => {
  const token = req.params.token;
  console.log(`Token: ${token}`);
  const verify = await Verifications.findOne({ token });
  if (verify) {
    if (verify.verified) {
      res.send({ status: 1 });
    }
    if (!verify.verified) {
      res.send({ status: 2, verify });
    }
  } else {
    res.send({ status: 0 });
  }
});
module.exports = router;
