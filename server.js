const bodyParser = require('body-parser');
const express = require("express");
const app = express();

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51LLEpPDWBDilbjeOcsh10ERVeRNfBQsUvl8i5qQMXBqV7Rhs0C3t1wbHUvArOtcdbAVbDmz9gX8T1xGwFN1jy0XA00rVccKRl8');

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = async function(priceId) {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return await stripe.prices.retrieve(priceId);
};

app.post("/create-payment-intent", async (req, res) => {
  const { priceId } = req.body;

  let tempvar = await calculateOrderAmount(priceId);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: tempvar.unit_amount,
    currency: tempvar.currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));