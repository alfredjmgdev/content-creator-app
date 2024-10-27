import Theme, { ITheme } from '../models/theme.model';

export class ThemeRepository {
  async create(themeData: Partial<ITheme>): Promise<ITheme> {
    return await Theme.create(themeData);
  }

  async findById(id: string): Promise<ITheme | null> {
    return await Theme.findById(id);
  }

  async findAll(): Promise<ITheme[]> {
    return await Theme.find({ deletedAt: null });
  }

  async update(id: string, themeData: Partial<ITheme>): Promise<ITheme | null> {
    return await Theme.findByIdAndUpdate(id, themeData, { new: true });
  }

  async delete(id: string): Promise<ITheme | null> {
    return await Theme.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }
}
