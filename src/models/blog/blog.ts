import { Schema, model, Types, SchemaDefinitionProperty } from 'mongoose';
import { IComment, commentSchema } from '../comment/comment';

export interface IBlogUser {
  _id: SchemaDefinitionProperty<string>;
  username: SchemaDefinitionProperty<string>;
  name: {
    first: SchemaDefinitionProperty<string>;
    last: SchemaDefinitionProperty<string>;
  };
}

export interface IBlog {
  _id: string;
  title: string;
  content: string;
  isLive: boolean;
  comments: IComment;
  user: IBlogUser;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, required: true, default: false },
    user: {
      _id: { type: Types.ObjectId, required: true, ref: 'user' },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

blogSchema.index({ 'user._id': 1, updatedAt: 1 });
// blogSchema.virtual('comments', {
//   ref: 'comment',
//   localField: '_id',
//   foreignField: 'blog',
// });

// blogSchema.set('toObject', { virtuals: true });
// blogSchema.set('toJSON', { virtuals: true });

const Blog = model('blog', blogSchema);

export default Blog;
