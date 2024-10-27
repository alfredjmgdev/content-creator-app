import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error creating category' });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching category' });
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching categories' });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryService.updateCategory(req.params.id, req.body);
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating category' });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryService.deleteCategory(req.params.id);
      if (category) {
        res.json({ message: 'Category deleted successfully' });
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting category' });
    }
  }
}
