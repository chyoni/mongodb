import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';

export const userRouter = Router();

userRouter.get('/', async function (req, res) {
  try {
    const users = await User.find();
    return res.send({ users });
  } catch (e: any) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

userRouter.post('/', async function (req, res) {
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

userRouter.get('/:userId', async (req, res) => {
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

userRouter.delete('/:userId', async (req, res) => {
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

userRouter.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ error: 'Invalid user id' });

    if (req.body.name) {
      const { first, last } = req.body.name;
      if (!first || !last)
        return res
          .status(400)
          .send({ error: 'Both first and last name are required' });
    }

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
    });

    return res.status(200).send({ user: updatedUser });
  } catch (e: any) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});
