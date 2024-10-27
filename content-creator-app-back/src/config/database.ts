import mongoose from 'mongoose';
import { IContent } from '../models/content.model';
import { ITheme } from '../models/theme.model';
import { IUser } from '../models/user.model';
import { ICategory } from '../models/category.model';

const connectDB = async (): Promise<void> => {
  try {
    const dbName = 'your_database_name'; // Replace with your desired database name
    await mongoose.connect(process.env.MONGODB_URI || `mongodb://crs_user:123456@localhost:27017/`, {dbName: 'content-creator-app'});
    console.log(`MongoDB connected to database: ${dbName}`);

    // Initialize collections
    await initializeCollections();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const initializeCollections = async (): Promise<void> => {
  const collections = [
    { name: 'contents', model: mongoose.model<IContent>('Content') },
    { name: 'themes', model: mongoose.model<ITheme>('Theme') },
    { name: 'users', model: mongoose.model<IUser>('User') },
    { name: 'categories', model: mongoose.model<ICategory>('Category') },
  ];

  const db = mongoose.connection.db;
  if (!db) {
    console.error('Database connection not established');
    return;
  }

  for (const collection of collections) {
    try {
      await db.createCollection(collection.name);
      console.log(`Collection '${collection.name}' created.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 48) {
          // Error code 48 means the collection already exists
          console.log(`Collection '${collection.name}' already exists.`);
        } else {
          console.error(`Error creating collection '${collection.name}':`, error.message);
        }
      } else {
        console.error(`Unknown error creating collection '${collection.name}':`, error);
      }
    }
  }
};

export default connectDB;
