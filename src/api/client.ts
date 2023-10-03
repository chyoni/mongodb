import { IBlog } from '../models/blog/blog';
import axios from 'axios';

const URI = 'http://localhost:3000';

const test = async () => {
  console.time('loading time: ');
  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);

  blogs = await Promise.all(
    blogs.map(async (blog: IBlog) => {
      const [userRes, commentsRes] = await Promise.all([
        await axios.get(`${URI}/users/${blog.user}`),
        await axios.get(`${URI}/blog/${blog._id}/comments`),
      ]);
      // const {
      //   data: { user },
      // } = await axios.get(`${URI}/users/${blog.user}`);
      // const {
      //   data: { comments },
      // } = await axios.get(`${URI}/blog/${blog._id}/comments`);

      blog.user = userRes.data.user;
      blog.comments = commentsRes.data.comments;
      return blog;
    })
  );
  console.log('blogs:', blogs[0]);
  console.timeEnd('loading time: ');
};

test();
