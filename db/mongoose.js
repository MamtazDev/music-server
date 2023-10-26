require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', true); // Suppress the deprecation warning

const MAX_RETRIES = 5;
let retries = 0;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

module.exports = connectDB;
