const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const COLLECTION = "leases";
class LeaseModel {
  static create(data, session) {
    return getDB()
      .collection(COLLECTION)
      .insertOne(
        {
          user_id: new ObjectId(data.user_id),
          tenant_id: new ObjectId(data.tenant_id),
          unit_id: new ObjectId(data.unit_id),
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          created_at: new Date(),
        },
        { session }
      );
  }
}

module.exports = LeaseModel;
