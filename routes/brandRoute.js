import express from 'express';
import { createBrand, getBrands, getBrand, updateBrand, deletedBrand} from '../controllers/brandController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import isAdmin from '../middlewares/isAdmin.js';

const brandRouter = express.Router();

brandRouter.post('/', isLoggedIn, isAdmin, createBrand);
brandRouter.get('/', getBrands);
brandRouter.get('/:id', isLoggedIn, isAdmin, getBrand);
brandRouter.put('/:id', isLoggedIn, isAdmin, updateBrand);
brandRouter.delete('/:id', isLoggedIn, isAdmin, deletedBrand);

export default brandRouter;