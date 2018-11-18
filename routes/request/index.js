let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Requests = mongoose.model("requests"),
    _ = require('lodash'),
    slug = require("slug"),
    db = mongoose.connection;


    // Post a request
    router.post("/add/", (req, res) => {
        let body = _.pick(req.body, ["productId","requestedBy"]);
        let requests = new Requests(body);
        requests.status = 0;

        requests.save((err, requests) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(category);
        });
    });

    // Post a request
    router.post("/view/user/", (req, res) => {
        let user = req.body.userId;
        Requests.findOne({requestedBy: user},(err, requests) =>{
            return res.status(200).send(requests);
        });
    });

    // Post a request
    router.post("/view/product/", (req, res) => {
        let product = req.body.productId;
        Requests.findOne({productId: product},(err, requests) =>{
            return res.status(200).send(requests);
        });
    });
