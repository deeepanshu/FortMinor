const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const subcategory = new mongoose.Schema({
    name: String,
    visible: { type: Boolean, default: true },
    description: String,
    slug: String,
    url: String,
    categoryID : mongoose.Schema.Types.ObjectId,
    product: [mongoose.Schema.Types.ObjectId],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId
    }
});

mongoose.model("subcategory", subcategory);
