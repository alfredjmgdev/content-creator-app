import mongoose from 'mongoose';
import { ThemeRepository } from '../theme.repository';
import Theme from '../../models/theme.model';

// Mock the Theme model
jest.mock('../../models/theme.model');

describe('ThemeRepository', () => {
  let repository: ThemeRepository;
  
  // Mock data
  const mockTheme = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Theme',
    description: 'Test Description',
    categoriesIds: [
      new mongoose.Types.ObjectId().toString(),
      new mongoose.Types.ObjectId().toString()   
    ],
    coverImage: 'test-image.jpg',
    createdAt: new Date(),
    updatedAt: undefined,
    deletedAt: undefined
  };

  const mockPopulatedTheme = {
    ...mockTheme,
    categoriesIds: [
      { _id: mockTheme.categoriesIds[0], type: 'test', label: 'Test Category 1' },
      { _id: mockTheme.categoriesIds[1], type: 'test', label: 'Test Category 2' }
    ]
  };

  beforeEach(() => {
    repository = new ThemeRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new theme', async () => {
      (Theme.create as jest.Mock).mockResolvedValue(mockTheme);

      const result = await repository.create(mockTheme);

      expect(Theme.create).toHaveBeenCalledWith(mockTheme);
      expect(result).toEqual(mockTheme);
    });
  });

  describe('findById', () => {
    it('should find and return a theme by id with populated categories', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(mockPopulatedTheme);
      (Theme.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const result = await repository.findById(mockTheme._id.toString());

      expect(Theme.findById).toHaveBeenCalledWith(mockTheme._id.toString());
      expect(mockPopulate).toHaveBeenCalledWith('categoriesIds', 'type label _id');
      expect(result).toEqual(mockPopulatedTheme);
    });
  });

  describe('findAll', () => {
    it('should find all non-deleted themes with populated categories', async () => {
      const mockPopulate = jest.fn().mockResolvedValue([mockPopulatedTheme]);
      (Theme.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const result = await repository.findAll();

      expect(Theme.find).toHaveBeenCalledWith({ deletedAt: null });
      expect(mockPopulate).toHaveBeenCalledWith('categoriesIds', 'type label _id');
      expect(result).toEqual([mockPopulatedTheme]);
    });
  });

  describe('update', () => {
    it('should update and return the theme', async () => {
      const updateData = { name: 'Updated Theme' };
      const updatedTheme = { ...mockTheme, ...updateData };
      
      (Theme.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTheme);

      const result = await repository.update(mockTheme._id.toString(), updateData);

      expect(Theme.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTheme._id.toString(),
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedTheme);
    });
  });

  describe('delete', () => {
    it('should soft delete a theme by setting deletedAt', async () => {
      const deletedTheme = { ...mockTheme, deletedAt: new Date() };
      
      (Theme.findByIdAndUpdate as jest.Mock).mockResolvedValue(deletedTheme);

      const result = await repository.delete(mockTheme._id.toString());

      expect(Theme.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTheme._id.toString(),
        { deletedAt: expect.any(Date) },
        { new: true }
      );
      expect(result).toEqual(deletedTheme);
    });
  });
});
