import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  // Captures whatever form inputs were sent, e.g., { "user_email": "test@me.com", "age": 25 }
  responses: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', SubmissionSchema);