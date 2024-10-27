import Category, { ICategory } from '../models/category.model';

export class CategoryRepository {
  async create(categoryData: Partial<ICategory>): Promise<ICategory> {
    return await Category.create(categoryData);
  }

  async findById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async findAll(): Promise<ICategory[]> {
    return await Category.find({ deletedAt: null });
  }

  async update(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, categoryData, { new: true });
  }

  async delete(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }
}
