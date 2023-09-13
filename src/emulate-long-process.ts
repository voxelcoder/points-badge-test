import {getRandomInt} from "./user-store";

let stackCount = 0;
const stackLimit = 20;

export async function emulateLongProcess(): Promise<void> {
    if (stackCount >= stackLimit) {
        // Stack limit reached, wait for a second and try again.
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(emulateLongProcess());
            }, 1000);
        });
    }

    stackCount++;

    // Sanity check, just in case.
    if (stackCount > stackLimit) {
        throw Error('stack overflow');
    }

    const second = getRandomInt(10);

    return new Promise((resolve) =>
        setTimeout(() => {
            stackCount--;
            resolve()
        }, second * 1000)
    );
}