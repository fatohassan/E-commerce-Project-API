import express from 'express';
import { createCategory, deletedCategory, getCategories, getCategory, updateCategory } from '../controllers/categoryController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import categoryUpload from '../config/categoryUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const categoryRouter = express.Router();

categoryRouter.post('/', 
isLoggedIn, isAdmin,
categoryUpload.single("file"), 
createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.get('/:id', isLoggedIn, isAdmin, getCategory);
categoryRouter.put('/:id', isLoggedIn, isAdmin, updateCategory);
categoryRouter.delete('/:id', isLoggedIn, isAdmin, deletedCategory);

export default categoryRouter;