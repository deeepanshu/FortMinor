const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const category = new mongoose.Schema({
    name: String,
    visible: { type: Boolean, default: true },
    description: String,
    slug: String,
    url: String,
    subcategory: [mongoose.Schema.Types.ObjectId],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    image:String
});

mongoose.model("category", category);
