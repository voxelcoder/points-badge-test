import { getRandomInt } from './user-store';

export async function emulateLongProcess(): Promise<void> {
  const second = getRandomInt(10);
  return new Promise((resolve) => {
    setTimeout(() => resolve(), second * 1000);
  });
}
