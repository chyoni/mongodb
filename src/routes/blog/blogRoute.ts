import { Router } from 'express';
import { Blog, Comment, User } from '../../models';
import mongoose from 'mongoose';

export const blogRouter = Router();

// Get blogs
blogRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate([
      { path: 'user' },
      { path: 'comments' },
    ]);
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

// Create comment by blog id
blogRouter.post('/:blogId/comments', async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!mongoose.isValidObjectId(blogId))
      return res.status(400).send({ error: 'Invalid blog id' });
    const { content, userId } = req.body;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ error: 'Invalid user id' });

    if (!content)
      return res.status(400).send({ error: 'content must be required' });

    const [blog, user] = await Promise.all([
      Blog.findOne({ _id: blogId }),
      User.findOne({ _id: userId }),
    ]);

    if (!blog || !user)
      return res.status(400).send({ error: 'User or Blog does not exist' });
    if (!blog.isLive)
      return res.status(400).send({ error: 'Blog is not available' });

    const comment = new Comment({ content, user, blog });

    await Promise.all([
      comment.save(),
      Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
    ]);
    return res.status(201).send({ comment });
  } catch (e: any) {
    return res.status(500).send({ error: e.message });
  }
});

blogRouter.get('/:blogId/comments', async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!mongoose.isValidObjectId(blogId))
      return res.status(400).send({ error: 'Invalid blog id' });

    const comments = await Comment.find({ blog: blogId });
    return res.status(200).send({ comments });
  } catch (e: any) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});