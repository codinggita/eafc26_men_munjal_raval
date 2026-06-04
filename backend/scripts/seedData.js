require('dotenv').config();
const mongoose = require('mongoose');
const Conflict = require('../models/Conflict');
const dataset = require('../data/war_economic_impact_dataset.json');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding from war_economic_impact_dataset.json...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding\n');

    // Drop the collection to remove old indexes
    try {
      await Conflict.collection.drop();
      console.log('🗑️  Dropped existing conflicts collection\n');
    } catch (e) {
      if (e.code === 26 || e.message.includes('ns not found')) {
        console.log('ℹ️  Conflicts collection does not exist, skipping drop\n');
      } else {
        console.log('⚠️  Could not drop collection: ', e.message);
        const deletedConflicts = await Conflict.deleteMany({});
        console.log(`🗑️  Cleared ${deletedConflicts.deletedCount} existing conflict(s)\n`);
      }
    }

    // Parse and map fields
    const formattedData = dataset.map((item) => ({
      Conflict_Name: item.Conflict_Name,
      Conflict_Type: item.Conflict_Type,
      Region: item.Region,
      Start_Year: item.Start_Year,
      End_Year: item.End_Year,
      Status: item.Status,
      Primary_Country: item.Primary_Country,
      'Pre_War_Unemployment_%': parseFloat(item['Pre_War_Unemployment_%']) || 0,
      'During_War_Unemployment_%': parseFloat(item['During_War_Unemployment_%']) || 0,
      Unemployment_Spike_Percentage_Points: parseFloat(item.Unemployment_Spike_Percentage_Points) || 0,
      Most_Affected_Sector: item.Most_Affected_Sector,
      'Youth_Unemployment_Change_%': parseFloat(item['Youth_Unemployment_Change_%']) || 0,
      'Pre_War_Poverty_Rate_%': parseFloat(item['Pre_War_Poverty_Rate_%']) || 0,
      'During_War_Poverty_Rate_%': parseFloat(item['During_War_Poverty_Rate_%']) || 0,
      'Extreme_Poverty_Rate_%': parseFloat(item['Extreme_Poverty_Rate_%']) || 0,
      'Food_Insecurity_Rate_%': parseFloat(item['Food_Insecurity_Rate_%']) || 0,
      Households_Fallen_Into_Poverty_Estimate: parseInt(item.Households_Fallen_Into_Poverty_Estimate) || 0,
      'GDP_Change_%': parseFloat(item['GDP_Change_%']) || 0,
      'Inflation_Rate_%': parseFloat(item['Inflation_Rate_%']) || 0,
      'Currency_Devaluation_%': parseFloat(item['Currency_Devaluation_%']) || 0,
      Cost_of_War_USD: parseFloat(item.Cost_of_War_USD) || 0,
      Estimated_Reconstruction_Cost_USD: parseFloat(item.Estimated_Reconstruction_Cost_USD) || 0,
      'Informal_Economy_Size_Pre_War_%': parseFloat(item['Informal_Economy_Size_Pre_War_%']) || 0,
      'Informal_Economy_Size_During_War_%': parseFloat(item['Informal_Economy_Size_During_War_%']) || 0,
      Black_Market_Activity_Level: item.Black_Market_Activity_Level || 'N/A',
      Primary_Black_Market_Goods: item.Primary_Black_Market_Goods,
      'Currency_Black_Market_Rate_Gap_%': parseFloat(item['Currency_Black_Market_Rate_Gap_%']) || 0,
      War_Profiteering_Documented: item.War_Profiteering_Documented || 'No',
    }));

    // Insert all conflicts
    const inserted = await Conflict.insertMany(formattedData);
    console.log(`✅ Successfully seeded ${inserted.length} conflict(s):\n`);

    inserted.slice(0, 15).forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.Conflict_Name} — ${c.Primary_Country} (${c.Status})`);
    });

    if (inserted.length > 15) {
      console.log(`   ... and ${inserted.length - 15} more records.`);
    }

    console.log('\n🎉 Database seeding completed successfully!\n');
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

