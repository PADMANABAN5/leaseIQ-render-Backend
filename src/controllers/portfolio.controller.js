const { getDB } = require("../config/db");
const storage = require("../services/storage");

const PropertyModel = require("../models/property.model");
const UnitModel = require("../models/unit.model");
const TenantModel = require("../models/tenant.model");
const LeaseModel = require("../models/lease.model");
const LeaseDocumentModel = require("../models/leaseDocument.model");
const LeaseDetailModel = require("../models/leaseDetail.model");

const ALLOWED_DOCUMENT_TYPES = ["main lease", "amendment"];

class PortfolioController {
  static async build(req, res) {
    const db = getDB();
    const session = db.client.startSession();

    let uploadedFilePath = null;

    try {
      const {
        property_name,
        address,
        unit_number,
        tenant_name,
        square_ft,
        document_type,
        lease_details,
      } = req.body;

      // Parse lease_details (multipart/form-data sends string)
      if (typeof lease_details === "string") {
        lease_details = JSON.parse(lease_details);
      }

      if (!property_name || !unit_number || !tenant_name || !document_type) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Document is required" });
      }

      if (!ALLOWED_DOCUMENT_TYPES.includes(document_type)) {
        return res.status(400).json({
          error: "document_type must be either 'main lease' or 'amendment'",
        });
      }

      if (!lease_details || typeof lease_details !== "object") {
        return res.status(400).json({
          error: "lease_details is required and must be an object",
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Lease document is required" });
      }

      session.startTransaction();

      const property = await PropertyModel.create(
        {
          user_id: req.user.user_id,
          property_name,
          address,
        },
        session
      );

      const unit = await UnitModel.create(
        {
          user_id: req.user.user_id,
          property_id: property.insertedId,
          unit_number,
          square_ft,
        },
        session
      );

      const tenant = await TenantModel.create(
        {
          user_id: req.user.user_id,
          tenant_name,
        },
        session
      );

      const lease = await LeaseModel.create(
        {
          user_id: req.user.user_id,
          tenant_id: tenant.insertedId,
          unit_id: unit.insertedId,
        },
        session
      );

      await LeaseDetailModel.create(
        {
          user_id: req.user.user_id,
          lease_id: lease.insertedId,
          details: lease_details,
        },
        session
      );

      // Upload Document (OUTSIDE DB, must track for rollback)
      uploadedFilePath = await storage.uploadFile({
        buffer: req.file.buffer,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
      });

      await LeaseDocumentModel.create(
        {
          user_id: req.user.user_id,
          lease_id: lease.insertedId,
          document_name: req.file.originalname,
          document_type,
          file_path: uploadedFilePath,
        },
        session
      );

      await session.commitTransaction();

      return res.status(201).json({
        message: "Portfolio created successfully",
      });
    } catch (err) {
      await session.abortTransaction();

      // STORAGE ROLLBACK
      if (uploadedFilePath) {
        try {
          await storage.deleteFile(uploadedFilePath);
        } catch (cleanupErr) {
          console.error("Storage rollback failed:", cleanupErr);
        }
      }

      console.error("Portfolio Build Error:", err);
      return res.status(500).json({ error: "Failed to build portfolio" });
    } finally {
      session.endSession();
    }
  }
}

module.exports = PortfolioController;
