import User, { IUser } from '../models/user.model';

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    return await User.create(userData);
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findAll(): Promise<IUser[]> {
    return await User.find({ deletedAt: null });
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email, deletedAt: null });
  }
}
