import { getRandomInt } from './user-store';

let stackCount = 0;
const stackLimit = 20;

export async function emulateLongProcess(): Promise<void> {
  stackCount++

  if(stackCount > stackLimit) {
    throw Error('stack overflow');
  }
  const second = getRandomInt(10);
  return new Promise((resolve) => {
    setTimeout(() => {
      stackCount--;
      resolve()
    }, second * 1000);
  });
}

