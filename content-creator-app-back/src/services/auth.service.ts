import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { DecodedToken } from '../types/types';
import { IUser } from '../models/user.model';
export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  generateToken(userId: string): string {
    try{
      return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    }catch(error){
      console.error('Error generating token:', error);
      throw error;
    }
  }

  verifyToken(token: string): DecodedToken {
    try{
      return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    }catch(error){
      console.error('Error verifying token:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.userService.getUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}
