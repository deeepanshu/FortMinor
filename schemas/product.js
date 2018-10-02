const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const product = new mongoose.Schema({
    name: String,
    visible: { type: Boolean, default: true },
    description: String,
    slug: String,
    url: String,
    attributes: Array
});

mongoose.model("product", product);
