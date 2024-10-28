import { ThemeService } from '../theme.service';
import { ThemeRepository } from '../../repositories/theme.repository';
import { ITheme } from '../../models/theme.model';

// Mock the ThemeRepository
jest.mock('../../repositories/theme.repository', () => {
  return {
    ThemeRepository: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  };
});

describe('ThemeService', () => {
  let themeService: ThemeService;
  let mockThemeRepository: jest.Mocked<ThemeRepository>;

  // Mock theme data
  const mockTheme: Partial<ITheme> = {
    name: 'Test Theme',
    description: 'Test Description',
    categoriesIds: ['category1', 'category2'],
    coverImage: 'test-image.jpg',
    createdAt: new Date(),
  };

  const mockThemeWithId = {
    ...mockTheme,
    _id: 'theme123',
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Create a new instance for each test
    const repository = new ThemeRepository();
    mockThemeRepository = repository as jest.Mocked<ThemeRepository>;
    themeService = new ThemeService();
  });

  describe('createTheme', () => {
    it('should create a new theme', async () => {
      (mockThemeRepository.create as jest.Mock).mockResolvedValue(mockThemeWithId as ITheme);

      const result = await themeService.createTheme(mockTheme);

      expect(result).toEqual(mockThemeWithId);
      expect(mockThemeRepository.create).toHaveBeenCalledWith(mockTheme);
      expect(mockThemeRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getThemeById', () => {
    it('should return a theme by id', async () => {
      (mockThemeRepository.findById as jest.Mock).mockResolvedValue(mockThemeWithId as ITheme);

      const result = await themeService.getThemeById('theme123');

      expect(result).toEqual(mockThemeWithId);
      expect(mockThemeRepository.findById).toHaveBeenCalledWith('theme123');
    });

    it('should return null if theme not found', async () => {
      (mockThemeRepository.findById as jest.Mock).mockResolvedValue(null);

      const result = await themeService.getThemeById('nonexistent');

      expect(result).toBeNull();
      expect(mockThemeRepository.findById).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('getAllThemes', () => {
    it('should return all themes', async () => {
      const mockThemes = [mockThemeWithId, { ...mockThemeWithId, _id: 'theme456' }];
      (mockThemeRepository.findAll as jest.Mock).mockResolvedValue(mockThemes as ITheme[]);

      const result = await themeService.getAllThemes();

      expect(result).toEqual(mockThemes);
      expect(mockThemeRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('updateTheme', () => {
    it('should update a theme', async () => {
      const updateData = { name: 'Updated Theme' };
      const updatedTheme = { ...mockThemeWithId, ...updateData };
      (mockThemeRepository.update as jest.Mock).mockResolvedValue(updatedTheme as ITheme);

      const result = await themeService.updateTheme('theme123', updateData);

      expect(result).toEqual(updatedTheme);
      expect(mockThemeRepository.update).toHaveBeenCalledWith('theme123', updateData);
    });

    it('should return null if theme not found', async () => {
      (mockThemeRepository.update as jest.Mock).mockResolvedValue(null);

      const result = await themeService.updateTheme('nonexistent', { name: 'Updated Theme' });

      expect(result).toBeNull();
      expect(mockThemeRepository.update).toHaveBeenCalledWith('nonexistent', { name: 'Updated Theme' });
    });
  });

  describe('deleteTheme', () => {
    it('should delete a theme', async () => {
      (mockThemeRepository.delete as jest.Mock).mockResolvedValue(mockThemeWithId as ITheme);

      const result = await themeService.deleteTheme('theme123');

      expect(result).toEqual(mockThemeWithId);
      expect(mockThemeRepository.delete).toHaveBeenCalledWith('theme123');
    });

    it('should return null if theme not found', async () => {
      (mockThemeRepository.delete as jest.Mock).mockResolvedValue(null);

      const result = await themeService.deleteTheme('nonexistent');

      expect(result).toBeNull();
      expect(mockThemeRepository.delete).toHaveBeenCalledWith('nonexistent');
    });
  });
});
