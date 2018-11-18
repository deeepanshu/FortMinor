let express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  Category = mongoose.model("category"),
  SubCategory = mongoose.model("subcategory"),
  Product = mongoose.model("product"),
  User = mongoose.model("user"),
  _ = require("lodash"),
  slug = require("slug"),
  db = mongoose.connection;

// Populate Routes
router.get("/populate/1", (req, res) => {
  Category.find({})
    .populate({ path: "subcategory", model: "subcategory" })
    .exec((err, categories) => {
      return res.status(200).send(categories);
    });
});
router.get("/populate/category/:id", (req, res) => {
  Category.findOne({ _id: req.params.id })
    .populate({ path: "subcategory", model: "subcategory" })
    .exec((err, categories) => {
      return res.status(200).send(categories);
    });
});
router.get("/populate/subcategory/:id", (req, res) => {
  SubCategory.findOne({ _id: req.params.id })
    .populate({ path: "product", model: "product" })
    .exec((err, subcategory) => {
      return res.status(200).send(subcategory);
    });
});
router.get("/populate/product/:id", (req, res) => {
  Product.findOne({ _id: req.params.id }, (err, product) => {
    return res.status(200).send(product);
  });
});

router.get("/populate/3", (req, res) => {
  Category.find({})
    .populate({
      path: "subcategory",
      model: "subcategory",
      populate: {
        path: "product",
        model: Product
      }
    })
    .exec((err, categories) => {
      return res.status(200).send(categories);
    });
});

// //Get Parent Category
// router.get("/get/categories", async (req, res) => {
//     const categories = await Category.find({}).exec();
//     res.send(categories);
// });
//
// //Get Subcategory
// router.get("get/subcategories/:category_id", async (req, res) => {
//     const id = _.pick(req.params, ["category_id"]);
//     const category = await Category().findById(id).exec();
//     res.send(category);
// });
//
// //Get Product
// router.get("get/products/:category_id/:sub_category_id", async (req, res) => {
//     const category_id = _.pick(req.params, ["category_id"]);
//     const sub_category_id = _.pick(req.params, ["sub_category_id"]);
//     const category = await Category().findById(id).exec();
//     res.send(category);
// });

// Add Parent Category
router.post("/add/category", (req, res) => {
  let body = _.pick(req.body, ["name", "description", "image"]);
  let category = new Category(body);
  category.slug = slug(body.name.toLowerCase());
  console.log(req.user);
  category.createdBy = mongoose.Types.ObjectId(req.user._id);
  console.log(category);
  category.save((err, category) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(category);
  });
});

//Add Sub Category
router.post("/add/subcategory", (req, res) => {
  let body = _.pick(req.body, ["name", "description", "image", "categoryID"]);
  let subcategory = new SubCategory(body);
  subcategory.slug = slug(body.name.toLowerCase());
  subcategory.createdBy = mongoose.Types.ObjectId(req.user._id);
  subcategory.save((err, subcategory) => {
    if (err) return res.status(400).send(err);
    Category.findById(subcategory.categoryID, (err, category) => {
      if (err) return res.status(400).send(err);
      category.subcategory.push(subcategory._id);
      category.save(err => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(subcategory);
      });
    });
  });
});

//Add Product
router.post("/add/product", (req, res) => {
  let body = _.pick(req.body, [
    "name",
    "description",
    "image",
    "categoryID",
    "subCategoryID"
  ]);
  let product = new Product(body);
  product.slug = slug(body.name.toLowerCase());
  product.createdBy = mongoose.Types.ObjectId(req.user._id);
  product.save((err, product) => {
    if (err) return res.status(400).send(err);
    SubCategory.findById(product.subCategoryID, (err, subcategory) => {
      if (err) return res.status(400).send(err);
      subcategory.product.push(product._id);
      subcategory.save(err => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(product);
      });
    });
  });
});

// Supplier Initial Add Categories to deal with.
router.post("/add/supplier/categories", (req, res) => {
  let body = _.pick(req.body, ["categories"]);
  let user = req.user;
  if (user) {
    if (user.isSupplier) {
      let updatedUser = new User(user);
      updatedUser.supplier.dealIn = body.categories;
      return updatedUser.save(err => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(updatedUser);
      });
    }
    return res.status(400).send({ msg: "not a supplier" });
  }
  res.status(400).send({ msg: "not logged in" });
});

router.get("/list/supplier/dealsIn", (req, res) => {
  let user = req.user;
  //Not logged in
  if (!user) res.status(400).send({ err: 1 });
  //Not a supplier
  if (!user.isSupplier) res.status(400).send({ err: 2 });
  if (user.isSupplier) {
    let dealsIn = user.supplier.dealIn;
    if (dealsIn) {
      console.log(dealsIn);
      dealsIn = dealsIn.map(d => mongoose.Types.ObjectId(d));

      return SubCategory.find(
        {
          _id: {
            $in: dealsIn
          }
        },
        (err, subcategory) => {
          return res.send({ err: 0, subcategory });
        }
      );
    } else {
      //Is a supplier, but not have categories listed
      res.status(200).send({ err: 3 });
    }
  }
});

router.post("/edit/is/supplier/no", (req, res) => {
  let user = req.user;
  if (!user) res.status(400).send({ msg: "Not Logged In..." });
  if (!user.isSupplier) {
    let updatedUser = new User(user);
    updatedUser.isSupplier = true;
    return updatedUser.save(err => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(updatedUser);
    });
  }
  res.status(200).send(user);
});
router.post("/edit/is/supplier/yes", (req, res) => {
  let user = req.user;
  if (!user) res.status(400).send({ msg: "Not Logged In..." });
  if (user.isSupplier) {
    let updatedUser = new User(user);
    updatedUser.isSupplier = false;
    return updatedUser.save(err => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(updatedUser);
    });
  }
  res.status(200).send(user);
});
module.exports = router;
