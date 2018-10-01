const express = require("express"),
router = require("./routes/routes.js"),
path = require("path"),
app = express();


app.use("/api", api_routes);

//Fire up the server
const port = process.env.PORT || 3000;
app.listen(port);