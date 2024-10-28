import { CategoryService } from '../category.service';
import { CategoryRepository } from '../../repositories/category.repository';
import { ICategory } from '../../models/category.model';

// Mock the CategoryRepository
jest.mock('../../repositories/category.repository');

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  // Mock data
  const mockCategory: ICategory = {
    _id: '123',
    type: 'test-type',
    label: 'Test Label',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
  } as ICategory;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of the service
    categoryService = new CategoryService();
    categoryRepository = new CategoryRepository() as jest.Mocked<CategoryRepository>;
    (CategoryRepository as jest.Mock).mockImplementation(() => categoryRepository);
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      categoryRepository.create.mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory({
        type: 'test-type',
        label: 'Test Label'
      });

      expect(result).toEqual(mockCategory);
      expect(categoryRepository.create).toHaveBeenCalledWith({
        type: 'test-type',
        label: 'Test Label'
      });
      expect(categoryRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      categoryRepository.findById.mockResolvedValue(mockCategory);

      const result = await categoryService.getCategoryById('123');

      expect(result).toEqual(mockCategory);
      expect(categoryRepository.findById).toHaveBeenCalledWith('123');
      expect(categoryRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null when category is not found', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      const result = await categoryService.getCategoryById('nonexistent');

      expect(result).toBeNull();
      expect(categoryRepository.findById).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [mockCategory];
      categoryRepository.findAll.mockResolvedValue(mockCategories);

      const result = await categoryService.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updateData = { label: 'Updated Label' };
      const updatedCategory = { ...mockCategory, ...updateData };
      categoryRepository.update.mockResolvedValue(updatedCategory as ICategory);

      const result = await categoryService.updateCategory('123', updateData);

      expect(result).toEqual(updatedCategory);
      expect(categoryRepository.update).toHaveBeenCalledWith('123', updateData);
      expect(categoryRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should return null when updating non-existent category', async () => {
      categoryRepository.update.mockResolvedValue(null);

      const result = await categoryService.updateCategory('nonexistent', { label: 'Updated Label' });

      expect(result).toBeNull();
      expect(categoryRepository.update).toHaveBeenCalledWith('nonexistent', { label: 'Updated Label' });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      categoryRepository.delete.mockResolvedValue(mockCategory);

      const result = await categoryService.deleteCategory('123');

      expect(result).toEqual(mockCategory);
      expect(categoryRepository.delete).toHaveBeenCalledWith('123');
      expect(categoryRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should return null when deleting non-existent category', async () => {
      categoryRepository.delete.mockResolvedValue(null);

      const result = await categoryService.deleteCategory('nonexistent');

      expect(result).toBeNull();
      expect(categoryRepository.delete).toHaveBeenCalledWith('nonexistent');
    });
  });
});
