const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

router.post(
  "/",
  auth,
  allowRoles("super_admin", "org_admin"),
  UserController.create
);
router.get(
  "/",
  auth,
  allowRoles("super_admin", "org_admin"),
  UserController.getAll
);
router.patch(
  "/:id",
  auth,
  allowRoles("super_admin", "org_admin"),
  UserController.update
);
router.delete(
  "/:id",
  auth,
  allowRoles("super_admin", "org_admin"),
  UserController.delete
);

//Approval flow routes
router.get(
  "/pending",
  auth,
  allowRoles("org_admin"),
  UserController.getPending
);

router.patch(
  "/:id/review",
  auth,
  allowRoles("org_admin", "super_admin"),
  UserController.reviewUser
);

module.exports = router;
