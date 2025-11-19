import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI;
async function migrateUsers() {
  await mongoose.connect('mongodb+srv://mdbulbulislamtheprogrammer_db_user:KY3s4HsRtOJ4pfua@tools.4fvjrnm.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(m => m);

  const users = await User.find({});

  for (const user of users) {
    if (!user.plan) {
      user.plan = 'free';
      user.tokensImages = 10;
      user.tokensText = 3;
      user.subscriptionStatus = 'inactive';

      const now = new Date();
      user.resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      await user.save();
      console.log(`Migrated user: ${user.email}`);
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

migrateUsers();