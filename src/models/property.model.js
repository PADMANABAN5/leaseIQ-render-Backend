const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION = "properties";
class PropertyModel {
  static create(data, session) {
    return getDB()
      .collection(COLLECTION)
      .insertOne(
        {
          user_id: new ObjectId(data.user_id),
          property_name: data.property_name,
          address: data.address || null,
          created_at: new Date(),
        },
        { session }
      );
  }
}

module.exports = PropertyModel;
