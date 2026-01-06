const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/signup", signup);
router.post("/org-signup", orgSignup);

module.exports = router;
