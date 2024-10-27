import Theme, { ITheme } from '../models/theme.model';

export class ThemeRepository {
  async create(themeData: Partial<ITheme>): Promise<ITheme> {
    return await Theme.create(themeData);
  }

  async findById(id: string): Promise<ITheme | null> {
    return await Theme.findById(id)
      .populate('categoriesIds', 'type label _id');
  }

  async findAll(): Promise<ITheme[]> {
    return await Theme.find({ deletedAt: null })
      .populate('categoriesIds', 'type label _id');;
  }

  async update(id: string, themeData: Partial<ITheme>): Promise<ITheme | null> {
    return await Theme.findByIdAndUpdate(id, themeData, { new: true });
  }

  async delete(id: string): Promise<ITheme | null> {
    return await Theme.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }
}
