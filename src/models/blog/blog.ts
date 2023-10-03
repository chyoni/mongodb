import { Schema, model, Types } from 'mongoose';
import { IUser } from '../user/user';
import { IComment } from '../comment/comment';

export interface IBlog {
  _id: string;
  title: string;
  content: string;
  isLive: boolean;
  comments: IComment;
  user: IUser;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, required: true, default: false },
    user: { type: Types.ObjectId, required: true, ref: 'user' },
  },
  { timestamps: true }
);

const Blog = model('blog', blogSchema);

export default Blog;
