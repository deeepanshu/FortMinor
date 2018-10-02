let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Category = mongoose.model("category"),
    SubCategory = mongoose.model("subcategory"),
    Product = mongoose.model("product"),
     _ = require('lodash'),
    slug = require("slug");

router.get("/get/categories", async (req, res)=>{
    const categories = await Category.find({}).exec();
    res.send(categories);
});

router.post("/add/category",  (req, res)=>{
    let body = _.pick(req.body, ["name", "description"]);
    let category = new Category(body);
    category.slug = slug(body.name.toLowerCase());
    console.log(category);
    category.save((err, category)=>{
        console.log(err, category);
        if(err) return res.status(400).send(err);
        return res.status(200).send(category);
    });
});

module.exports = router;