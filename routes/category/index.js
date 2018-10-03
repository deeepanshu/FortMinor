let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Category = mongoose.model("category"),
    SubCategory = mongoose.model("subcategory"),
    Product = mongoose.model("product"),
    _ = require('lodash'),
    slug = require("slug"),
    db = mongoose.connection;


// Populate Routes
router.get("/populate/1", (req, res) => {
    Category.find({}).populate({path: 'subcategory', model: 'subcategory'}).exec((err, categories) => {
        return res.status(200).send(categories);
    });
});
router.get("/populate/2", (req, res) => {
    SubCategory.find({}).populate({path: 'product', model: 'product'}).exec((err, prodcut) => {
        return res.status(200).send(prodcut);
    });
});

/*
 Issue: cant populate second level of data.
 Heirarchy: Category -> SubCategory -> Product
 -I am able to get Category and SubCategory together, and SubCategory and Product together
 -Getting them together is, i am getting objects instead of _ids, i want this happen for levels.
 -Through this API, i want all 3 together.
 */
router.get("/populate/3", (req, res) => {
    Category.find({}).populate({
        path: 'subcategory', model: 'subcategory',
        populate:{
            path:'product', model:Product
        }
    }).exec((err, categories) => {
        return res.status(200).send(categories);
    });
});


//Get Parent Category
router.get("/get/categories", async (req, res) => {
    const categories = await Category.find({}).exec();
    res.send(categories);
});

//Get Subcategory
router.get("get/subcategories/:category_id", async (req, res) => {
    const id = _.pick(req.params, ["category_id"]);
    const category = await Category().findById(id).exec();
    res.send(category);
});

//Get Product
router.get("get/products/:category_id/:sub_category_id", async (req, res) => {
    const category_id = _.pick(req.params, ["category_id"]);
    const sub_category_id = _.pick(req.params, ["sub_category_id"]);
    const category = await Category().findById(id).exec();
    res.send(category);
});



// Add Parent Category
router.post("/add/category", (req, res) => {
    let body = _.pick(req.body, ["name", "description"]);
    let category = new Category(body);
    category.slug = slug(body.name.toLowerCase());
    console.log(category);
    category.save((err, category) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(category);
    });
});

//Add Sub Category
router.post("/add/subcategory", (req, res) => {
    let body = _.pick(req.body, ["name", "description", "categoryID"]);
    let subcategory = new SubCategory(body);
    subcategory.slug = slug(body.name.toLowerCase());
    subcategory.save((err, subcategory) => {
        if (err) return res.status(400).send(err);
        Category.findById(subcategory.categoryID, (err, category) => {
            if (err) return res.status(400).send(err);
            category.subcategory.push(subcategory._id);
            category.save((err) => {
                if (err) return res.status(400).send(err);
                return res.status(200).send(subcategory);
            })
        })
    });
});

//Add Product
router.post("/add/product", (req, res) => {
    let body = _.pick(req.body, ["name", "description", "categoryID", "subCategoryID"]);
    let product = new Product(body);
    product.slug = slug(body.name.toLowerCase());
    product.save((err, product) => {
        if (err) return res.status(400).send(err);
        SubCategory.findById(product.subCategoryID, (err, subcategory) => {
            if (err) return res.status(400).send(err);
            subcategory.product.push(product._id);
            subcategory.save((err) => {
                if (err) return res.status(400).send(err);
                return res.status(200).send(product);
            });
        });
    });
});


module.exports = router;