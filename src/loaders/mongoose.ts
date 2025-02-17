import mongoose from 'mongoose';
import config from '@/config';

export default async () => {
  try {
    const connection = await mongoose.connect(config.databaseURL);
    console.log('✅ MongoDB connected to:', connection.connection.name);
    return connection.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
