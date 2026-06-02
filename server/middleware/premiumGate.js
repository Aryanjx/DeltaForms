import { Form } from '../models/Form.js';

export const checkPremiumLimits = async (req, res, next) => {
  try {
    // If user has already purchased premium, bypass limits completely
    if (req.user && req.user.isPremium) {
      return next();
    }

    // Count how many forms this free user has generated so far
    const formCount = await Form.countDocuments({ userId: req.user._id });

    // Enforce a strict free limit tier (e.g., maximum of 3 forms allowed)
    if (formCount >= 3) {
      return res.status(403).json({ 
        message: 'Free tier limit reached (3 Forms). Please upgrade to Premium to create infinite forms!',
        limitReached: true
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Error checking subscription allowances.' });
  }
};