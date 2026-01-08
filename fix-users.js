const mongoose = require('mongoose');
const User = require('./user');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/rockpaperscissors")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB error:", err);
  process.exit(1);
});

async function fixUsers() {
  try {
    console.log("🔧 Starting user migration...");
    
    // Find all users without email
    const usersWithoutEmail = await User.find({ 
      $or: [
        { email: { $exists: false } },
        { email: null },
        { email: "" }
      ]
    });
    
    console.log(`📊 Found ${usersWithoutEmail.length} users without email`);
    
    if (usersWithoutEmail.length === 0) {
      console.log("✅ All users have emails. No migration needed.");
      process.exit(0);
    }
    
    // Update each user with a default email
    for (const user of usersWithoutEmail) {
      const defaultEmail = `${user.username}@example.com`;
      
      await User.findByIdAndUpdate(user._id, { 
        email: defaultEmail,
        wins: user.wins || 0,
        losses: user.losses || 0,
        draws: user.draws || 0
      });
      
      console.log(`✅ Updated user: ${user.username} with email: ${defaultEmail}`);
    }
    
    console.log("🎉 Migration completed successfully!");
    console.log("⚠️  Note: Users with default emails (username@example.com) should update their email on next login");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

// Run migration
fixUsers();