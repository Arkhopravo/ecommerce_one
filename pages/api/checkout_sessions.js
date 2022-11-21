const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create
      ({
        line_items: { 
          "0": {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1Ly6YhSGW9yGJv3N9edFL6YV',
          quantity: 1,
        },
       "1": {
        // id:  "plink_1Ly8NNSGW9yGJv3NpCTr8pqM",
          price: 'price_1Ly8LRSGW9yGJv3N5XeX8dE8',
          quantity: 1,
        }},
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}