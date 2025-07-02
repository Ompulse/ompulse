// server.js
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const cookieParser = require('cookie-parser');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..'))); // Sirve archivos estáticos como index.html, legal.html, etc.

// Ruta de creación de sesión de Stripe Checkout
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const tid = req.cookies['_fprom_tid'] || null;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1Rg1fUKDqWdaksGKHNDsOQTo', // Sustituye por tu precio real
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
  } catch (err) {
    console.error('Error al crear la sesión de Stripe:', err);
    res.status(500).json({ error: 'No se pudo crear la sesión de pago' });
  }
});

// Arranque del servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

