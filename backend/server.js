const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const Stripe = require('stripe');

dotenv.config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const tid = req.cookies['_fprom_tid'] || 'no_tid';
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1Rg1fUKDqWdaksGKHNDsOQTo', // <-- Aquí va tu ID de precio real
          quantity: 1,
        },
      ],
      success_url: 'https://ompulse.com/success',
      cancel_url: 'https://ompulse.com/cancel',
      metadata: {
        fp_tid: tid
      }
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Error al crear sesión:', err);
    res.status(500).json({ error: 'No se pudo crear la sesión' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

