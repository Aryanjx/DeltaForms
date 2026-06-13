import express from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_placeholder_key_until_integrated';
const stripe = new Stripe(stripeKey);
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// Endpoint 1: Initiates a checkout checkout pipeline window session
router.post('/create-checkout-session', requireAuth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'DeltaForms Premium Access Pro',
            description: 'Unlock unlimited AI generations and advanced response telemetry features.',
          },
          unit_amount: 1900, // Amount in cents ($19.00 USD)
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: req.user.email,
      client_reference_id: req.user._id.toString(),
      metadata: {
        userId: req.user._id.toString(),
        plan: 'premium'
      },
      success_url: `${clientUrl}/dashboard?payment=success`,
      cancel_url: `${clientUrl}/dashboard?payment=cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Stripe initiation failure', error: error.message });
  }
});

// Endpoint 2: Direct web-hook handler listening to Stripe signals for automatic unlocking
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Find the original user record via metadata and activate premium features!
    await User.findByIdAndUpdate(session.client_reference_id, { isPremium: true });
    console.log(`Success! Premium privileges unlocked for User: ${session.client_reference_id}`);
  }

  res.json({ received: true });
});

export default router;