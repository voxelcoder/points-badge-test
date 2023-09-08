import {User} from './types/user.interface';
import {Icon} from './types/icon.enum';

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

function calculateUsersStatistics() {
  // todo
}

calculateUsersStatistics();
