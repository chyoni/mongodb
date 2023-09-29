import { Router } from 'express';
import Blog from '../models/blog';
import User from '../models/user';
import mongoose from 'mongoose';

export const blogRouter = Router();

blogRouter.get('/', async (req, res) => {
  try {
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

blogRouter.post('/', async (req, res) => {
  try {
    const { title, content, isLive, userId } = req.body;
    if (!title) return res.status(400).send({ error: 'title is required' });
    if (!content) return res.status(400).send({ error: 'content is required' });
    if (isLive && typeof isLive !== 'boolean')
      return res.status(400).send({ error: 'isLive must be a boolean value' });
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ error: 'Invalid user id' });

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send({ error: 'User does not exist' });

    const blog = new Blog({ ...req.body, user });
    await blog.save();

    return res.status(201).send({ blog });
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

blogRouter.get('/:blogId', async (req, res) => {
  try {
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

blogRouter.put('/:blogId', async (req, res) => {
  try {
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

blogRouter.patch('/:blogId/live', async (req, res) => {
  try {
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});
