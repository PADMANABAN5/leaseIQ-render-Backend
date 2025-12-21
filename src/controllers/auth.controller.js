const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const { generateToken } = require("../utils/jwt");
const { ObjectId } = require("mongodb");

exports.login = async (req, res) => {
  try {
    const { email, username,password } = req.body;

    if ((!email && !username) || !password)
      return res.status(400).json({ message: "Email or username and password required" });

    const db = await connectDB();
    let user;

    if (email) {
      user = await db.collection("users").findOne({
        email: email.toLowerCase(),
      });
    } else {
      user = await db.collection("users").findOne({
        username: username.toLowerCase(),
      });
    }
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const role = await db
      .collection("roles")
      .findOne({ _id: new ObjectId(user.role_id) });

    const token = generateToken({
      user_id: user._id,
      role: role.role_name,
      organization_id: user.organization_id,
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role.role_name,
        organization_id: user.organization_id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.signup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({ message: "Email or username and password required" });
    }

    if (email) {
      const existingEmail = await getDB()
        .collection("users")
        .findOne({ email: email.toLowerCase() });

      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    let finalUsername;
    if (username && username.trim()) {
      const normalizedUsername = username.toLowerCase();
      const existingUser = await getDB()
        .collection("users")
        .findOne({ username: normalizedUsername });

      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      finalUsername = normalizedUsername;
    } else {
      finalUsername = await require("../models/user.model").generateUsername();
    }

    const role = await getDB()
      .collection("roles")
      .findOne({ role_name: "individual" });

    if (!role) {
      return res.status(500).json({ error: "Individual role not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await getDB().collection("users").insertOne({
      name,
      email: email ? email.toLowerCase() : null,
      username: finalUsername,
      password: hashedPassword,
      role_id: role._id,
      organization_id: null,
      is_active: true,
      created_at: new Date(),
    });

    return res.status(201).json({
      message: "Signup successful",
      user_id: result.insertedId,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
};

