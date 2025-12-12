const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing from env');
  await mongoose.connect(uri);
//   console.log("Connected to MongoDB master DB");

  console.log('Connected to MongoDB master DB');
}


function getNativeDb() {
  return mongoose.connection.db;
}

module.exports = { connectDB, getNativeDb, mongoose };
