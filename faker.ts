import faker from 'faker';
import { User } from './src/models';

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
