require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Servir archivos estáticos si tienes frontend en el mismo proyecto (opcional)
app.use(express.static(path.join(__dirname, '..')));

// Ruta para crear una sesión de Stripe Checkout
app.post('/api/create-checkout-session', async (req, res) => {
  const tid = req.cookies['_fprom_tid'] || 'no_tid'; // Obtener TID de cookie

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // Usa 'payment' si es pago único
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1Rg1fUKDqWdaksGKHNDsOQTo', // Reemplaza con tu precio real
          quantity: 1,
        },
      ],
      metadata: {
        fp_tid: tid, // Enviar TID a FirstPromoter
      },
      success_url: 'https://ompulse.com/success.html',
      cancel_url: 'https://ompulse.com/cancel.html',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creando sesión de Stripe:', error);
    res.status(500).json({ error: 'Algo salió mal al crear la sesión de pago.' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

