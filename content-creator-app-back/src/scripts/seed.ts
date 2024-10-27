import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database';
import User from '../models/user.model';
import Theme from '../models/theme.model';
import Category from '../models/category.model';
import Content from '../models/content.model';
import bcrypt from 'bcrypt';

// Import JSON data
import usersData from '../data/mockUsers.json';
import themesData from '../data/contentThemes.json';
import categoriesData from '../data/contentCategories.json';
import contentsData from '../data/sampleContent.json';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Theme.deleteMany({});
    await Category.deleteMany({});
    await Content.deleteMany({});

    // Seed users
    const users = await Promise.all(usersData.map(async (userData) => {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      return User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date(userData.createdAt),
        type: userData.type
      });
    }));

    // Seed categories
    const categories = await Promise.all(categoriesData.map(categoryData =>
      Category.create({
        type: categoryData.type,
        label: categoryData.label
      })
    ));

    // Seed themes
    const themes = await Promise.all(themesData.map(themeData =>
      Theme.create({
        name: themeData.name,
        description: themeData.description,
        categoriesIds: themeData.categoriesIds.map(id => categories[parseInt(id) - 1]._id),
        coverImage: themeData.coverImage
      })
    ));

    // Seed content
    await Promise.all(contentsData.map(contentData =>
      Content.create({
        title: contentData.title,
        themesIds: contentData.themesIds.map(id => themes[parseInt(id) - 1]._id),
        values: contentData.values.map(value => ({
          categoryId: categories[parseInt(value.categoryId) - 1]._id,
          value: value.value
        })),
        userId: users[parseInt(contentData.userId) - 1]._id,
        createdAt: new Date(contentData.createdAt)
      })
    ));

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
