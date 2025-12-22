const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/organizations", require("./organization.routes"));
router.use("/users", require("./user.routes"));
router.use("/test", require("./test.routes"));
router.use("/debug", require("./debug.routes"));
router.use("/portfolio", require("./portfolio.routes"));

module.exports = router;
