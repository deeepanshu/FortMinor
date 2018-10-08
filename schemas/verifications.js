const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const Schema = mongoose.Schema;

const verificationSchema = new Schema({
    userID: String,
    token: String,
    time: String,
    verified: { type: Boolean, default: false },
});
mongoose.model("verifications", verificationSchema);