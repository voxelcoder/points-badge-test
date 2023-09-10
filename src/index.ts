import {User} from './types/user.interface';
import {Icon} from './types/icon.enum';

// -- Variant 1

/**
 * Returns the correct badge for a user based on their `solution count`.
 *
 * @param user The user to get the badge for.
 *
 * @note This refactor removes the original `switch ( true )` statement and replaces it with a series of `if` statements.
 *       Additionally, the initial null binding to a let variable is removed and a guard clause is prepended to
 *       the function.
 */
export const getUsersBadge = ( user: User ): Icon | null => {
  if ( user.solutionCount < 5 ) {
    return null;
  }

  if ( user.solutionCount < 25 ) {
    return Icon.BADGE_BRONZE;
  }

  if ( user.solutionCount < 50 ) {
    return Icon.BADGE_SILVER;
  }

  return Icon.BADGE_GOLD;
}

// -- Variant 2: Using a "Map" (or map-like structure)

/**
 * A map of minimum solution counts to badge icons.
 *
 * @note This map allows us to easily extend badge levels without having to modify the `getUsersBadge` function. We use
 *       an array of tuples here, but one could also read these entries from a configuration file, database, what have
 *       you.
 *
 *       A `Map` would also be suitable for this, and for this variant wouldn't make any difference. If we decide to use
 *       array methods on the entries though, we'd have to convert the `Map` to an array first. This is why I chose to
 *       skip it here.
 */
const solutionCountsToIcons: [ number, Icon ][] = [
  [ 5, Icon.BADGE_BRONZE ],
  [ 25, Icon.BADGE_SILVER ],
  [ 50, Icon.BADGE_GOLD ]
];

/**
 * Returns the correct badge for a user based on their `solution count`.
 *
 * @param user The user to get the badge for.
 *
 * @note This refactor removes the need for adding manual `if` statements to the function. Instead, we iterate over the
 *      `solutionCountsToIcons` map and return the appropriate badge icon. This is especially useful if we decide to add more
 *      badge levels, apart from saving us from writing repetitive code.
 */
export const getUsersBadgeFromMap = ( user: User ): Icon | null => {
  let badge: Icon | null = null;

  for ( const [ count, icon ] of solutionCountsToIcons ) {
    if ( user.solutionCount >= count ) {
      badge = icon;
    }
  }

  return badge;
}

// Variant 2.1: Early return from the loop, and removing let binding.

const solutionCountsToIconsDescending = [...solutionCountsToIcons].reverse();

/**
 * Returns the correct badge for a user based on their `solution count`.
 *
 * @param user The user to get the badge for.
 *
 * @note This refactor removes the need for adding manual `if` statements to the function. Instead, we iterate over the
 *       `solutionCountsToIconsDescending` map and return the appropriate badge icon. This requires us to reverse the
 *       order of the entries in the map, such that we can return the first match.
 *
 *       Personally, I like this variant the most, as it strikes a good balance between readability and conciseness.
 */
export const getUsersBadgeFromMapWithEarlyReturn = ( user: User ): Icon | null => {
    for ( const [ count, icon ] of solutionCountsToIconsDescending ) {
        if ( user.solutionCount >= count ) {
          return icon;
        }
    }

    return null;
}

// Variant 3: Using array methods

/**
 * Returns the correct badge for a user based on their `solution count`.
 *
 * @param user The user to get the badge for.
 *
 * @note This refactor makes use of array methods to find the correct badge icon. This is (theoretically) worse in terms
 *       of performance than the previous variants, but it is a good example of how to use array methods to solve this
 *       problem.
 */
export const getUsersBadgeFromMapWithFilter = ( user: User ): Icon | null =>
    solutionCountsToIcons.filter(( [count,] ) => user.solutionCount >= count ).pop()?.[1] ?? null;

/**
 * Returns the correct badge for a user based on their `solution count`.
 *
 * @param user The user to get the badge for.
 *
 * @note Instead of using `filter` and `pop`, we can also use `reduce` to find the correct badge icon. Though this, and
 *       the previous variant, hurt readability in my opinion - for this specific problem, at least.
 */
export const getUsersBadgeFromMapWithReduce = ( user: User ): Icon | null =>
    solutionCountsToIcons.reduce( ( newBadge: Icon, [count, icon] ) => user.solutionCount < count ? newBadge : icon, null );
