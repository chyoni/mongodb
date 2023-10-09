import faker from 'faker';
import { Blog, User } from './src/models';
import axios from 'axios';

const URI = 'http://localhost:3000';

export const generateUser = async (userCount: number) => {
  const users = [];

  console.log('Preparing fake data');

  for (let i = 0; i < userCount; i++) {
    users.push(
      new User({
        username: faker.internet.userName() + Math.random() * 1000000000,
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
        age: 10 + Math.floor(Math.random() * 50),
        email: faker.internet.email(),
      })
    );
  }

  console.log('Fake data inserting to database...');
  await User.insertMany(users);
  console.log('COMPLETE generate fake data');
};

export const generateBlogAndComment = async (
  blogsPerUser: number,
  commentsPerUser: number
) => {
  try {
    let blogs: any[] = [];
    let comments: any[] = [];
    console.log('Preparing fake data blog and comments');

    const users = await User.find().limit(blogsPerUser);
    users.map((user) => {
      for (let i = 0; i < blogsPerUser; i++) {
        blogs.push(
          axios.post(`${URI}/blog`, {
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            isLive: true,
            userId: user.id,
          })
        );
      }
    });

    let newBlogs = await Promise.all(blogs);
    console.log(`${newBlogs.length} fake blogs generated!`);

    users.map((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        let index = Math.floor(Math.random() * blogs.length);
        comments.push(
          axios.post(`${URI}/blog/${newBlogs[index].data.blog._id}/comments`, {
            content: faker.lorem.sentence(),
            userId: user.id,
            userFullName: user.name.first + user.name.last,
          })
        );
      }
    });

    await Promise.all(comments);
    console.log(`${comments.length} fake comments generated!`);
    console.log('COMPLETE!');
  } catch (e: any) {
    console.log(e);
  }
};
