import {User} from './types/user.interface';
import {Icon} from './types/icon.enum';

/**
 * A map of minimum solution counts to badge icons.
 */
const solutionCountsToIcons: [number, Icon][] = [
    [5, Icon.BADGE_BRONZE],
    [25, Icon.BADGE_SILVER],
    [50, Icon.BADGE_GOLD]
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

// Note, we could also make it async like this:
export const getUsersBadgeWithoutAsyncKeyword = (user: User): Promise<Icon | null> =>
    new Promise((resolve) => {
        for (const [count, icon] of solutionCountsToIconsDescending) {
            if (user.solutionCount >= count) {
                resolve(icon);
            }
        }

        resolve(null);
    });
