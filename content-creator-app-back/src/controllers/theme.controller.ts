import { Request, Response } from 'express';
import { ThemeService } from '../services/theme.service';

export class ThemeController {
  private themeService: ThemeService;

  constructor() {
    this.themeService = new ThemeService();
  }

  async createTheme(req: Request, res: Response): Promise<void> {
    try {
      const theme = await this.themeService.createTheme(req.body);
      res.status(201).json(theme);
    } catch (error) {
      res.status(500).json({ error: 'Error creating theme' });
    }
  }

  async getThemeById(req: Request, res: Response): Promise<void> {
    try {
      const theme = await this.themeService.getThemeById(req.params.id);
      if (theme) {
        res.json(theme);
      } else {
        res.status(404).json({ error: 'Theme not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching theme' });
    }
  }

  async getAllThemes(req: Request, res: Response): Promise<void> {
    try {
      console.log('MUAHAHAHAHHAHAHAHA')
      console.log(req.user)
      const themes = await this.themeService.getAllThemes();
      res.json(themes);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching themes' });
    }
  }

  async updateTheme(req: Request, res: Response): Promise<void> {
    try {
      const theme = await this.themeService.updateTheme(req.params.id, req.body);
      if (theme) {
        res.json(theme);
      } else {
        res.status(404).json({ error: 'Theme not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating theme' });
    }
  }

  async deleteTheme(req: Request, res: Response): Promise<void> {
    try {
      const theme = await this.themeService.deleteTheme(req.params.id);
      if (theme) {
        res.json({ message: 'Theme deleted successfully' });
      } else {
        res.status(404).json({ error: 'Theme not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting theme' });
    }
  }
}
