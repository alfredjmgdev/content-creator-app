import { UserRepository } from '../user.repository';
import UserModel, { IUser, UserTypeEnum } from '../../models/user.model';
import mongoose from 'mongoose';

// Mock the mongoose model
jest.mock('../../models/user.model');

describe('UserRepository', () => {
  let userRepository: UserRepository;
  
  const mockUser = {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    type: UserTypeEnum.CREATOR,
    createdAt: new Date(),
  } as IUser;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.create({
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
        type: mockUser.type
      });

      expect(UserModel.create).toHaveBeenCalledWith({
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
        type: mockUser.type
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findById(mockUser._id.toString());

      expect(UserModel.findById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findById('nonexistentid');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail(mockUser.email);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted users', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([mockUser]);

      const result = await userRepository.findAll();

      expect(UserModel.find).toHaveBeenCalledWith({ deletedAt: null });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updateData = { username: 'newusername' };
      const updatedUser = { ...mockUser, ...updateData };
      
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userRepository.update(
        mockUser._id.toString(),
        updateData
      );

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id.toString(),
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should soft delete user', async () => {
      const deletedUser = {
        ...mockUser,
        deletedAt: new Date()
      };
      
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(deletedUser);

      const result = await userRepository.delete(mockUser._id.toString());

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id.toString(),
        { deletedAt: expect.any(Date) },
        { new: true }
      );
      expect(result).toEqual(deletedUser);
    });
  });
});
