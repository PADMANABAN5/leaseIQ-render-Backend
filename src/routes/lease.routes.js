const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.middleware");
const LeaseController = require("../controllers/lease.controller");

router.get("/:id", auth, LeaseController.getById);
router.patch("/:id/details", auth, LeaseController.updateLeaseDetails);

module.exports = router;
