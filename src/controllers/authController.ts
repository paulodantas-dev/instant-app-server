import { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '../models/User';
import { createAccessToken, createRefreshToken } from '../utils/token';

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { fullname, username, email, password } = req.body;

      const newUserName = username.toLowerCase().replace(/ /g, '');

      const findUserName = await User.findOne({ username: newUserName });
      if (findUserName) return res.status(400).json({ error: 'This user name already exists.' });

      const findUserEmail = await User.findOne({ email });
      if (findUserEmail) return res.status(400).json({ error: 'This email already exists.' });

      if (password.length < 6)
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const userDB = new User({
        fullname,
        username: newUserName,
        email,
        password: passwordHash,
      });

      const access_token = createAccessToken({ id: userDB._id });
      const refresh_token = createRefreshToken({ id: userDB._id });

      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30days
      });

      const newUser = await userDB.save();

      res.status(200).json({
        success: true,
        access_token,
        user: newUser,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'This email does not exist.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Password is incorrect.' });

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30days
      });

      res.status(200).json({
        success: true,
        access_token,
        user,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  logout: async (_req: Request, res: Response) => {
    try {
      res.clearCookie('refreshtoken', {
        path: 'api/refresh_token',
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  generateAccessToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.headers.cookie?.split('=')[1];
      if (!rf_token) return res.status(400).json({ error: 'Token doenst exist.' });

      const resultToken = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET) as JwtPayload;
      if (!resultToken) return res.status(400).json({ error: 'invalid token.' });

      const user = await User.findById(resultToken.id).select('-password');
      if (!user) return res.status(400).json({ error: 'This does not exist.' });

      const access_token = createAccessToken({ id: resultToken.id });

      res.status(200).json({
        success: true,
        access_token,
        user,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};

export default authController;
