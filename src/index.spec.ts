import { getUsersBadge } from './index';
import { Icon } from './types/icon.enum';
import { User } from './types/user.interface';

describe('getUsersBadge', () => {

  it(`get Gold`, async function () {
    expect(await getUsersBadge(getUserMock(100))).toEqual(Icon.BADGE_GOLD);
    expect(await getUsersBadge(getUserMock(50))).toEqual(Icon.BADGE_GOLD);
    expect(await getUsersBadge(getUserMock(1000000))).toEqual(Icon.BADGE_GOLD);
  });

  it(`get Silver`, async function () {
    expect(await getUsersBadge(getUserMock(25))).toEqual(Icon.BADGE_SILVER);
    expect(await getUsersBadge(getUserMock(49))).toEqual(Icon.BADGE_SILVER);
    expect(await getUsersBadge(getUserMock(30))).toEqual(Icon.BADGE_SILVER);
  });

  it(`get Bronze`, async function () {
    expect(await getUsersBadge(getUserMock(5))).toEqual(Icon.BADGE_BRONZE);
    expect(await getUsersBadge(getUserMock(24))).toEqual(Icon.BADGE_BRONZE);
    expect(await getUsersBadge(getUserMock(10))).toEqual(Icon.BADGE_BRONZE);
  });

  it(`get no Icon`, async function () {
    expect(await getUsersBadge(getUserMock(4))).toEqual(null);
    expect(await getUsersBadge(getUserMock(-100))).toEqual(null);
    expect(await getUsersBadge(getUserMock(0))).toEqual(null);
  });

});

function getUserMock(count: number): User {
  return {
    id: '___',
    username: '___',
    solutionCount: count
  };
}
