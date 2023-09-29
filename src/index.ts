import express from 'express';
import mongoose from 'mongoose';
import User from './models/user';
const app = express();

const MONGO_URI =
  'mongodb+srv://chiwon99881:VM3j4MQVKrMWW6K3@tutorial.qzgcfiu.mongodb.net/BlogService?retryWrites=true&w=majority&appName=AtlasApp';

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected !');

    app.use(express.json());

    app.get('/users', async function (req, res) {
      try {
        const users = await User.find();
        return res.send({ users });
      } catch (e: any) {
        console.log(e);
        return res.status(500).send({ error: e.message });
      }
    });

    app.post('/users', async function (req, res) {
      try {
        const { username, name } = req.body;

        if (!username)
          return res.status(400).send({ error: 'username is required' });
        if (!name || !name.first || !name.last)
          return res
            .status(400)
            .send({ err: 'Both first and last name are required' });

        const user = new User(req.body);
        await user.save();
        return res.send({ success: true, user });
      } catch (e: any) {
        console.log(e);
        return res.status(500).send({ error: e.message });
      }
    });

    app.get('/users/:userId', async (req, res) => {
      const { userId } = req.params;
      if (!mongoose.isValidObjectId(userId))
        return res.status(400).send({ error: 'Invalid user id' });

      try {
        const user = await User.findOne({ _id: userId });
        return res.send({ user });
      } catch (e: any) {
        console.log(e);
        return res.status(500).send({ error: e.message });
      }
    });

    app.delete('/users/:userId', async (req, res) => {
      try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
          return res.status(400).send({ error: 'Invalid user id' });
        const deleted = await User.findOneAndDelete({ _id: userId });

        return res.status(200).send({ user: deleted });
      } catch (e: any) {
        console.log(e);
        return res.status(500).send({ error: e.message });
      }
    });

    app.listen(3000, function () {
      console.log('server listening on port 3000');
    });
  } catch (error) {
    console.log(error);
  }
};

start();
