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
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>('comments', commentSchema);

export default Comment;
