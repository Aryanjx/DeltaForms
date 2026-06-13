import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import formRoutes from './routes/form.js';
import aiRoutes from './routes/ai.js'; 
import authRoutes from './routes/auth.js';
// 1. Import your brand new payment and subscription router
import paymentRoutes from './routes/payments.js';

// Load environmental variables from the server/.env file regardless of cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Create the Express instance
const app = express();

// Establish connection to MongoDB
connectDB();

// Global Middleware Configuration
// Update your CORS configuration to explicitly allow the Authorization header
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // <-- 🔒 ALLOWS THE AUTH HEADER TO PASS
  credentials: true
}));

// 🚨 CRITICAL STRIPE GATEWAY PLACEMENT: 
// We mount this BEFORE express.json() so that the raw, native request bodies 
// are passed to Stripe's webhook verification engine without parsing distortions.
app.use('/api/payments', paymentRoutes);

// Standard JSON parser middleware for all other incoming routes
app.use(express.json());

// API Routes Integration
app.use('/api/forms', formRoutes);
app.use('/api/ai', aiRoutes); 
app.use('/api/auth', authRoutes);

// Base Diagnostic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', project: 'DeltaForms Engine' });
});

// Port Execution Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DeltaForms Server is humming cleanly on port ${PORT}`);
});