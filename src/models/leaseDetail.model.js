const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION = "lease_details";

class LeaseDetailModel {
  static create(data, session) {
    return getDB()
      .collection(COLLECTION)
      .insertOne(
        {
          user_id: new ObjectId(data.user_id),
          lease_id: new ObjectId(data.lease_id),
          details: data.details,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { session }
      );
  }

  static getByLeaseId(lease_id, user_id) {
    return getDB()
      .collection(COLLECTION)
      .findOne({
        lease_id: new ObjectId(lease_id),
        user_id: new ObjectId(user_id),
      });
  }

  static updateByLeaseId(lease_id, user_id, details, session) {
    return getDB()
      .collection(COLLECTION)
      .updateOne(
        {
          lease_id: new ObjectId(lease_id),
          user_id: new ObjectId(user_id),
        },
        {
          $set: {
            details,
            updated_at: new Date(),
          },
        },
        { session }
      );
  }

  static deleteByLeaseId(lease_id, user_id, session) {
    return getDB()
      .collection(COLLECTION)
      .deleteOne(
        {
          lease_id: new ObjectId(lease_id),
          user_id: new ObjectId(user_id),
        },
        { session }
      );
  }

  static getActive(lease_id, user_id) {
    return getDB()
      .collection(COLLECTION)
      .findOne({
        lease_id: new ObjectId(lease_id),
        user_id: new ObjectId(user_id),
        is_active: true,
      });
  }

  static async getLatestVersion(lease_id, user_id) {
    const docs = await getDB()
      .collection(COLLECTION)
      .find({
        lease_id: new ObjectId(lease_id),
        user_id: new ObjectId(user_id),
      })
      .sort({ version: -1 })
      .limit(1)
      .toArray();

    return docs[0] || null;
  }

  static deactivateActive(lease_id, user_id, session) {
    return getDB()
      .collection(COLLECTION)
      .updateMany(
        {
          lease_id: new ObjectId(lease_id),
          user_id: new ObjectId(user_id),
          is_active: true,
        },
        {
          $set: {
            is_active: false,
            updated_at: new Date(),
          },
        },
        { session }
      );
  }

  static createVersion(data, session) {
    return getDB()
      .collection(COLLECTION)
      .insertOne(
        {
          user_id: new ObjectId(data.user_id),
          lease_id: new ObjectId(data.lease_id),
          source_document_id: new ObjectId(data.source_document_id),
          version: data.version,
          details: data.details,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { session }
      );
  }

  static getByDocumentId(lease_id, document_id, user_id) {
    return getDB()
      .collection(COLLECTION)
      .findOne({
        lease_id: new ObjectId(lease_id),
        source_document_id: new ObjectId(document_id),
        user_id: new ObjectId(user_id),
      });
  }

  static async getVersionTimeline(lease_id, user_id) {
    return getDB()
      .collection(COLLECTION)
      .aggregate([
        {
          $match: {
            lease_id: new ObjectId(lease_id),
            user_id: new ObjectId(user_id),
          },
        },
        {
          $lookup: {
            from: "lease_documents",
            localField: "source_document_id",
            foreignField: "_id",
            as: "document",
          },
        },
        { $unwind: "$document" },
        {
          $project: {
            _id: 0,
            version: 1,
            is_active: 1,
            created_at: 1,
            document_id: "$document._id",
            document_name: "$document.document_name",
            document_type: "$document.document_type",
          },
        },
        { $sort: { version: -1 } },
      ])
      .toArray();
  }
}

module.exports = LeaseDetailModel;
