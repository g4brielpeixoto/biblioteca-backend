import { Request, Response } from 'express';
import { prisma } from '../database';
import { BookValidator } from '../validators/BookValidator';

export class BooksController {
  async findAll(req: Request, res: Response) {
    try {
      let where = {};
      const title = req.query.title as string;
      const author = req.query.author as string;
      const description = req.query.description as string;
      const publicationYear = req.query.publicationYear as string;
      let category = req.query.category as string;

      if (title) where = { ...where, title: { contains: title } };
      if (author) where = { ...where, author: { contains: author } };
      if (description) where = { ...where, description: { contains: description } };
      if (publicationYear) where = { ...where, publicationYear: { equals: parseInt(publicationYear) } };
      if (category) {
        const categoryQuery = isNaN(parseInt(category)) ? { name: { contains: category } } : { id: parseInt(category) };
        where = { ...where, category: categoryQuery };
      }

      const books = await prisma.books.findMany({ where, include: { category: true } });
      if (books.length === 0) return res.status(204).json(books);
      return res.json(books);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await prisma.books.findUnique({
        where: {
          id: Number(id)
        },
        include: { category: true }
      });
      if (!book) return res.status(404).json({ message: 'Book not found' });
      return res.json(book);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const bookData = BookValidator.validateSync(req.body);
      const book = await prisma.books.create({
        data: { ...bookData, availableCopies: bookData.copies }
      });
      return res.status(201).json(book);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bookExists = await prisma.books.findUnique({
        where: {
          id: Number(id)
        }
      });
      if (!bookExists) return res.status(404).json({ message: 'Book not found' });

      const bookData = BookValidator.validateSync(req.body);
      const book = await prisma.books.update({
        where: {
          id: Number(id)
        },
        data: { ...bookData, availableCopies: bookData.copies },
        include: { category: true }
      });
      return res.json(book);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await prisma.books.findUnique({
        where: {
          id: Number(id)
        }
      });
      if (!book) return res.status(404).json({ message: 'Book not found' });

      await prisma.books.delete({
        where: {
          id: Number(id)
        }
      });
      return res.json({ message: 'Book deleted' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async reserve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await prisma.books.findUnique({
        where: {
          id: Number(id)
        }
      });
      if (!book) return res.status(404).json({ message: 'Book not found' });
      if (book.availableCopies === 0) return res.status(400).json({ message: 'No available copies' });

      const bookUpdated = await prisma.books.update({
        where: {
          id: Number(id)
        },
        data: {
          availableCopies: {
            decrement: 1
          }
        },
        include: { category: true }
      });
      return res.json(bookUpdated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async return(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await prisma.books.findUnique({
        where: {
          id: Number(id)
        }
      });
      if (!book) return res.status(404).json({ message: 'Book not found' });
      if (book.availableCopies === book.copies) return res.status(400).json({ message: 'All copies are available' });

      const bookUpdated = await prisma.books.update({
        where: {
          id: Number(id)
        },
        data: {
          availableCopies: {
            increment: 1
          }
        },
        include: { category: true }
      });
      return res.json(bookUpdated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
