import mongoose from 'mongoose';

export interface IComment {
  content: string;
  postUserId: string;
  postId: string;
  user: mongoose.Schema.Types.ObjectId;
  likes: [mongoose.Schema.Types.ObjectId];
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
