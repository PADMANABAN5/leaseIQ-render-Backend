const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const storage = require("../services/storage");

const PropertyModel = require("../models/property.model");
const UnitModel = require("../models/unit.model");
const TenantModel = require("../models/tenant.model");
const LeaseModel = require("../models/lease.model");
const LeaseDocumentModel = require("../models/leaseDocument.model");

class UnitController {
  static async createWithLease(req, res) {
    const db = getDB();
    const session = db.client.startSession();
    let uploadedFilePath = null;

    try {
      const {
        property_id,
        property_name,
        address,
        unit_number,
        tenant_id,
        tenant_name,
        square_ft,
        monthly_rent,
        document_type,
      } = req.body;

      if (!unit_number) {
        return res.status(400).json({ error: "unit_number is required" });
      }

      if (!tenant_id && !tenant_name) {
        return res
          .status(400)
          .json({ error: "tenant_id or tenant_name required" });
      }

      session.startTransaction();

      //PROPERTY
      let propertyId;

      if (property_id) {
        const property = await db.collection("properties").findOne({
          _id: new ObjectId(property_id),
          user_id: new ObjectId(req.user.user_id),
        });

        if (!property) {
          return res.status(403).json({ error: "Invalid property access" });
        }

        propertyId = property._id;
      } else {
        const property = await PropertyModel.create(
          {
            user_id: req.user.user_id,
            property_name,
            address,
          },
          session
        );
        propertyId = property.insertedId;
      }

      //TENANT
      let tenantId;

      if (tenant_id) {
        const tenant = await db.collection("tenants").findOne({
          _id: new ObjectId(tenant_id),
          user_id: new ObjectId(req.user.user_id),
        });

        if (!tenant) {
          return res.status(403).json({ error: "Invalid tenant access" });
        }

        tenantId = tenant._id;
      } else {
        const tenant = await TenantModel.create(
          {
            user_id: req.user.user_id,
            tenant_name,
          },
          session
        );
        tenantId = tenant.insertedId;
      }

      //UNIT
      const unit = await UnitModel.create(
        {
          user_id: req.user.user_id,
          property_id: propertyId,
          unit_number,
          square_ft,
          monthly_rent,
        },
        session
      );

      // LEASE
      const lease = await LeaseModel.create(
        {
          user_id: req.user.user_id,
          tenant_id: tenantId,
          unit_id: unit.insertedId,
        },
        session
      );

      //DOCUMENT
      if (req.file) {
        if (
          document_type &&
          !["main lease", "amendment"].includes(document_type)
        ) {
          return res.status(400).json({
            error: "document_type must be 'main lease' or 'amendment'",
          });
        }

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
      }

      await session.commitTransaction();

      return res.status(201).json({
        message: "Unit and lease created successfully",
        data: {
          property_id: propertyId,
          unit_id: unit.insertedId,
          tenant_id: tenantId,
          lease_id: lease.insertedId,
        },
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

      console.error("Unit Create Error:", err);
      return res.status(500).json({ error: "Failed to create unit" });
    } finally {
      session.endSession();
    }
  }
}

module.exports = UnitController;
