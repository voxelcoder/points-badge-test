import {getRandomInt} from "./user-store";

// Re-Export to switch out different versions of the function:
export const emulateLongProcess = emulateLongProcessRecursive;

let stackCount = 0;
const stackLimit = 20;


// Original version. Will crash once the stack limit is reached.
export async function emulateLongProcessOrFail(): Promise<void> {
    stackCount++

    assertStackLimit();

    const second = getRandomInt(10);

    return new Promise((resolve) => {
        setTimeout(() => {
            stackCount--;
            resolve()
        }, second * 1000);
    });
}

/*
 * In the original function above, we'd just throw an error if the stack limit is reached. However, this would
 * cause the entire program to crash. Instead, we can use a recursive function to wait for the stack to clear up
 * and then try again.
 *
 * Since the timeouts are cheap to allocate, and cheap to run, this should not cause any performance issues. At least,
 * not for a good amount of more users.
 *
 * Another approach would be to create a queue which would store the promises and resolve them once the stack is
 * cleared up. However, this would break the API, and would kind of defeat the purpose of the stack limit in the
 * first place.
 */
export async function emulateLongProcessRecursive(): Promise<void> {
    if (stackCount >= stackLimit) {
        // Stack limit reached, wait for a second and try again.
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(emulateLongProcessRecursive());
            }, 1000);
        });
    }

    stackCount++;

    // Sanity check, just in case.
    assertStackLimit();

    const second = getRandomInt(10);

    return new Promise((resolve) =>
        setTimeout(() => {
            stackCount--;
            resolve()
        }, second * 1000)
    );
}

function assertStackLimit() {
    if (stackCount > stackLimit) {
        throw Error('stack overflow');
    }
}

