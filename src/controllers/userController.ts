import { Request, Response } from 'express';

import User from '../models/User';

const userController = {
  searchUser: async (req: Request, res: Response) => {
    try {
      const users = await User.find({ username: { $regex: req.query.username } })
        .limit(10)
        .select('fullname username profilePicture');

      res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('followers following', '-password');

      if (!user) return res.status(400).json({ error: 'User does not exist.' });

      res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  updateUser: async (req: Request, res: Response) => {
    try {
      const {
        about,
        relationship,
        profilePicture,
        coverPicture,
        fullname,
        mobile,
        address,
        story,
        gender,
      } = req.body;
      if (!fullname) return res.status(400).json({ error: 'Please add your full name.' });

      const updateUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          profilePicture,
          coverPicture,
          fullname,
          about,
          mobile,
          address,
          story,
          relationship,
          gender,
        },
        { new: true }
      );

      res.status(200).json({ success: true, updateUser });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  follow: async (req: Request, res: Response) => {
    try {
      const user = await User.find({ _id: req.params.id, followers: req.user._id });
      if (user.length > 0) return res.status(500).json({ error: 'You followed this user.' });

      const newUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      ).populate('followers following', '-password');

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      res.status(200).json({ success: true, newUser });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  unfollow: async (req: Request, res: Response) => {
    try {
      const newUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      ).populate('followers following', '-password');

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      res.status(200).json({ success: true, newUser });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};

export default userController;
