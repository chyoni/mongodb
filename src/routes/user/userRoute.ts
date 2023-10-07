import { Router } from 'express';
import mongoose from 'mongoose';
import { Blog, Comment, User } from '../../models';

export const userRouter = Router();

// Get users
userRouter.get('/', async function (req, res) {
  try {
    const users = await User.find();
    return res.send({ users });
  } catch (e: any) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

// Create user
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

// Get user
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

// Delete user
userRouter.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ error: 'Invalid user id' });
    const [deleted] = await Promise.all([
      User.findOneAndDelete({ _id: userId }),
      Blog.deleteMany({ 'user._id': userId }),
      Blog.updateMany(
        { 'comments.user': userId },
        { $pull: { comments: { user: userId } } }
      ),
      Comment.deleteMany({ user: userId }),
    ]);

    return res.status(200).send({ user: deleted });
  } catch (e: any) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

// Update user
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
    if (updatedUser) {
      await Blog.updateMany({ 'user._id': userId }, { user: updatedUser });
      await Blog.updateMany(
        { $expr: { $gte: [{ $size: '$comments' }, 1] } },
        {
          'comments.$[comment].userFullName': `${updatedUser.name.first} ${updatedUser.name.last}`,
        },
        { arrayFilters: [{ 'comment.user': userId }] }
      );
    }

    return res.status(200).send({ user: updatedUser });
  } catch (e: any) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});
