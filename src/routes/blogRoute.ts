import { Router } from 'express';
import Blog from '../models/blog';
import User from '../models/user';
import mongoose from 'mongoose';

export const blogRouter = Router();

// Get blogs
blogRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    return res.status(200).send({ blogs });
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

// Create blog
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

// Get blog
blogRouter.get('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!mongoose.isValidObjectId(blogId))
      return res.status(400).send({ error: 'Invalid blog id' });

    const blog = await Blog.findOne({ _id: blogId });
    return res.status(200).send({ blog });
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

// Update blog
blogRouter.put('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!mongoose.isValidObjectId(blogId))
      return res.status(400).send({ error: 'Invalid blog id' });

    const blog = await Blog.findByIdAndUpdate(blogId, req.body, { new: true });
    return res.status(200).send({ blog });
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

// Toggle isLive value of blog
blogRouter.patch('/:blogId/live', async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!mongoose.isValidObjectId(blogId))
      return res.status(400).send({ error: 'Invalid blog id' });

    const { isLive } = req.body;
    if (typeof isLive !== 'boolean')
      return res.status(400).send({ error: 'isLive must be a boolean value' });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { isLive },
      { new: true }
    );
    return res.status(200).send({ blog });
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});
