import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';  // For creating JWT tokens
import { checkAuthenticated, checkNotAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
  const { username, password,email,role } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create a new user
    const user = new User({ username, password,email,role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route (Example: Dashboard) - This route requires authentication
router.get('/dashboard', checkAuthenticated, (req, res) => {
  res.json({ message: 'Welcome to the dashboard', user: req.user });
});

export default router;