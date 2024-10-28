import { Request, Response } from 'express';
import { ContentService } from '../services/content.service';

export class ContentController {
  private contentService: ContentService;

  constructor() {
    this.contentService = new ContentService();
  }

  async createContent(req: Request, res: Response): Promise<void> {
    try {
      const content = await this.contentService.createContent({...req.body, userId: req.user?.userId});
      res.status(201).json(content);
    } catch (error) {
      res.status(500).json({ error: 'Error creating content' });
    }
  }

  async getContentById(req: Request, res: Response): Promise<void> {
    try {
      const content = await this.contentService.getContentById(req.params.id);
      if (content) {
        res.json(content);
      } else {
        res.status(404).json({ error: 'Content not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching content' });
    }
  }

  async getAllContents(req: Request, res: Response): Promise<void> {
    try {
      const contents = await this.contentService.getAllContents();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching contents' });
    }
  }

  async updateContent(req: Request, res: Response): Promise<void> {
    try {
      const content = await this.contentService.updateContent(req.params.id, {...req.body, userId: req.user?.userId});
      if (content) {
        res.json(content);
      } else {
        res.status(404).json({ error: 'Content not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating content' });
    }
  }

  async deleteContent(req: Request, res: Response): Promise<void> {
    try {
      const content = await this.contentService.deleteContent(req.params.id);
      if (content) {
        res.json({ message: 'Content deleted successfully' });
      } else {
        res.status(404).json({ error: 'Content not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting content' });
    }
  }
}
