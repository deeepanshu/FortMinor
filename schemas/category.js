const mongoose = require("mongoose");
const keys = require("../config/keys");
mongoose.Promise = require("bluebird");

const category = new mongoose.Schema({
    name: String,
    visible: { type: Boolean, default: true },
    description: String,
    slug: String,
    url: String,
    subcategories: [mongoose.Schema.Types.ObjectId]
});

mongoose.model("category", category);
