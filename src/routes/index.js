const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/organizations", require("./organization.routes"));
router.use("/users", require("./user.routes"));
router.use("/debug", require("./debug.routes"));

module.exports = router;
