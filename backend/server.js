// server.js
const express = require('express');
const app = express();
const stripe = require('stripe')('TU_SECRET_KEY_DE_STRIPE'); // Reemplaza esto
const path = require('path');

// Middleware
app.use(express.static('public')); // Carpeta donde tienes index.html
app.use(express.json());

// Rutas
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Acceso a OMPULSE',
              description: 'Curso de monetización avanzada',
            },
            unit_amount: 129000, // Precio en centavos: $1290.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://tu-dominio.com/gracias.html', // Cambia esto
      cancel_url: 'https://tu-dominio.com/',               // Cambia esto también
    });

    // ✅ CORRECTO: Devolver la URL de redirección
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la sesión de pago' });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
