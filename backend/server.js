const express = require('express');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando con FPROM y Stripe');
});

app.post('/create-checkout-session', async (req, res) => {
  const tid = req.cookies['_fprom_tid'];

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      metadata: {
        fp_tid: tid || 'no_tid'
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Producto de prueba',
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la sesión de pago');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
