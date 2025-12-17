const bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model");

class UserController {
  static async create(req, res) {
    try {
      const { name, email, password, role_id, organization_id } = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const orgId =
        req.user.role === "org_admin"
          ? req.user.organization_id
          : organization_id;

      const id = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role_id,
        organization_id: orgId,
      });

      return res.status(201).json({ id });
    } catch (err) {
      console.error("User Create Error:", err);
      return res.status(500).json({ error: "Failed to create user" });
    }
  }

  static async getAll(req, res) {
    try {
      const { page, limit } = req.query;

      const orgId =
        req.user.role === "org_admin"
          ? req.user.organization_id
          : req.query.organization_id;

      const result = await UserModel.getAll({
        organization_id: orgId,
        page: Number(page),
        limit: Number(limit),
      });

      return res.json(result);
    } catch (err) {
      console.error("User GetAll Error:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  static async update(req, res) {
    try {
      const user = await UserModel.getById(req.params.id);

      if (
        req.user.role === "org_admin" &&
        String(user.organization_id) !== String(req.user.organization_id)
      ) {
        return res.status(403).json({ error: "Access denied" });
      }

      await UserModel.update(req.params.id, req.body);
      return res.json({ success: true });
    } catch (err) {
      console.error("User Update Error:", err);
      return res.status(500).json({ error: "Failed to update user" });
    }
  }

  static async delete(req, res) {
    try {
      const user = await UserModel.getById(req.params.id);

      if (
        req.user.role === "org_admin" &&
        String(user.organization_id) !== String(req.user.organization_id)
      ) {
        return res.status(403).json({ error: "Access denied" });
      }

      await UserModel.delete(req.params.id);
      return res.json({ success: true });
    } catch (err) {
      console.error("User Delete Error:", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
  }
}

module.exports = UserController;
