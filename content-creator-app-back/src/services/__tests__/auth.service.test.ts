import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import mongoose from 'mongoose';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../user.service');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserService: jest.Mocked<UserService>;

  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
    type: 'creator',
    createdAt: new Date(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Initialize the service
    authService = new AuthService();
    mockUserService = new UserService() as jest.Mocked<UserService>;
    (authService as any).userService = mockUserService;
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = 'testUserId';
      const mockToken = 'mockToken123';
      
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = authService.generateToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      expect(result).toBe(mockToken);
    });

    it('should throw an error if token generation fails', () => {
      const userId = 'testUserId';
      const mockError = new Error('Token generation failed');
      
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      expect(() => authService.generateToken(userId)).toThrow(mockError);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const mockToken = 'validToken123';
      const mockDecodedToken = {
        userId: 'testUserId',
        iat: 123456789,
        exp: 987654321,
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);

      const result = authService.verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(result).toEqual(mockDecodedToken);
    });

    it('should throw an error if token verification fails', () => {
      const mockToken = 'invalidToken123';
      const mockError = new Error('Token verification failed');

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      expect(() => authService.verifyToken(mockToken)).toThrow(mockError);
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'correctPassword';

      mockUserService.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(email, password);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'somePassword';

      mockUserService.getUserByEmail = jest.fn().mockResolvedValue(null);

      const result = await authService.validateUser(email, password);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';

      mockUserService.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(email, password);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toBeNull();
    });
  });
});
