const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION = "lease_details";

class LeaseDetailModel {
  // CREATE
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

  // GET BY LEASE
  static getByLeaseId(lease_id, user_id) {
    return getDB()
      .collection(COLLECTION)
      .findOne({
        lease_id: new ObjectId(lease_id),
        user_id: new ObjectId(user_id),
      });
  }

  // UPDATE
  static updateByLeaseId(lease_id, user_id, details) {
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
        }
      );
  }

  // DELETE
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

  // SEARCH (future use)
  static search(user_id, query = {}) {
    return getDB()
      .collection(COLLECTION)
      .find({ user_id: new ObjectId(user_id), ...query })
      .toArray();
  }
}

module.exports = LeaseDetailModel;
