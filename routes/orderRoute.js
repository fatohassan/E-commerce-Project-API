import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createOrder, getAllOrders, getOrderStats, getSingleOrder, updateOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/', isLoggedIn, createOrder);
orderRouter.get('/', isLoggedIn, getAllOrders);
orderRouter.get('/sales/stats', isLoggedIn, getOrderStats);
orderRouter.put('/update/:id', isLoggedIn, updateOrder);
orderRouter.get('/:id', isLoggedIn, getSingleOrder);

export default orderRouter;