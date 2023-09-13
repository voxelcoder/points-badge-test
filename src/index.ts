import {User} from './types/user.interface';
import {Icon} from './types/icon.enum';
import {getAllUser} from "./user-store";
import {emulateLongProcess} from "./emulate-long-process";

/**
 * A minimum solution count required to get a badge.
 */
type MinimumSolutionCount = number;

/**
 * Stores how many solutions a user needs to get a specific badge.
 */
const solutionCountsToIcons: [MinimumSolutionCount, Icon][] = [
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
 * Represents a badge given to a user. Can be null, since the users solution count might not warrant one
 * in the first place.
 */
type Badge = Icon | null;

/**
 * Returns the correct badge for a user based on their `solution count`.
 *
 * @param user The user to get the badge for.
 */
export const getUsersBadge = async (user: User): Promise<Badge> => {
    await emulateLongProcess();

    for (const [count, icon] of solutionCountsToIconsDescending) {
        if (user.solutionCount >= count) {
            return icon;
        }
    }

    return null;
}

type BadgeToUsersMap = Map<Badge, User[]>;

/**
 * Groups users by their badge. Only badges that are given out to the users in the array are contained in the map.
 *
 * @param users The users to group.
 */
async function groupBadgesToUsers(users: User[]): Promise<BadgeToUsersMap> {
    const badgesToUsers: BadgeToUsersMap = new Map();
    const badges = await Promise.all(users.map(getUsersBadge));

    for (let index = 0; index < badges.length; index++) {
        const badge = badges[index];
        const user = users[index];

        if (!badgesToUsers.has(badge)) {
            badgesToUsers.set(badge, [user]);
            continue;
        }

        badgesToUsers.get(badge)!.push(user);
    }

    return badgesToUsers;
}


interface UserStatistics {
    userCount: number;
    averageUsersPerBadge: number;
    mostGivenBadge: Badge;
    topFiveUsers: User[];
}

const getMostGivenBadge = (badgesToUsers: BadgeToUsersMap): Badge =>
    Array.from(badgesToUsers.entries()).sort(([, a], [, b]) => b.length - a.length)[0][0];

const getTopUsers = (users: User[], take: number): User[] =>
    users.sort((a, b) => b.solutionCount - a.solutionCount).slice(0, take);

export async function calculateUsersStatistics(): Promise<UserStatistics> {
    const users = await getAllUser();
    const badgesToUsers = await groupBadgesToUsers(users);

    return {
        userCount: users.length,
        averageUsersPerBadge: users.length / badgesToUsers.size,
        mostGivenBadge: getMostGivenBadge(badgesToUsers),
        topFiveUsers: getTopUsers(users, 5)
    };
}

// calculateUsersStatistics().then((statistics) => console.log(statistics));
