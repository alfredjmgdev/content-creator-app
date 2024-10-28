import { ContentService } from '../content.service';
import { ContentRepository } from '../../repositories/content.repository';
import { IContent } from '../../models/content.model';

// Mock the ContentRepository
jest.mock('../../repositories/content.repository', () => {
  return {
    ContentRepository: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }))
  };
});

describe('ContentService', () => {
  let contentService: ContentService;
  let mockContentRepository: jest.Mocked<ContentRepository>;

  // Mock data
  const mockContent: IContent = {
    _id: '507f1f77bcf86cd799439011' as string,
    title: 'Test Content',
    themesIds: ['607f1f77bcf86cd799439012'],
    values: [
      {
        categoryId: '707f1f77bcf86cd799439013',
        value: 'Test Value'
      }
    ],
    userId: '807f1f77bcf86cd799439014',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02')
  } as IContent;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Initialize the service
    contentService = new ContentService();
    // Get the mocked instance
    mockContentRepository = (ContentRepository as jest.Mock).mock.results[0].value;
  });

  describe('createContent', () => {
    it('should create a new content', async () => {
      mockContentRepository.create.mockResolvedValue(mockContent);

      const result = await contentService.createContent(mockContent);

      expect(result).toEqual(mockContent);
      expect(mockContentRepository.create).toHaveBeenCalledWith(mockContent);
      expect(mockContentRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getContentById', () => {
    it('should return content by id', async () => {
      mockContentRepository.findById.mockResolvedValue(mockContent);

      const result = await contentService.getContentById(mockContent._id as string);

      expect(result).toEqual(mockContent);
      expect(mockContentRepository.findById).toHaveBeenCalledWith(mockContent._id);
      expect(mockContentRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null if content not found', async () => {
      mockContentRepository.findById.mockResolvedValue(null);

      const result = await contentService.getContentById('nonexistent-id' as string);

      expect(result).toBeNull();
      expect(mockContentRepository.findById).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('getAllContents', () => {
    it('should return all contents', async () => {
      const mockContents = [mockContent];
      mockContentRepository.findAll.mockResolvedValue(mockContents);

      const result = await contentService.getAllContents();

      expect(result).toEqual(mockContents);
      expect(mockContentRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateContent', () => {
    it('should update content', async () => {
      const updateData = { title: 'Updated Title' };
      const updatedContent = { ...mockContent, ...updateData };
      mockContentRepository.update.mockResolvedValue(updatedContent as IContent);

      const result = await contentService.updateContent(mockContent._id as string, updateData);

      expect(result).toEqual(updatedContent);
      expect(mockContentRepository.update).toHaveBeenCalledWith(mockContent._id, updateData);
      expect(mockContentRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should return null if content to update not found', async () => {
      mockContentRepository.update.mockResolvedValue(null);

      const result = await contentService.updateContent('nonexistent-id' as string, { title: 'Updated Title' });

      expect(result).toBeNull();
      expect(mockContentRepository.update).toHaveBeenCalledWith('nonexistent-id', { title: 'Updated Title' });
    });
  });

  describe('deleteContent', () => {
    it('should delete content', async () => {
      mockContentRepository.delete.mockResolvedValue(mockContent);

      const result = await contentService.deleteContent(mockContent._id  as string);

      expect(result).toEqual(mockContent);
      expect(mockContentRepository.delete).toHaveBeenCalledWith(mockContent._id);
      expect(mockContentRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should return null if content to delete not found', async () => {
      mockContentRepository.delete.mockResolvedValue(null);

      const result = await contentService.deleteContent('nonexistent-id');

      expect(result).toBeNull();
      expect(mockContentRepository.delete).toHaveBeenCalledWith('nonexistent-id');
    });
  });
});
