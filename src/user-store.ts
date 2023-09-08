import { faker } from '@faker-js/faker';
import { User } from './types/user.interface';

export async function getAllUser(): Promise<User[]> {
  const userCount = getRandomInt(5000);
  return Array.from(Array(userCount), () => generateUser());
}


function generateUser(): User {
  return {
    id: faker.string.uuid(),
    username: faker.person.fullName(),
    solutionCount: getRandomInt(2200),
  };
}

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
