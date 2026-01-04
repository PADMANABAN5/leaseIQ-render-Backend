const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.middleware");
const { handleUpload } = require("../middlewares/upload.middleware");
const LeaseController = require("../controllers/lease.controller");

router.get("/:id", auth, LeaseController.getById);
router.patch("/:id/details", auth, LeaseController.updateLeaseDetails);
router.post(
  "/:id/documents",
  auth,
  handleUpload,
  LeaseController.uploadAdditionalDocument
);

router.post(
  "/:id/documentsupdate",
  auth,
  handleUpload,
  LeaseController.uploadDocumentAndUpdateDetails
);

router.get(
  "/:id/details/:documentId",
  auth,
  LeaseController.getLeaseDetailsByDocument
);

router.get("/:id/versions", auth, LeaseController.getVersionTimeline);

module.exports = router;
