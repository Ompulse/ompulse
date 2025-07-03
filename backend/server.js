// server.js
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

// Configurar CORS para tu frontend
app.use(cors({
  origin: 'https://ompulse.com',
  credentials: true,
}));

// Middleware para parsear JSON en el body
app.use(express.json());

// Ruta de salud (opcional)
app.get('/healthz', (req, res) => {
  res.send('OK');
});

// Ruta para crear sesión de Stripe Checkout
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const tid = req.body.fp_tid || null;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1Rg1fUKDqWdaksGKHNDsOQTo', // Tu precio real
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://ompulse.com/success.html',
      cancel_url: 'https://ompulse.com/cancel.html',
      metadata: {
        fp_tid: tid,
        producto: 'REVISTA Nº1 GLOBAL DE NEGOCIOS DIGITALES',
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error al crear sesión de Stripe:', error.message);
    res.status(500).json({ error: 'Error al procesar el pago. Inténtalo más tarde.' });
  }
});

// Levantar servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
