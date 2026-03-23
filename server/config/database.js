import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      logger.error('\n❌ Error: MONGODB_URI is not defined in .env file');
      logger.error('Please add MONGODB_URI to your server/.env file');
      logger.error('Example: MONGODB_URI=mongodb://localhost:27017/thedaynews');
      throw new Error('MONGODB_URI is not defined');
    }

    // Set connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    // Connect with better error handling
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`   Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    return conn;
  } catch (error) {
    logger.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    
    // Provide helpful error messages based on error type
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      logger.error('\n⚠️  Authentication failed. Solutions:');
      logger.error('   1. For LOCAL MongoDB (no auth):');
      logger.error('      MONGODB_URI=mongodb://localhost:27017/thedaynews');
      logger.error('');
      logger.error('   2. For MongoDB Atlas (with auth):');
      logger.error('      MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thedaynews');
      logger.error('      Make sure username and password are correct');
      logger.error('');
      logger.error('   3. Check if MongoDB is running:');
      logger.error('      - Windows: Check Services for MongoDB');
      logger.error('      - Or run: mongod');
    } else if (error.message.includes('ECONNREFUSED')) {
      logger.error('\n⚠️  Cannot connect to MongoDB. Please check:');
      logger.error('   1. MongoDB service is running');
      logger.error('   2. MongoDB is accessible on the specified host/port');
      logger.error('   3. Check your MONGODB_URI in .env file');
    } else if (error.message.includes('ENOTFOUND')) {
      logger.error('\n⚠️  MongoDB host not found. Please check:');
      logger.error('   1. Your MONGODB_URI hostname is correct');
      logger.error('   2. Internet connection (for MongoDB Atlas)');
    } else if (error.message.includes('MONGODB_URI is not defined')) {
      // Don't provide additional error messages for missing URI
    } else {
      logger.error('\n📖 See MONGODB_SETUP.md for detailed setup instructions\n');
    }
    
    // Re-throw error so caller can handle it
    throw error;
  }
};

export default connectDB;

