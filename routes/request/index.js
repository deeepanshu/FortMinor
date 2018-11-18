let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Requests = mongoose.model("requests"),
    _ = require('lodash'),
    slug = require("slug"),
    db = mongoose.connection;


    // Post a request
    router.post("/add/", (req, res) => {
        let user = req.user;
        let product = req.body.productId;
        let requests = new Requests();
        requests.requestedBy = user;
        requests.productId = product;
        requests.status = 0;

        requests.save((err, requests) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(requests);
        });
    });

    // View a user request
    router.post("/view/user/", (req, res) => {
        let user = req.body.userId;
        Requests.find({requestedBy: user},(err, requests) =>{
            return res.status(200).send(requests);
        });
    });

    // View a product request
    router.post("/view/product/", (req, res) => {
        let product = req.body.productId;
        Requests.find({productId: product},(err, requests) =>{
            return res.status(200).send(requests);
        });
    });

module.exports = router;
