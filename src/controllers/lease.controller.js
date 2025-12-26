const LeaseModel = require("../models/lease.model");

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
}

module.exports = LeaseController;
