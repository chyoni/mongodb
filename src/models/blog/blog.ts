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
  comments: IComment[];
  commentsCount: number;
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
    commentsCount: { type: Number, default: 0, required: true },
    comments: [commentSchema],
  },
  { timestamps: true }
);

blogSchema.index({ 'user._id': 1, updatedAt: 1 });
blogSchema.index({ title: 'text', content: 'text' }); // text 인덱스를 여러개 만들고 싶을 때 하는 방법 (복합 인덱스로 만들기)
// blogSchema.virtual('comments', {
//   ref: 'comment',
//   localField: '_id',
//   foreignField: 'blog',
// });

// blogSchema.set('toObject', { virtuals: true });
// blogSchema.set('toJSON', { virtuals: true });

const Blog = model('blog', blogSchema);

export default Blog;
