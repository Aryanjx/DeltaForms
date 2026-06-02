import mongoose from 'mongoose';

// Schema tracking the dynamic form blueprint structures created by the AI
const FormSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formTitle: { type: String, required: true },
  fields: [
    {
      id: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, enum: ['text', 'number', 'email', 'select', 'textarea', 'checkbox'], required: true },
      placeholder: { type: String },
      options: [String],
      required: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// Schema tracking live submissions submitted by external visitors
const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: { type: Map, of: mongoose.Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, default: Date.now }
});

export const Form = mongoose.model('Form', FormSchema);
export const FormResponse = mongoose.model('FormResponse', ResponseSchema);