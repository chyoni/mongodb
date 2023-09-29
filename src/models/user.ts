import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  name: {
    first: string;
    last: string;
  };
  age: number;
  email: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    age: Number,
    email: String,
  },
  { timestamps: true }
);

const User = model<IUser>('user', userSchema);
export default User;
