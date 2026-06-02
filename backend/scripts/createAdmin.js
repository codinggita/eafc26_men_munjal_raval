require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// ─── Create Admin Script ───────────────────────────────────────────────────────
// Run: node scripts/createAdmin.js
// Creates the first admin user — run ONCE during project setup

const createAdmin = async () => {
  try {
    console.log('👤 Creating admin user...\n');

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected\n');

    // ── Admin credentials (change before using in production) ─────────────
    const adminData = {
      name:     'Super Admin',
      email:    'admin@conflictlens.com',
      password: 'Admin@123456',        // will be hashed by pre-save hook
      role:     'admin',
    };

    // Check if admin already exists
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${existing.email} (role: ${existing.role})`);
      console.log('   No changes made.\n');
      return;
    }

    // Create admin user
    const admin = await User.create(adminData);

    console.log('✅ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Name    : ${admin.name}`);
    console.log(`  Email   : ${admin.email}`);
    console.log(`  Role    : ${admin.role}`);
    console.log(`  ID      : ${admin._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');
    console.log('📌 Login at: POST /api/v1/auth/login');
    console.log(`   Email   : ${adminData.email}`);
    console.log('   Password: Admin@123456\n');

  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.\n');
    process.exit(0);
  }
};

createAdmin();
