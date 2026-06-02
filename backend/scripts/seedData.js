require('dotenv').config();
const mongoose = require('mongoose');
const Conflict = require('../models/Conflict');
const conflictsData = require('../data/conflicts.json');

// ─── Database Seed Script ──────────────────────────────────────────────────────
// Run: npm run seed
// Clears existing conflicts and inserts fresh dataset from conflicts.json

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected for seeding\n');

    // ── Clear existing data ──────────────────────────────────────────────────
    const deletedConflicts = await Conflict.deleteMany({});
    console.log(`🗑️  Cleared ${deletedConflicts.deletedCount} existing conflict(s)\n`);

    // ── Convert date strings to Date objects ───────────────────────────────
    const formattedData = conflictsData.map((item) => ({
      ...item,
      startDate: new Date(item.startDate),
      endDate: item.endDate ? new Date(item.endDate) : null,
    }));

    // ── Insert all conflicts ───────────────────────────────────────────────
    const inserted = await Conflict.insertMany(formattedData);
    console.log(`✅ Successfully seeded ${inserted.length} conflict(s):\n`);

    inserted.forEach((c, i) => {
      console.log(`   ${i + 1}. [${c.conflictId}] ${c.name} — ${c.country} (${c.status})`);
    });

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📌 You can now test your APIs:');
    console.log('   GET  http://localhost:5000/api/v1/conflicts');
    console.log('   GET  http://localhost:5000/api/v1/stats/overview');
    console.log('   GET  http://localhost:5000/api/v1/stats/by-region');
    console.log('   GET  http://localhost:5000/api/v1/stats/by-year\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.\n');
    process.exit(0);
  }
};

seedDatabase();
