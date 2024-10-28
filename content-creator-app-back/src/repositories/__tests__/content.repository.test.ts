import mongoose from 'mongoose';
import { ContentRepository } from '../content.repository';
import Content, { IContent } from '../../models/content.model';

// Mock the Content model
jest.mock('../../models/content.model');

describe('ContentRepository', () => {
  let repository: ContentRepository;
  
  // Mock data with correct types
  const mockContent = {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Test Content',
    themesIds: [
      new mongoose.Types.ObjectId().toString(),
      new mongoose.Types.ObjectId().toString()
    ],
    values: [{
      categoryId: new mongoose.Types.ObjectId().toString(),
      value: 'Test Value'
    }],
    userId: new mongoose.Types.ObjectId().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined
  };

  const mockPopulatedContent = {
    ...mockContent,
    userId: {
      username: 'testuser',
      email: 'test@example.com'
    },
    themesIds: [{
      name: 'Theme 1',
      description: 'Description 1',
      coverImage: 'image1.jpg'
    }],
    values: [{
      categoryId: {
        type: 'text',
        label: 'Test Category',
        _id: mockContent.values![0].categoryId
      },
      value: 'Test Value'
    }]
  };

  beforeEach(() => {
    repository = new ContentRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new content', async () => {
      (Content.create as jest.Mock).mockResolvedValue(mockContent);

      const result = await repository.create(mockContent);

      expect(Content.create).toHaveBeenCalledWith(mockContent);
      expect(result).toEqual(mockContent);
    });
  });

  describe('findById', () => {
    it('should find and populate content by id', async () => {
      const mockPopulateChain = {
        populate: jest.fn().mockReturnThis(),
      };
      
      mockPopulateChain.populate
        .mockReturnValueOnce(mockPopulateChain)
        .mockReturnValueOnce(mockPopulateChain)
        .mockReturnValueOnce(Promise.resolve(mockPopulatedContent));

      (Content.findById as jest.Mock).mockReturnValue(mockPopulateChain);

      const result = await repository.findById(mockContent._id!);

      expect(Content.findById).toHaveBeenCalledWith(mockContent._id);
      expect(mockPopulateChain.populate).toHaveBeenCalledWith('userId', 'username email');
      expect(mockPopulateChain.populate).toHaveBeenCalledWith('themesIds', 'name description coverImage');
      expect(mockPopulateChain.populate).toHaveBeenCalledWith({
        path: 'values.categoryId',
        select: 'type label _id'
      });
      expect(result).toEqual(mockPopulatedContent);
    });
  });

  describe('findAll', () => {
    it('should find all non-deleted contents with populated fields', async () => {
      const mockPopulateChain = {
        populate: jest.fn().mockReturnThis(),
      };
      
      mockPopulateChain.populate
        .mockReturnValueOnce(mockPopulateChain)
        .mockReturnValueOnce(mockPopulateChain)
        .mockReturnValueOnce(Promise.resolve([mockPopulatedContent]));

      (Content.find as jest.Mock).mockReturnValue(mockPopulateChain);

      const result = await repository.findAll();

      expect(Content.find).toHaveBeenCalledWith({ deletedAt: null });
      expect(mockPopulateChain.populate).toHaveBeenCalledWith('userId', 'username email');
      expect(mockPopulateChain.populate).toHaveBeenCalledWith('themesIds', 'name description coverImage');
      expect(mockPopulateChain.populate).toHaveBeenCalledWith({
        path: 'values.categoryId',
        select: 'type label _id'
      });
      expect(result).toEqual([mockPopulatedContent]);
    });
  });

  describe('update', () => {
    it('should update content by id', async () => {
      const updateData: Partial<IContent> = { title: 'Updated Title' };
      (Content.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockContent,
        ...updateData,
      });

      const result = await repository.update(mockContent._id!, updateData);

      expect(Content.findByIdAndUpdate).toHaveBeenCalledWith(
        mockContent._id,
        updateData,
        { new: true }
      );
      expect(result?.title).toBe(updateData.title);
    });
  });

  describe('delete', () => {
    it('should soft delete content by id', async () => {
      const deletedAt = new Date();
      const testId = new mongoose.Types.ObjectId().toString();  // Create explicit test ID
      jest.spyOn(global, 'Date').mockImplementation(() => deletedAt as any);

      (Content.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockContent,
        _id: testId,
        deletedAt,
      });

      const result = await repository.delete(testId);

      expect(Content.findByIdAndUpdate).toHaveBeenCalledWith(
        testId,
        { deletedAt },
        { new: true }
      );
      expect(result?.deletedAt).toBe(deletedAt);
    });
  });
});
