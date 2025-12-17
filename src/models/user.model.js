const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION = "users";

class UserModel {
  static async create(data) {
    const payload = {
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role_id: new ObjectId(data.role_id),
      organization_id: data.organization_id
        ? new ObjectId(data.organization_id)
        : null,
      is_active: true,
      created_at: new Date(),
    };

    const result = await getDB().collection(COLLECTION).insertOne(payload);
    return result.insertedId;
  }

  static async getAll({ organization_id, page = 1, limit = 10 }) {
    const query = {};
    if (organization_id) query.organization_id = new ObjectId(organization_id);

    const skip = (page - 1) * limit;

    const data = await getDB()
      .collection(COLLECTION)
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await getDB().collection(COLLECTION).countDocuments(query);

    return { data, total, page, limit };
  }

  static async getById(id) {
    return getDB()
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });
  }

  static async update(id, data) {
    const allowedFields = ["name", "email", "is_active"];
    const updateData = {};

    allowedFields.forEach((key) => {
      if (data[key] !== undefined) updateData[key] = data[key];
    });

    return getDB()
      .collection(COLLECTION)
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  }

  static async delete(id) {
    return getDB()
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = UserModel;
