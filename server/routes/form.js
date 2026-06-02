import express from 'express';
import Form from '../models/Form.js';
import Submission from '../models/Submission.js';

const router = express.Router();

/**
 * @route   POST /api/forms
 * @desc    Save a newly created dynamic form structure
 */
router.post('/', async (req, res) => {
  try {
    const { formTitle, fields } = req.body;

    // Quick structural validation
    if (!formTitle || !fields || !Array.isArray(fields)) {
      return res.status(400).json({ message: 'Missing formTitle or structural fields array.' });
    }

    const newForm = new Form({
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
 * @desc    Fetch a specific form structure by its unique ID
 */
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.id || req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form layout not found.' });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving form configuration', error: error.message });
  }
});

/**
 * @route   POST /api/forms/:id/submissions
 * @desc    Submit filled-out user data responses for a specific form
 */
router.post('/:id/submissions', async (req, res) => {
  try {
    const { responses } = req.body;
    const formId = req.params.id;

    // Verify the host form actually exists first
    const formExists = await Form.exists({ _index: formId, _id: formId });
    if (!formExists) {
      return res.status(404).json({ message: 'Cannot submit; parent form not found.' });
    }

    const newSubmission = new Submission({
      formId,
      responses
    });

    const savedSubmission = await newSubmission.save();
    res.status(201).json({ message: 'Submission logged successfully!', data: savedSubmission });
  } catch (error) {
    res.status(500).json({ message: 'Error writing submission records', error: error.message });
  }
});

export default router;