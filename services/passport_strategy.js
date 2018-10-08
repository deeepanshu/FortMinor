const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("user");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});
passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({
        email: username
    }, function(err, user) {
        console.log(user);
        if (err) {
            console.log(err);
            return done(err);
        } else if (!user) {
            console.log(false);
            return done(null, false);
        }
        if (user.password) {
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err){
                    return done(err);
                    console.log("ERROR");
                }
                if (!isMatch) {
                    return done(null, false);
                    console.log("NOT MATCH", isMatch);
                }
                done(null, user);
            });
        }
    });
}));