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
require("./schemas/verifications");
require("./schemas/requests");

mongoose.Promise = require("bluebird");
mongoose.connect(keys.MONGO_URI);

const auth_routes = require("./routes/auth");
const category_routes = require("./routes/category/index");
const request_routes = require("./routes/request/index");

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});


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
app.use("/request", request_routes);

//Fire up the server
const port = process.env.PORT ||5000;
app.listen(port);
