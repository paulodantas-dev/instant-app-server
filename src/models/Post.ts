import mongoose from 'mongoose';

export interface IPost {
  content: string;
  images: [string];
  user: mongoose.Schema.Types.ObjectId;
  likes: [mongoose.Schema.Types.ObjectId];
  comments: [mongoose.Schema.Types.ObjectId];
}

const postSchema = new mongoose.Schema<IPost>(
  {
    content: {
      type: String,
      default: '',
    },
    images: [String],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
