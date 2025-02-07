import mongoose from 'mongoose';
import { Connection } from 'mongoose'; // Import from mongoose instead of mongodb
import config from '@/config';

export default async (): Promise<Connection> => {
  const connection = await mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return connection.connection; // Return the connection object instead of db
};