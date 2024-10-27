import { ContentRepository } from '../repositories/content.repository';
import { IContent } from '../models/content.model';

export class ContentService {
  private contentRepository: ContentRepository;

  constructor() {
    this.contentRepository = new ContentRepository();
  }

  async createContent(contentData: Partial<IContent>): Promise<IContent> {
    return await this.contentRepository.create(contentData);
  }

  async getContentById(id: string): Promise<IContent | null> {
    return await this.contentRepository.findById(id);
  }

  async getAllContents(): Promise<IContent[]> {
    return await this.contentRepository.findAll();
  }

  async updateContent(id: string, contentData: Partial<IContent>): Promise<IContent | null> {
    return await this.contentRepository.update(id, contentData);
  }

  async deleteContent(id: string): Promise<IContent | null> {
    return await this.contentRepository.delete(id);
  }
}
