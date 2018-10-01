const express = require("express")
router = express.Router();

router.get("/", function(req, res) {
  res.send({"message":"hi"});
});
module.exports = router;
