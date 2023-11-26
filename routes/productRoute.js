import express from 'express';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/productController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const productRouter = express.Router();

productRouter.post('/', isLoggedIn, isAdmin, 
upload.single("file"), 
createProduct);
productRouter.get('/', isLoggedIn, isAdmin, getProducts);
productRouter.get('/:id', getProduct);
productRouter.put('/:id', isLoggedIn, isAdmin, updateProduct);
productRouter.delete('/:id', isLoggedIn, isAdmin, deleteProduct);

export default productRouter;