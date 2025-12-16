const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const { generateToken } = require("../utils/jwt");
const { ObjectId } = require("mongodb");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const db = await connectDB();

    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

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
