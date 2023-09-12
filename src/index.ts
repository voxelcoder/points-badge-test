import {User} from './types/user.interface';
import {Icon} from './types/icon.enum';
import {getAllUser} from "./user-store";


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
    const badgesToUsers = new Map();

    for (const user of users) {
        const badge = await getUsersBadge(user);

        if (badgesToUsers.has(badge)) {
            badgesToUsers.get(badge).push(user);
            continue;
        }

        badgesToUsers.set(badge, [user]);
    }

    return badgesToUsers;
}

interface UserStatistics {
    userCount: number;
    averageUsersPerBadge: number;
    mostGivenBadge: Icon;
    topFiveUsers: User[];
}

const getMostGivenBadge = (badgesToUsers: Map<Icon, User[]>): Icon => Array.from(badgesToUsers.entries()).sort(([, a], [, b]) => b.length - a.length)[0][0];

const getTopFiveUsers = (users: User[]): User[] => users.sort((a, b) => b.solutionCount - a.solutionCount).slice(0, 5);

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
