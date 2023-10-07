import { Schema, model, Types } from 'mongoose';
import { IUser } from '../user/user';
import { IBlog } from '../blog/blog';

export interface IComment {
  _id: string;
  content: string;
  user: IUser;
  userFullName: string;
  blog: IBlog;
}

export const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    user: { type: Types.ObjectId, required: true, ref: 'user' },
    userFullName: { type: String, required: true },
    blog: { type: Types.ObjectId, required: true, ref: 'blog' },
  },
  { timestamps: true }
);

const Comment = model('comment', commentSchema);
export default Comment;
