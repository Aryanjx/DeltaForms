import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Decode matching the EXACT key name from your login route (userId)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_super_secret_key_change_this');
    
    // Find user using decoded.userId
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User account not found.' });
    }

    req.user = user; // Safely populates user profile for the premium gate middleware
    next();
  } catch (error) {
    console.error("Authentication middleware validation failure:", error);
    res.status(401).json({ message: 'Request is not authorized' });
  }
};