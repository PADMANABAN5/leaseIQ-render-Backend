const { getDB } = require("../config/db");

const PropertyModel = require("../models/property.model");
const UnitModel = require("../models/unit.model");
const TenantModel = require("../models/tenant.model");
const LeaseModel = require("../models/lease.model");

class UnitController {
  static async createWithLease(req, res) {
    const db = getDB();
    const session = db.client.startSession();

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

      //Property
      let propertyId;

      if (property_id) {
        const property = await db.collection("properties").findOne({
          _id: property_id,
          user_id: req.user.user_id,
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

      //Tenant
      let tenantId;

      if (tenant_id) {
        const tenant = await db.collection("tenants").findOne({
          _id: tenant_id,
          user_id: req.user.user_id,
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

      //Unit
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

      //Lease
      await LeaseModel.create(
        {
          user_id: req.user.user_id,
          tenant_id: tenantId,
          unit_id: unit.insertedId,
        },
        session
      );

      await session.commitTransaction();

      return res.status(201).json({
        message: "Unit and lease created successfully",
        data: {
          unit_id: unit.insertedId,
          property_id: propertyId,
          tenant_id: tenantId,
        },
      });
    } catch (err) {
      await session.abortTransaction();
      console.error("Unit Create Error:", err);
      return res.status(500).json({ error: "Failed to create unit" });
    } finally {
      session.endSession();
    }
  }
}

module.exports = UnitController;
