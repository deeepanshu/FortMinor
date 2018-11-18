const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const requests = new mongoose.Schema({
    requestedBy: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    status: Number,
    timeOfOrder:  {type : Date, default: Date.now}
});

mongoose.model("requests", requests);
