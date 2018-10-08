var express = require('express');
var router = express.Router();
const passport = require("passport");
const keys = require('../../config/keys'),
    mongoose = require('mongoose'),
    User = mongoose.model("user"),
    randomstring = require("randomstring"),
Verifications = mongoose.model("verifications");
const sgMail = require("@sendgrid/mail");
router.get("/current_user", (req, res) => {
    console.log(req.user);
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
    function (req, res) {
        console.log("75");
        console.log(req);
    }
);
router.post("/add/user/basic/", async (req, res) => {
    let user = await User.findById({_id: req.body.user.id});
    console.log("487", user);
    if (user) {
        console.log(req.body);

        user["password"] = bcrypt.hashSync(
            req.body.user.password,
            bcrypt.genSaltSync(8),
            null
        );
        user["fullName"] = req.body.user.fullName;
        user["contact"] = req.body.user.contact;
        user["organisationName"] = req.body.user.organisationName;
        user["isAdmin"] = req.body.user.isAdmin ? req.body.user.isAdmin : false;
        user["isSupplier"] = req.body.user.isSupplier
            ? req.body.user.isSupplier
            : false;
        user["supplier"] = user.isSupplier ? req.body.user.supplier : {};
        const status = await user.save();
        console.log(`status: ${status}`);
        res.send(status);
    } else {
        res.send({error: 400});
    }
});

router.get("/list/users", async (req, res) => {
    let usernames = await User.find({}).exec();
    var i,username = [];
    for(i=0;i<usernames.length;i++){
        var body=_.pick(usernames[i], ["_id","email","contact","fullName","organisationName","google_plus_url","addresses","supplier","isSupplier","isAdmin"]);
        var user= new User(body);
        username.push(user);
    }
    res.send(username);
});

router.post("/get/user/:id", async (req, res) => {
    const obj = await User.findById({ _id: req.pararms.id }).exec();
    var body=_.pick(obj, ["_id","email","contact","fullName","organisationName","google_plus_url","addresses","supplier","isSupplier","isAdmin"]);
    var user= new User(body);
    res.send(user);
});

router.post("/add/verify", async (req, res) => {
    var verify = new Verifications();

    verify.userID = req.body.email;
    User.findOne({ email: verify.userID }, function(err, user) {
        if (err) throw err;
        if (user) res.send({ status: 0 });
    });
    // const user = User();
    // user.email = req.body.email;
    // user.save();
    verify.time = new Date().getTime();
    verify.token = randomstring.generate();
    const status = await verify.save();
    let url = `http://localhost:3000/register/verify/${verify.token}`;
    sgMail.setApiKey(
        keys.SENDGRID_API
    );
    const msg = {
        from: "support@fortminor.com",
        to: req.body.email,
        subject: "Important Work",
        html: `<h3>Welcome to MMB!</h3><b>Registration Link: <a href="${url}">Click here</a></b>`
    };

    //status : 1; timeout
    sgMail.send(msg, (err, info) => {
        console.log(err, info)
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
    // status code if cannot find token status 0

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