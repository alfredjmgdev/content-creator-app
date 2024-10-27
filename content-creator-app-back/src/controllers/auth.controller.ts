import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, type } = req.body;
      const user = await this.userService.createUser({ username, email, password, type });
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ message: 'Error creating user', error });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.authService.validateUser(email, password);
      if (user) {
        const token = this.authService.generateToken(user._id.toString());
        res.json({ user, token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }
      console.log(token)
      const decoded = this.authService.verifyToken(token);
      console.log(decoded)
      const user = await this.userService.getUserById(decoded.userId);
      if (user) {
        res.json({ user });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Invalid token', error });
    }
  }
}
