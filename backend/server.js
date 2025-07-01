require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const tid = req.cookies['_fprom_tid'] || 'no_tid';
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1Rg1fUKDqWdaksGKHNDsOQTo', // ⚠️ tu precio real
        quantity: 1,
      }],
      metadata: {
        fp_tid: tid,
      },
      success_url: 'https://ompulse.com/success.html',
      cancel_url: 'https://ompulse.com/cancel.html',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creando sesión:', error);
    res.status(500).json({ error: 'Algo salió mal' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
