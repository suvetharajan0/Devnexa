import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[devnexa] MongoDB connected: ${mongoose.connection.host}`); 
  } catch (error) {
    console.error('[devnexa] MongoDB connection failed:', error.message);
    // Fail loudly rather than run the API against a dead database.
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[devnexa] MongoDB disconnected');
  });
}
