import { Request, Response, NextFunction } from 'express';

import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '../models/User';

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization');

    if (!token) return res.status(400).json({ error: 'Please Log in.' });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as JwtPayload;
    if (!decoded) return res.status(400).json({ error: 'Invalid Authentication.' });

    const user = await User.findOne({ _id: decoded.id });
    if (!user) return res.status(400).json({ error: 'User invalid.' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default authentication;
