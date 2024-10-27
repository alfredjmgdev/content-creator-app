import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user.model';

const authService = new AuthService();
const userService = new UserService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  try {
    const decoded = authService.verifyToken(token);
    const user = await userService.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    req.user = { ...decoded, userInfo: user };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Update the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        iat: number;
        exp: number;
        userInfo: IUser;
      };
    }
  }
}
