import { Schema, model, Types } from 'mongoose';
import { IUser } from './user';
import { IBlog } from './blog';

export interface IComment {
  content: string;
  user: IUser;
  blog: IBlog;
}

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    user: { type: Types.ObjectId, required: true, ref: 'user' },
    blog: { type: Types.ObjectId, required: true, ref: 'blog' },
  },
  { timestamps: true }
);

const Comment = model('comment', commentSchema);
export default Comment;
