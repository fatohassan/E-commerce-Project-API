import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
dotenv.config();
import dbConnect from '../config/dbConnect.js';
import {globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import userRoutes from '../routes/usersRoute.js';
import productRouter from '../routes/productRoute.js';
import categoryRouter from '../routes/categoryRoute.js';
import brandRouter from '../routes/brandRoute.js';
import colorRouter from '../routes/colorRoute.js';
import reviewRouter from '../routes/reviewRoute.js';
import orderRouter from '../routes/orderRoute.js';
import Order from '../model/Order.js';
import couponRouter from '../routes/couponRoute.js';

dbConnect();
const app = express();

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_40ad8bea80f89c7f109e399579bc2b1b83e8a371794283def197bfce7e34781a";

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log("event");
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    // update the order
    const session = event.data.object;
    const {orderId} = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;
    // find the order
    const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
        totalPrice: totalAmount / 100,
        paymentStatus,
        paymentMethod,
        currency,
    }, {
        new: true,
    })
  } else {
    return
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// passing json data
app.use(express.json());

// routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/brand', brandRouter);
app.use('/api/v1/color', colorRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/coupon', couponRouter);


// middleware 
app.use(notFound);
app.use(globalErrHandler);

export default app;