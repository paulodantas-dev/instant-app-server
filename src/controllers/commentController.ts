import { Request, Response } from 'express';

import Comment from '../models/Comment';
import Post from '../models/Post';

const commentController = {
  createComment: async (req: Request, res: Response) => {
    try {
      const { postId, content, postUserId } = req.body;

      const post = await Post.findById(postId);
      if (!post) return res.status(400).json({ error: 'This post does not exist.' });

      const newComment = new Comment({
        user: req.user._id,
        content,
        postUserId,
        postId,
      });

      await Post.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );

      await newComment.save();

      res.status(200).json({ success: 'Comment created!', comment: newComment });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  updateComment: async (req: Request, res: Response) => {
    try {
      const { content } = req.body;

      const comment = await Comment.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        { content },
        { new: true }
      );

      res.status(200).json({ success: 'Update Success!', comment: comment });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  likeComment: async (req: Request, res: Response) => {
    try {
      const comment = await Comment.find({ _id: req.params.id, likes: req.user._id });
      if (comment.length > 0) return res.status(400).json({ error: 'You liked this post.' });

      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      res.status(200).json({ success: 'Liked Comment!' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  unLikeComment: async (req: Request, res: Response) => {
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      res.status(200).json({ success: 'UnLiked Comment!' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
  deleteComment: async (req: Request, res: Response) => {
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        $or: [{ user: req.user._id }, { postUserId: req.user._id }],
      });

      await Post.findOneAndUpdate(
        { _id: comment?.postId },
        {
          $pull: { comments: req.params.id },
        }
      );

      res.status(200).json({ success: 'Deleted Comment!' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};

export default commentController;
