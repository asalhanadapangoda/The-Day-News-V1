import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createUser = async (username, password) => {
  try {
    if (!username || !password) {
      console.error('Usage: node createUser.js <username> <password>');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ username });
    if (existing) {
      console.log('User already exists:', username);
      process.exit(0);
    }

    const user = await User.create({ username, password, role: 'admin' });
    console.log('User created successfully:', user.username);
    console.log('ID:', user._id.toString());
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }
};

const [,, username, password] = process.argv;
createUser(username, password);
