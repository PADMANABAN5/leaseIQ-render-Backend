require("dotenv").config();

const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URI || !DB_NAME) {
  console.error("❌ Missing MONGO_URI or DB_NAME in .env file");
  process.exit(1);
}

async function initUsers() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);

    // Fetch roles
    const roles = await db.collection("roles").find().toArray();
    if (!roles.length) throw new Error("Roles not found");

    const roleMap = {};
    roles.forEach((role) => {
      roleMap[role.role_name] = role._id;
    });

    // Fetch organization
    const organization = await db
      .collection("organizations")
      .findOne({ code: "LEASEIQ-DEMO" });

    if (!organization) throw new Error("Organization not found");

    const users = [
      {
        name: "Super Admin",
        email: "superadmin@leaseiq.com",
        password: "Super@2025",
        role_id: roleMap.super_admin,
        organization_id: null,
      },
      {
        name: "Org Admin",
        email: "orgadmin@leaseiq.com",
        password: "Org@2025",
        role_id: roleMap.org_admin,
        organization_id: organization._id,
      },
      {
        name: "Normal User",
        email: "user@leaseiq.com",
        password: "User@2025",
        role_id: roleMap.user,
        organization_id: organization._id,
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 12);

      await db.collection("users").updateOne(
        { email: user.email },
        {
          $setOnInsert: {
            name: user.name,
            email: user.email,
            password: hashedPassword,
            role_id: user.role_id,
            organization_id: user.organization_id,
            is_active: true,
            created_at: new Date(),
          },
        },
        { upsert: true }
      );
    }

    console.log("✅ Dummy users created successfully");
  } catch (err) {
    console.error("❌ Init failed:", err.message);
  } finally {
    await client.close();
  }
}

initUsers();
