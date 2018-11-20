const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const requests = new mongoose.Schema({
  requestedBy: mongoose.Schema.Types.Mixed,
  product: mongoose.Schema.Types.Mixed,
  status: { type: Number, default: 0 },
  timeOfOrder: { type: Date, default: Date.now }
});

mongoose.model("requests", requests);
