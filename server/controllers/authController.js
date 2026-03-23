import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import logger from '../utils/logger.js';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Additional validation (express-validator handles most, but this is a fallback)
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Find user - use case-insensitive search for better security
    // Use .select('+password') to include password field (it's excluded by default)
    const user = await User.findOne({ 
      username: username.trim().toLowerCase() 
    }).select('+password');

    // Always return the same error message to prevent username enumeration
    // This makes it harder for attackers to determine if a username exists
    if (!user) {
      // Add a small delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // Add a small delay even on wrong password to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token with user ID
    const token = generateToken(user._id);

    // Return user data and token
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: token,
    });
  } catch (error) {
    // Don't expose internal error details
    logger.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login. Please try again.' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

