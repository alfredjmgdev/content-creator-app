import Content, { IContent } from '../models/content.model';

export class ContentRepository {
  async create(contentData: Partial<IContent>): Promise<IContent> {
    return await Content.create(contentData);
  }

  async findById(id: string): Promise<IContent | null> {
    return await Content.findById(id)
      .populate('userId', 'username email')
      .populate('themesIds', 'name description coverImage')
      .populate({
        path: 'values.categoryId',
        select: 'type label _id'
      });
  }

  async findAll(): Promise<IContent[]> {
    return await Content.find({ deletedAt: null })
      .populate('userId', 'username email')
      .populate('themesIds', 'name description coverImage')
      .populate({
        path: 'values.categoryId',
        select: 'type label _id'
      });
  }

  async update(id: string, contentData: Partial<IContent>): Promise<IContent | null> {
    return await Content.findByIdAndUpdate(id, contentData, { new: true });
  }

  async delete(id: string): Promise<IContent | null> {
    return await Content.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }
}
