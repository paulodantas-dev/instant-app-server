import { Request, Response } from 'express';

import bcrypt from 'bcrypt';

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

      const newUser = new User({
        fullname,
        username: newUserName,
        email,
        password: passwordHash,
      });

      const access_token = createAccessToken({ id: newUser._id });
      const refresh_token = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/refresh_token',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
      });

      await newUser.save();

      res.status(200).json({
        success: 'Register Success!',
        access_token,
        user: {
          ...newUser._doc,
          password: '',
        },
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  // login: async (req: Request, res: Response) => {},
  // logout: async (req: Request, res: Response) => {},
  // generateAccessToken: async (req: Request, res: Response) => {},
};

export default authController;
