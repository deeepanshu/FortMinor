const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const product = new mongoose.Schema({
    name: String,
    visible: { type: Boolean, default: true },
    description: String,
    slug: String,
    url: String,
    categoryID : mongoose.Schema.Types.ObjectId,
    subCategoryID : mongoose.Schema.Types.ObjectId,
    attributes: Array,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId
    }
});

mongoose.model("product", product);
