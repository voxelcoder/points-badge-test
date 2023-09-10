import {User} from './types/user.interface';
import {Icon} from './types/icon.enum';

/**
 * Returns the correct badge for a user based on their `solution count`.
 *
 * @param user The user to get the badge for.
 *
 * @note This refactor removes the original `switch ( true )` statement and replaces it with a series of `if` statements.
 *       Additionally, the initial null binding to a let variable is removed and a guard clause is prepended to the function.
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