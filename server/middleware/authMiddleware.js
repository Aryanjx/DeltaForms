import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Use centralized verifier to ensure the same secret is used everywhere
    const decoded = verifyToken(token);

    // Find user using decoded.userId
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User account not found.' });
    }

    req.user = user; // Safely populates user profile for the premium gate middleware
    return next();
  } catch (error) {
    console.error('Authentication middleware validation failure:', error);
    return res.status(401).json({ message: 'Request is not authorized' });
  }
};