import { Request, Response } from 'express';
import Comment from '../models/Comment';

import Post from '../models/Post';

const postController = {
  getPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Post.find({
        user: [...req.user.following, req.user._id],
      }).sort('-createdAt');

      res.json({
        success: 'Success!',
        result: posts.length,
        posts,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  getUserPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Post.find({ user: req.params.id }).sort('-createdAt');

      res.json({
        posts,
        result: posts.length,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  getPost: async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(400).json({ error: 'This post does not exist.' });

      res.json({
        success: 'Post found!',
        post,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  createPost: async (req: Request, res: Response) => {
    try {
      const { content, images } = req.body;

      if (content.length === 0 && images.length === 0)
        return res.status(400).json({ error: 'Please add something.' });

      const postDB = new Post({
        content,
        images,
        user: req.user._id,
      });

      const newPost = await postDB.save();

      res.json({
        success: 'Created Post!',
        post: {
          post: newPost,
          user: req.user._id,
        },
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  deletePost: async (req: Request, res: Response) => {
    try {
      const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      await Comment.deleteMany({ _id: { $in: post?.comments } });

      res.json({
        success: 'Deleted Post!',
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  updatePost: async (req: Request, res: Response) => {
    try {
      const { content, images } = req.body;

      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          images,
        },
        { new: true }
      );

      res.json({
        success: 'Updated Post!',
        post,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  likePost: async (req: Request, res: Response) => {
    try {
      const post = await Post.find({ _id: req.params.id, likes: req.user._id });
      if (post.length > 0) return res.status(400).json({ error: 'You liked this post.' });

      const like = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like) return res.status(400).json({ error: 'This post does not exist.' });

      res.json({ success: 'Liked Post!' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  unLikePost: async (req: Request, res: Response) => {
    try {
      const like = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      if (!like) return res.status(400).json({ error: 'This post does not exist.' });

      res.json({ successs: 'UnLiked Post!' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};

export default postController;
