import express from 'express';
import { createReview } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.post('/productID', createReview);

export default reviewRouter;