import { CategoryRepository } from '../repositories/category.repository';
import { ICategory } from '../models/category.model';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    return await this.categoryRepository.create(categoryData);
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.findById(id);
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findAll();
  }

  async updateCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
    return await this.categoryRepository.update(id, categoryData);
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.delete(id);
  }
}
