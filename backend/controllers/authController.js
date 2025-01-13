const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/emailSender');
const bcrypt = require('bcrypt');
const TokenBlacklist = require('../models/TokenBlacklist');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already exists' });
  
      const user = await User.create({ name, email, password });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  
      await sendVerificationEmail(user.email, verificationLink);
  
      res.status(201).json({ message: 'User registered. Please verify your email.' });
    } catch (err) {
      console.error('Registration Error:', err); // Add this line
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  };

  exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      console.log('Login attempt:', { email, password }); // Log incoming request (exclude password in production logs)
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        console.error('User not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Check password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        console.error('Invalid password for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Check if email is verified
      if (!user.isVerified) {
        console.warn('Email not verified:', email);
        return res.status(403).json({ message: 'Email not verified' });
      }
  
      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log('Login successful for:', email);
  
      res.json({ token });
    } catch (err) {
      console.error('Login Error:', err.message);
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  };

exports.logout = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  try {
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Decode the token to extract the expiration time
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Add the token to the blacklist with its expiration time
    const blacklistedToken = new TokenBlacklist({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });
    await blacklistedToken.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error.message);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  console.log("verify email")
  const { token } = req.query;

  try {
    if (!token) {
      console.error('No token provided');
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debug: Log decoded payload

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      console.warn('User already verified:', user.email);
      return res.status(200).json({ message: 'Email already verified' });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    console.log('User verified successfully:', user.email);
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful (token invalidation is handled on the client-side).' });
};