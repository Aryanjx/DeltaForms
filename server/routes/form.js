import express from 'express';
import { Form } from '../models/Form.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(requireAuth);

/**
 * @route   GET /api/forms
 * @desc    List all saved forms for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error loading saved forms', error: error.message });
  }
});

/**
 * @route   POST /api/forms
 * @desc    Save a newly created dynamic form structure for the authenticated user
 */
router.post('/', async (req, res) => {
  try {
    const { formTitle, fields } = req.body;

    if (!formTitle || !fields || !Array.isArray(fields)) {
      return res.status(400).json({ message: 'Missing formTitle or structural fields array.' });
    }

    const newForm = new Form({
      userId: req.user._id,
      formTitle,
      fields
    });

    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ message: 'Error saving form structure', error: error.message });
  }
});

/**
 * @route   GET /api/forms/:id
 * @desc    Fetch a specific form structure by its unique ID for the authenticated user
 */
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, userId: req.user._id });
    if (!form) {
      return res.status(404).json({ message: 'Form layout not found.' });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving form configuration', error: error.message });
  }
});

/**
 * @route   DELETE /api/forms/:id
 * @desc    Delete a saved form for the authenticated user
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Form.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: 'Could not delete form; not found or not owned by user.' });
    }
    res.status(200).json({ message: 'Form deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting saved form', error: error.message });
  }
});

export default router;