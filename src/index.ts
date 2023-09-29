import express from 'express';
import mongoose from 'mongoose';
import { userRouter } from './routes/userRoute';
import { blogRouter } from './routes/blogRoute';
const app = express();

const MONGO_URI =
  'mongodb+srv://chiwon99881:VM3j4MQVKrMWW6K3@tutorial.qzgcfiu.mongodb.net/BlogService?retryWrites=true&w=majority&appName=AtlasApp';

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    mongoose.set('debug', true);
    console.log('MongoDB connected !');

    app.use(express.json());

    app.use('/users', userRouter);
    app.use('/blog', blogRouter);

    app.listen(3000, function () {
      console.log('server listening on port 3000');
    });
  } catch (error) {
    console.log(error);
  }
};

start();
