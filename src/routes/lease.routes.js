const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.middleware");
const { handleUpload } = require("../middlewares/upload.middleware");
const LeaseController = require("../controllers/lease.controller");
const LeaseDetailsVersion = require("../controllers/leaseDetailsVersion.controller")
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

// read lease document
router.get("/document/:documentId", auth, LeaseController.getDocument);
router.patch(
  "/:id/details/version/:versionNumber",
  auth,
  LeaseDetailsVersion.updateLeaseDetailsVersion
);
module.exports = router;
