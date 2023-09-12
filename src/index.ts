import {User} from './types/user.interface';
import {Icon} from './types/icon.enum';
import {getAllUser} from "./user-store";
import {emulateLongProcess} from "./emulate-long-process";


/**
 * A map of minimum solution counts to badge icons.
 */
const solutionCountsToIcons: [number, Icon][] = [
    [0, Icon.BADGE_BAD_ASS],
    [1, Icon.BADGE_STARTER],
    [5, Icon.BADGE_BRONZE],
    [25, Icon.BADGE_SILVER],
    [50, Icon.BADGE_GOLD],
    [100, Icon.BADGE_PLATINUM],
    [2000, Icon.BADGE_GOD_LIKE]
];

const solutionCountsToIconsDescending = [...solutionCountsToIcons].reverse();

/**
 * Returns the correct badge for a user based on their `solution count`.
 *
 * @param user The user to get the badge for.
 */
export const getUsersBadge = async (user: User): Promise<Icon | null> => {
    await emulateLongProcess();

    for (const [count, icon] of solutionCountsToIconsDescending) {
        if (user.solutionCount >= count) {
            return icon;
        }
    }

    return null;
}

/**
 * Groups users by their badge. Only badges that are given out to the users in the array are contained in the map.
 *
 * @param users The users to group.
 */
async function groupBadgesToUsers(users: User[]): Promise<Map<Icon, User[]>> {
    const badgesToUsers: Map<Icon, User[]> = new Map();

    /*
    * The first version (written below) of this function was written in a way which underutilized the event loop.
    * Now with the addition of the emulateLongProcess function, the execution time of this function can reach literal
    * hours.
    *
    * Version before the optimization:
    * ```
    * for (const user of users) {
    *     const badge = await getUsersBadge(user);
    *
    *     if (badgesToUsers.has(badge)) {
    *         badgesToUsers.get(badge).push(user);
    *         continue;
    *     }
    *
    *     badgesToUsers.set(badge, [user]);
    * }
    *
    * return badgesToUsers;
    * ```
    *
    * To mitigate this, we can use the Promise.all() function to run all the promises concurrently. This will
    * significantly speed up the execution time of this function by packing the event loop, instead of calculating
    * the badges one by one. So when one promise is idle, the others can run.
    *
    * On my machine, this cut down the execution time to ~9 seconds.
    */
    const badges = await Promise.all(users.map(getUsersBadge));

    // Luckily the Promise.all function preserves the order of the promises we pass into it, so we can use the index
    // to get the correct user.
    for (let index = 0; index < badges.length; index++) {
        const badge = badges[index];
        const user = users[index];

        if (badgesToUsers.has(badge)) {
            badgesToUsers.get(badge).push(user);
            continue;
        }

        badgesToUsers.set(badge, [user]);
    }

    return badgesToUsers;
}


const getMostGivenBadge = (badgesToUsers: Map<Icon, User[]>): Icon =>
    Array.from(badgesToUsers.entries()).sort(([, a], [, b]) => b.length - a.length)[0][0];

/*
* One could argue that sorting the entire users array can also be optimized, by determining the top five users
* in the groupBadgesToUsers function directly. However, we're currently dealing with a small amount of users, so
* the performance difference is negligible, at least when factoring in the worse readability (in this particular
* case, at least).
*/
const getTopFiveUsers = (users: User[]): User[] =>
    users.sort((a, b) => b.solutionCount - a.solutionCount).slice(0, 5);

interface UserStatistics {
    userCount: number;
    averageUsersPerBadge: number;
    mostGivenBadge: Icon;
    topFiveUsers: User[];
}

export async function calculateUsersStatistics(): Promise<UserStatistics> {
    const users = await getAllUser();
    const badgesToUsers = await groupBadgesToUsers(users);

    return {
        userCount: users.length,
        averageUsersPerBadge: users.length / badgesToUsers.size,
        mostGivenBadge: getMostGivenBadge(badgesToUsers),
        topFiveUsers: getTopFiveUsers(users)
    };
}

calculateUsersStatistics().then((statistics) => console.log(statistics));

/**
 * Small and naive benchmark to compare the performance of the optimized and unoptimized version of the
 * `groupBadgesToUsers` function.
 *
 * The benchmark is not very accurate, does not warm up the JIT, and does not take into account the time it takes to
 * generate the users. However, it is good enough to get a rough idea of the performance differences between the
 * optimized and unoptimized version.
 */
async function naiveBenchmark() {
    const iterations = 5;

    const start = process.hrtime();

    for (let i = 0; i < iterations; i++) {
        await calculateUsersStatistics();
    }

    const end = process.hrtime(start);

    console.log(`Benchmark took Ø ${end[0] / iterations}s ${end[1] / 1000000 / iterations}ms per iteration`);
}
