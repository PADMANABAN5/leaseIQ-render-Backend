const { getDB } = require("../config/db");
const storage = require("../services/storage");
const LeaseModel = require("../models/lease.model");
const LeaseDocumentModel = require("../models/leaseDocument.model");
const LeaseDetailModel = require("../models/leaseDetail.model"); // ✅ NEW
const ALLOWED_DOCUMENT_TYPES = ["main lease", "amendment"];

// deep merge utility (used ONLY for amendment delta)
const deepMerge = (target, source) => {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

class LeaseController {
  // GET COMPLETE LEASE
  static async getById(req, res) {
    try {
      const lease = await LeaseModel.getByIdFull(
        req.params.id,
        req.user.user_id
      );

      if (!lease) {
        return res.status(404).json({ error: "Lease not found" });
      }

      return res.json({ data: lease });
    } catch (err) {
      console.error("Get Lease Error:", err);
      return res.status(500).json({ error: "Failed to fetch lease" });
    }
  }

  // PATCH LEASE DETAILS
  static async updateLeaseDetails(req, res) {
    try {
      const { lease_details } = req.body;

      if (!lease_details || typeof lease_details !== "object") {
        return res.status(400).json({
          error: "lease_details object is required",
        });
      }

      await LeaseModel.upsertLeaseDetails(
        req.params.id,
        req.user.user_id,
        lease_details
      );

      return res.json({
        message: "Lease details updated successfully",
      });
    } catch (err) {
      console.error("Update Lease Details Error:", err);
      return res.status(500).json({ error: "Failed to update lease details" });
    }
  }

  static async uploadAdditionalDocument(req, res) {
    let uploadedFilePath = null;

    try {
      const { document_type } = req.body;
      const leaseId = req.params.id;

      if (!ALLOWED_DOCUMENT_TYPES.includes(document_type)) {
        return res.status(400).json({
          error: "document_type must be 'main lease' or 'amendment'",
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Document file is required" });
      }

      const lease = await LeaseModel.getByIdFull(leaseId, req.user.user_id);

      if (!lease) {
        return res.status(404).json({ error: "Lease not found" });
      }

      uploadedFilePath = await storage.uploadFile({
        buffer: req.file.buffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
      });

      await LeaseDocumentModel.create({
        user_id: req.user.user_id,
        lease_id: leaseId,
        document_name: req.file.originalname,
        document_type,
        file_path: uploadedFilePath,
      });

      return res.status(201).json({
        message: "Document uploaded successfully",
      });
    } catch (err) {
      if (uploadedFilePath) {
        try {
          await storage.deleteFile(uploadedFilePath);
        } catch (cleanupErr) {
          console.error("Storage rollback failed:", cleanupErr);
        }
      }

      console.error("Upload Lease Document Error:", err);
      return res.status(500).json({
        error: "Failed to upload document",
      });
    }
  }

  static async uploadDocumentAndUpdateDetails(req, res) {
    const db = getDB();
    const session = db.client.startSession();
    let uploadedFilePath = null;

    try {
      let { document_type, lease_details } = req.body;

      if (typeof lease_details === "string") {
        lease_details = JSON.parse(lease_details);
      }

      if (!ALLOWED_DOCUMENT_TYPES.includes(document_type)) {
        return res.status(400).json({
          error: "document_type must be 'main lease' or 'amendment'",
        });
      }

      if (!lease_details || typeof lease_details !== "object") {
        return res.status(400).json({
          error: "lease_details object is required",
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Document file is required" });
      }

      session.startTransaction();

      const lease = await LeaseModel.getByIdFull(
        req.params.id,
        req.user.user_id
      );

      if (!lease) {
        return res.status(404).json({ error: "Lease not found" });
      }

      uploadedFilePath = await storage.uploadFile({
        buffer: req.file.buffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
      });

      const docResult = await LeaseDocumentModel.create(
        {
          user_id: req.user.user_id,
          lease_id: req.params.id,
          document_name: req.file.originalname,
          document_type,
          file_path: uploadedFilePath,
        },
        session
      );

      const active = await LeaseDetailModel.getActive(
        req.params.id,
        req.user.user_id
      );

      let version = 1;
      let finalDetails = lease_details;

      if (active) {
        version = active.version + 1;
        finalDetails = deepMerge(
          JSON.parse(JSON.stringify(active.details)),
          lease_details
        );

        await LeaseDetailModel.deactivateActive(
          req.params.id,
          req.user.user_id,
          session
        );
      }

      await LeaseDetailModel.createVersion(
        {
          user_id: req.user.user_id,
          lease_id: req.params.id,
          source_document_id: docResult.insertedId,
          version,
          details: finalDetails,
        },
        session
      );

      await session.commitTransaction();

      return res.status(200).json({
        message: "Document uploaded and lease details versioned successfully",
        version,
      });
    } catch (err) {
      await session.abortTransaction();

      if (uploadedFilePath) {
        try {
          await storage.deleteFile(uploadedFilePath);
        } catch (cleanupErr) {
          console.error("Storage rollback failed:", cleanupErr);
        }
      }

      console.error("Upload Lease Document Error:", err);
      return res.status(500).json({
        error: "Failed to upload document and update lease details",
      });
    } finally {
      session.endSession();
    }
  }

  // GET LEASE DETAILS BY DOCUMENT
  static async getLeaseDetailsByDocument(req, res) {
    try {
      const { id: leaseId, documentId } = req.params;

      const lease = await LeaseModel.getByIdFull(leaseId, req.user.user_id);

      if (!lease) {
        return res.status(404).json({ error: "Lease not found" });
      }

      const leaseDetails = await LeaseDetailModel.getByDocumentId(
        leaseId,
        documentId,
        req.user.user_id
      );

      if (!leaseDetails) {
        return res.status(404).json({
          error: "Lease details not found for this document",
        });
      }

      return res.json({
        data: {
          lease_id: leaseId,
          document_id: documentId,
          version: leaseDetails.version,
          details: leaseDetails.details,
          created_at: leaseDetails.created_at,
        },
      });
    } catch (err) {
      console.error("Get Lease Details By Document Error:", err);
      return res.status(500).json({
        error: "Failed to fetch lease details",
      });
    }
  }
}

module.exports = LeaseController;
