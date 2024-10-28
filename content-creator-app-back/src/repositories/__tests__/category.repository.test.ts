import mongoose from 'mongoose';
import { CategoryRepository } from '../category.repository';
import Category from '../../models/category.model';

// Mock the Category model
jest.mock('../../models/category.model');

describe('CategoryRepository', () => {
  let categoryRepository: CategoryRepository;
  
  // Mock data
  const mockCategory = {
    _id: new mongoose.Types.ObjectId().toString(),
    type: 'text',
    label: 'Description',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  };

  beforeEach(() => {
    categoryRepository = new CategoryRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      (Category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryRepository.create({
        type: 'text',
        label: 'Description'
      });

      expect(Category.create).toHaveBeenCalledWith({
        type: 'text',
        label: 'Description'
      });
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findById', () => {
    it('should find a category by id', async () => {
      (Category.findById as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryRepository.findById(mockCategory._id);

      expect(Category.findById).toHaveBeenCalledWith(mockCategory._id);
      expect(result).toEqual(mockCategory);
    });

    it('should return null if category not found', async () => {
      (Category.findById as jest.Mock).mockResolvedValue(null);

      const result = await categoryRepository.findById('nonexistent-id');

      expect(Category.findById).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all non-deleted categories', async () => {
      const mockCategories = [mockCategory];
      (Category.find as jest.Mock).mockResolvedValue(mockCategories);

      const result = await categoryRepository.findAll();

      expect(Category.find).toHaveBeenCalledWith({ deletedAt: null });
      expect(result).toEqual(mockCategories);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateData = { label: 'Updated Description' };
      const updatedMockCategory = { ...mockCategory, ...updateData };
      
      (Category.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedMockCategory);

      const result = await categoryRepository.update(mockCategory._id, updateData);

      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCategory._id,
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedMockCategory);
    });
  });

  describe('delete', () => {
    it('should soft delete a category', async () => {
      const deletedAt = new Date();
      const deletedMockCategory = { ...mockCategory, deletedAt };
      
      (Category.findByIdAndUpdate as jest.Mock).mockResolvedValue(deletedMockCategory);

      const result = await categoryRepository.delete(mockCategory._id);

      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCategory._id,
        { deletedAt: expect.any(Date) },
        { new: true }
      );
      expect(result).toEqual(deletedMockCategory);
    });
  });
});
