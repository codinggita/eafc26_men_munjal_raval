const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/war_economic_impact').then(async () => {
  const User = mongoose.connection.db.collection('users');
  const res = await User.updateOne(
    { email: 'admin@example.com' },
    { $set: { isDeleted: false, isActive: true } }
  );
  console.log('Restored user:', res);
  mongoose.connection.close();
}).catch(console.error);
