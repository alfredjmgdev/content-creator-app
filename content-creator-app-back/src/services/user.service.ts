import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    return await this.userRepository.create(userData);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await this.userRepository.delete(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
