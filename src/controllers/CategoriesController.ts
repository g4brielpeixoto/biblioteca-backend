import { Request, Response } from 'express';
import { prisma } from '../database';
import { CategoryValidator } from '../validators/CategoryValidator';

export class CategoriesController {
  async findAll(req: Request, res: Response) {
    const categories = await prisma.categories.findMany();
    return res.json(categories);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const category = await prisma.categories.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.json(category);
  }

  async create(req: Request, res: Response) {
    try {
      const categoryData = CategoryValidator.validateSync(req.body);

      const categoryExists = await prisma.categories.findFirst({
        where: {
          name: categoryData.name
        }
      });

      if (categoryExists) {
        return res.status(400).json({ message: 'Category already exists' });
      }

      const category = await prisma.categories.create({
        data: categoryData
      });
      return res.status(201).json(category);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoryExists = await prisma.categories.findUnique({
        where: {
          id: Number(id)
        }
      });
      if (!categoryExists) return res.status(404).json({ message: 'Category not found' });
      const categoryData = CategoryValidator.validateSync(req.body);
      const category = await prisma.categories.update({
        where: {
          id: Number(id)
        },
        data: categoryData
      });
      return res.json(category);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.categories.delete({
      where: {
        id: Number(id)
      }
    });
    return res.json({ message: `Category ${id} deleted` });
  }
}
