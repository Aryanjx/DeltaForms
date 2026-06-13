import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { signToken } from '../utils/jwt.js';

const router = express.Router();

// 📝 REGISTRATION ENDPOINT
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username or Email already registered.' });
    }

    // Create and save new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate token
    const token = signToken({ userId: newUser._id }, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email, isPremium: newUser.isPremium }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// 🔒 PROFILE ENPOINT
router.get('/me', requireAuth, (req, res) => {
  const user = req.user.toObject();
  delete user.password;
  res.status(200).json({ user });
});

// 🔑 LOGIN ENDPOINT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Verify password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate token
    const token = signToken({ userId: user._id }, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, isPremium: user.isPremium }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

export default router;