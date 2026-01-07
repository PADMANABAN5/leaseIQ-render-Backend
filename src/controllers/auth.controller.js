const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
// const { ObjectId } = require("mongodb");
const UserModel = require("../models/user.model");
const RoleModel = require("../models/role.model");
const OrganizationModel = require("../models/organization.model");

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({ message: "Email or username and password required" });
    }

    let user = null;

    if (email) {
      user = await UserModel.getByEmail(email.toLowerCase());
    } else if (username) {
      user = await UserModel.getByUsername(username.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.is_active) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const role = await RoleModel.getById(user.role_id);

    if (!role) {
      return res.status(500).json({ message: "Associated role not found" });
    }

    const token = generateToken({
      user_id: user._id.toString(),
      role: role.role_name,
      organization_id: user.organization_id
        ? user.organization_id.toString()
        : null,
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: role.role_name,
        organization_id: user.organization_id,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existingEmailUser = await UserModel.getByEmail(email.toLowerCase());
    if (existingEmailUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let finalUsername;
    if (username && username.trim()) {
      const normalizedUsername = username.toLowerCase();
      const existingUsernameUser = await UserModel.getByUsername(
        normalizedUsername
      );
      if (existingUsernameUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      finalUsername = normalizedUsername;
    } else {
      finalUsername = await UserModel.generateUsername();
    }

    const role = await RoleModel.getByName("individual");

    if (!role) {
      return res.status(500).json({ message: "Individual role not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userId = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase(),
      username: finalUsername,
      password: hashedPassword,
      role_id: role._id,
      organization_id: null,
    });

    res.status(201).json({
      message: "Signup successful",
      user_id: userId,
      username: finalUsername,
      email: email.toLowerCase(),
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

exports.orgSignup = async (req, res) => {
  try {
    const { name, email, username, password, org_option, org_name } = req.body;

    // Validations
    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      !org_option ||
      !org_name?.trim()
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email exists
    const existingUser = await UserModel.getByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate username if not provided
    const finalUsername = username?.trim()
      ? username.toLowerCase()
      : await UserModel.generateUsername();

    if (username?.trim()) {
      const existingUsername = await UserModel.getByUsername(finalUsername);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (org_option === "create_new") {
      // === CASE 1: Create new organization + become org_admin ===

      const orgResult = await OrganizationModel.create({
        name: org_name.trim(),
      });
      const orgId = orgResult._id;

      const orgAdminRole = await RoleModel.getByName("org_admin");
      if (!orgAdminRole) {
        return res.status(500).json({ message: "org_admin role not found" });
      }

      const userId = await UserModel.create({
        name: name.trim(),
        email: email.toLowerCase(),
        username: finalUsername,
        password: hashedPassword,
        role_id: orgAdminRole._id,
        organization_id: orgId,
        status: "active", // default active
      });

      return res.status(201).json({
        message: "Organization created successfully. You are now the admin.",
        organization_id: orgId,
        user_id: userId,
      });
    } else if (org_option === "join_existing") {
      // === CASE 2: Request to join existing organization ===

      // assuming org_name is unique Case sensitive (confirm with Surya)
      const org = await OrganizationModel.getByName(org_name.trim());
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const userRole = await RoleModel.getByName("user");
      if (!userRole) {
        return res.status(500).json({ message: "user role not found" });
      }

      const userId = await UserModel.create({
        name: name.trim(),
        email: email.toLowerCase(),
        username: finalUsername,
        password: hashedPassword,
        role_id: userRole._id,
        organization_id: org._id,
        status: "pending_approval", // waits for approval
      });

      return res.status(201).json({
        message:
          "Signup request sent. Waiting for organization admin approval.",
        user_id: userId,
      });
    } else {
      return res.status(400).json({ message: "Invalid organization option" });
    }
  } catch (err) {
    console.error("Org Signup Error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};
