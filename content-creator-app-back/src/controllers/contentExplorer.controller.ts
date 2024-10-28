import { Request, Response } from 'express';
import { ContentService } from '../services/content.service';
import { CategoryService } from '../services/category.service';
import { ThemeService } from '../services/theme.service';
import { SocketService } from '../services/socket.service';

export class ContentExplorerController {
  private contentService: ContentService;
  private categoryService: CategoryService;
  private themeService: ThemeService;
  private socketService: SocketService;

  constructor() {
    this.contentService = new ContentService();
    this.categoryService = new CategoryService();
    this.themeService = new ThemeService();
    this.socketService = SocketService.getInstance();
  }

  getAllData = async (req: Request, res: Response): Promise<void> => {
    try {
      const explorerData = await this.getExplorerData();
      
      // Emit the data through WebSocket
      this.socketService.getIO().emit('contentUpdated', explorerData);
      console.log('Emitted contentUpdated event');

      res.status(200).json(explorerData);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching explorer data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Add method to get explorer data
  private async getExplorerData() {
    const [contents, categories, themes] = await Promise.all([
      this.contentService.getAllContents(),
      this.categoryService.getAllCategories(),
      this.themeService.getAllThemes()
    ]);

    return {
      contents,
      categories,
      themes
    };
  }
}
