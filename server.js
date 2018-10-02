const express = require("express"),
    path = require("path"),
    fs = require('fs'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    keys = require('./config/keys');

require("./schemas/category");
require("./schemas/user");
require("./schemas/product");
require("./schemas/subcategory");

mongoose.Promise = require("bluebird");
mongoose.connect(keys.MONGO_URI);

const auth_routes = require("./routes/auth");
const category_routes = require("./routes/category/index");

app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile("server.log", log + "\n", err => {
        if (err) {
            console.log("Unable to append to server.log.");
        }
    });
    next();
});

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json({ limit: "50mb" }));

app.use("/auth", auth_routes);
app.use("/api", category_routes);

//Fire up the server
const port = process.env.PORT ||5000;
app.listen(port);