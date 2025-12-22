const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const COLLECTION = "tenants";
class TenantModel {
  static create(data, session) {
    return getDB()
      .collection(COLLECTION)
      .insertOne(
        {
          user_id: new ObjectId(data.user_id),
          tenant_name: data.tenant_name,
          created_at: new Date(),
        },
        { session }
      );
  }
}

module.exports = TenantModel;
