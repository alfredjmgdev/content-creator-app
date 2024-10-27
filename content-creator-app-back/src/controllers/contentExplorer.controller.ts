import { Request, Response } from 'express';
import { ContentService } from '../services/content.service';
import { CategoryService } from '../services/category.service';
import { ThemeService } from '../services/theme.service';

export class ContentExplorerController {
  private contentService: ContentService;
  private categoryService: CategoryService;
  private themeService: ThemeService;

  constructor() {
    this.contentService = new ContentService();
    this.categoryService = new CategoryService();
    this.themeService = new ThemeService();
  }

  getAllData = async (req: Request, res: Response): Promise<void> => {
    try {
      const [contents, categories, themes] = await Promise.all([
        this.contentService.getAllContents(),
        this.categoryService.getAllCategories(),
        this.themeService.getAllThemes()
      ]);

      const explorerData = {
        contents,
        categories,
        themes
      };

      res.status(200).json(explorerData);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching explorer data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}