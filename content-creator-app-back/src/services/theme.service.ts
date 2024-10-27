import { ThemeRepository } from '../repositories/theme.repository';
import { ITheme } from '../models/theme.model';

export class ThemeService {
  private themeRepository: ThemeRepository;

  constructor() {
    this.themeRepository = new ThemeRepository();
  }

  async createTheme(themeData: Partial<ITheme>): Promise<ITheme> {
    return await this.themeRepository.create(themeData);
  }

  async getThemeById(id: string): Promise<ITheme | null> {
    return await this.themeRepository.findById(id);
  }

  async getAllThemes(): Promise<ITheme[]> {
    return await this.themeRepository.findAll();
  }

  async updateTheme(id: string, themeData: Partial<ITheme>): Promise<ITheme | null> {
    return await this.themeRepository.update(id, themeData);
  }

  async deleteTheme(id: string): Promise<ITheme | null> {
    return await this.themeRepository.delete(id);
  }
}
