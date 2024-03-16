const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.set('debug', true);

async function connectMongoDb(url) {
  try {
    // Connect to MongoDB database with additional options for timeouts.
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 20000, // 10 seconds timeout for server selection
      socketTimeoutMS: 45000, // 45 seconds timeout for socket connections
      // Other options...
    });

    console.log("Connection to MongoDB successful.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports = { connectMongoDb };
