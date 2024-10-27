import { Request, Response, NextFunction } from 'express';

export const validateUserType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.userInfo) {
      res.status(401).json({ message: 'Unauthorized - User information not found' });
      return;
    }

    const userType = req.user.userInfo.type;
    
    if (!allowedTypes.includes(userType)) {
      res.status(403).json({ 
        message: `Forbidden - Access restricted to ${allowedTypes.join(', ')} users` 
      });
      return;
    }

    next();
  };
};
