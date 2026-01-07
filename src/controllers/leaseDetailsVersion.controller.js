const { getDB } = require("../config/db");
const LeaseModel = require("../models/lease.model");
const { ObjectId } = require("mongodb");

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

class LeaseDetailsVersion {

static async updateLeaseDetailsVersion(req, res) {
  try {
    const leaseId = req.params.id;
    const versionNumber = parseInt(req.params.versionNumber, 10);
    let { lease_details } = req.body;

    if (!lease_details || typeof lease_details !== "object") {
      return res.status(400).json({ error: "lease_details object is required" });
    }

    if (typeof lease_details === "string") {
      // parse if sent as JSON string
      try {
        lease_details = JSON.parse(lease_details);
      } catch {
        return res.status(400).json({ error: "Invalid JSON in lease_details" });
      }
    }

    const lease = await LeaseModel.getByIdFull(leaseId, req.user.user_id);
    if (!lease) {
      return res.status(404).json({ error: "Lease not found" });
    }

    const db = getDB();
    const leaseDetailCollection = db.collection("lease_details");
    const existingVersion = await leaseDetailCollection.findOne({
      lease_id: new ObjectId(leaseId),
      user_id: new ObjectId(req.user.user_id),
      version: versionNumber,
    });

    if (!existingVersion) {
      return res.status(404).json({ error: `Version ${versionNumber} not found` });
    }

    const updatedDetails = deepMerge(
      JSON.parse(JSON.stringify(existingVersion.details)),
      lease_details
    );

    await leaseDetailCollection.updateOne(
      { _id: existingVersion._id },
      {
        $set: {
          details: updatedDetails,
          updated_at: new Date(),
        },
      }
    );

    return res.json({
      message: `Lease details updated for version ${versionNumber}`,
      version: versionNumber,
      details: updatedDetails,
    });
  } catch (err) {
    console.error("Update Lease Details Version Error:", err);
    return res.status(500).json({ error: "Failed to update lease version" });
  }
}
}

module.exports = LeaseDetailsVersion