const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const Stripe = require('stripe');

dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const tid = req.cookies['_fprom_tid'];

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1Rg1fUKDqWdaksGKHNDsOQTo', // <-- este es tu precio real
          quantity: 1
        }
      ],
      success_url: 'https://ompulse.com/success.html',
      cancel_url: 'https://ompulse.com/cancel.html',
      metadata: {
        fp_tid: tid || 'no_tid'
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend activo en puerto ${PORT}`);
});
