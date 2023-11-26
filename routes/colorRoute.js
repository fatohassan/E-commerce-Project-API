import express from 'express';
import { createColor, getColors, getColor, updateColor, deletedColor } from '../controllers/colorController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';

const colorRouter = express.Router();

colorRouter.post('/', isLoggedIn, isAdmin, createColor);
colorRouter.get('/', getColors);
colorRouter.get('/:id', isLoggedIn, isAdmin, getColor);
colorRouter.put('/:id', isLoggedIn, isAdmin, updateColor);
colorRouter.delete('/:id', isLoggedIn, isAdmin, deletedColor);

export default colorRouter;