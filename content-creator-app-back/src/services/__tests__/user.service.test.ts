import { UserService } from '../user.service';
import { UserRepository } from '../../repositories/user.repository';
import { IUser, UserTypeEnum } from '../../models/user.model';
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Mock the dependencies
jest.mock('../../repositories/user.repository');
jest.mock('bcrypt');

// Create a MockUser class that implements IUser
class MockUser extends Document implements IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  type: UserTypeEnum;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor() {
    super();
    this._id = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
    this.username = 'testuser';
    this.email = 'test@example.com';
    this.password = 'hashedpassword';
    this.type = UserTypeEnum.CREATOR;
    this.createdAt = new Date();
  }
}

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let mockUser: IUser;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = new MockUser();
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
    // @ts-ignore - Replace the repository with our mock
    userService.userRepository = userRepository;
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        type: UserTypeEnum.CREATOR,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      userRepository.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashedpassword',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUser._id.toString());

      expect(userRepository.findById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById('nonexistentid');

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      userRepository.findAll.mockResolvedValue([mockUser]);

      const result = await userService.getAllUsers();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('updateUser', () => {
    it('should update user with hashed password if password is provided', async () => {
      const updateData = {
        username: 'newusername',
        password: 'newpassword',
      };

      const updatedMockUser = new MockUser();
      Object.assign(updatedMockUser, {
        ...mockUser,
        ...updateData,
        password: 'newhashpassword'
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashpassword');
      userRepository.update.mockResolvedValue(updatedMockUser);

      const result = await userService.updateUser(mockUser._id.toString(), updateData);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(userRepository.update).toHaveBeenCalledWith(
        mockUser._id.toString(),
        { ...updateData, password: 'newhashpassword' }
      );
      expect(result).toBeDefined();
    });

    it('should update user without hashing password if password is not provided', async () => {
      const updateData = {
        username: 'newusername',
      };

      const updatedMockUser = new MockUser();
      Object.assign(updatedMockUser, { ...mockUser, ...updateData });

      userRepository.update.mockResolvedValue(updatedMockUser);

      const result = await userService.updateUser(mockUser._id.toString(), updateData);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.update).toHaveBeenCalledWith(mockUser._id.toString(), updateData);
      expect(result).toBeDefined();
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const deletedMockUser = new MockUser();
      deletedMockUser.deletedAt = new Date();
      userRepository.delete.mockResolvedValue(deletedMockUser);

      const result = await userService.deleteUser(mockUser._id.toString());

      expect(userRepository.delete).toHaveBeenCalledWith(mockUser._id.toString());
      expect(result).toEqual(deletedMockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail(mockUser.email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await userService.getUserByEmail('nonexistent@email.com');

      expect(result).toBeNull();
    });
  });
});
