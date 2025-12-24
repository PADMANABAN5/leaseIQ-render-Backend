const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/organizations", require("./organization.routes"));
router.use("/users", require("./user.routes"));
router.use("/test", require("./test.routes"));
router.use("/debug", require("./debug.routes"));
router.use("/portfolio", require("./portfolio.routes"));
router.use("/units", require("./unit.routes"));
router.use("/properties", require("./property.routes"));

module.exports = router;
