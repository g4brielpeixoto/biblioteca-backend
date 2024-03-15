import { Router } from 'express';
import { BooksController } from './controllers/BooksController';
import { CategoriesController } from './controllers/CategoriesController';

const router = Router();
const booksController = new BooksController();
const categoryController = new CategoriesController();

//Categories
router.get('/category', categoryController.findAll);
router.get('/category/:id', categoryController.findById);
router.post('/category', categoryController.create);
router.put('/category/:id', categoryController.update);
router.delete('/category/:id', categoryController.delete);

//Books
router.get('/book', booksController.findAll);
router.get('/book/:id', booksController.findById);
router.post('/book', booksController.create);
router.put('/book/:id', booksController.update);
router.delete('/book/:id', booksController.delete);
router.post('/book/:id/reserve', booksController.reserve);
router.post('/book/:id/return', booksController.return);

export { router };
