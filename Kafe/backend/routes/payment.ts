import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe('sk_test_51QbWqUQQSH4dR5LjMGNupdlp4ke7jSr2ZiEC7ESRFCKjpsR6HAyOvsvzF5P0Kiwi7q0BG1itNMJp450YgtWnE7c300s9hEZExs', { apiVersion:  "2024-12-18.acacia" });

router.post('/create-payment-intent', async (req, res) => {
  try {
    var { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in the smallest currency unit (e.g., cents for USD)
      currency: 'inr',
      payment_method_types: ['card'],
      payment_method: 'pm_card_visa', 
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
