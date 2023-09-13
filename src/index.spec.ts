import {calculateUsersStatistics, getUsersBadge} from './index';
import {Icon} from './types/icon.enum';
import {User} from './types/user.interface';
import {getAllUser} from "./user-store";

describe('getUsersBadge', () => {
    const timeout = 12_000; // 12 Seconds

    it(`get God Like`, async function () {
        const badges = await Promise.all([
            getUsersBadge(getUserMock(2000)),
            getUsersBadge(getUserMock(2500)),
            getUsersBadge(getUserMock(3141)),
        ]);

        badges.forEach(badge => expect(badge).toEqual(Icon.BADGE_GOD_LIKE));
    }, timeout);

    it(`get Platinum`, async function () {
        const badges = await Promise.all([
            getUsersBadge(getUserMock(100)),
            getUsersBadge(getUserMock(500)),
            getUsersBadge(getUserMock(1999)),
        ]);

        badges.forEach(badge => expect(badge).toEqual(Icon.BADGE_PLATINUM));
    }, timeout);

    it(`get Gold`, async function () {
        const badges = await Promise.all([
            getUsersBadge(getUserMock(50)),
            getUsersBadge(getUserMock(75)),
            getUsersBadge(getUserMock(99)),
        ]);

        badges.forEach(badge => expect(badge).toEqual(Icon.BADGE_GOLD));
    }, timeout);

    it(`get Silver`, async function () {
        const badges = await Promise.all([
            getUsersBadge(getUserMock(25)),
            getUsersBadge(getUserMock(49)),
            getUsersBadge(getUserMock(30)),
        ]);

        badges.forEach(badge => expect(badge).toEqual(Icon.BADGE_SILVER));
    }, timeout);

    it(`get Bronze`, async function () {
        const badges = await Promise.all([
            getUsersBadge(getUserMock(5)),
            getUsersBadge(getUserMock(24)),
            getUsersBadge(getUserMock(10)),
        ]);

        badges.forEach(badge => expect(badge).toEqual(Icon.BADGE_BRONZE));
    }, timeout);

    it(`get Starter`, async function () {
        const badges = await Promise.all([
            getUsersBadge(getUserMock(1)),
            getUsersBadge(getUserMock(3)),
            getUsersBadge(getUserMock(4)),
        ]);

        badges.forEach(badge => expect(badge).toEqual(Icon.BADGE_STARTER));
    }, timeout);

    it(`get Bad Ass`, async function () {
        const [firstBadge, secondBadge] = await Promise.all([
            getUsersBadge(getUserMock(0)),
            getUsersBadge(getUserMock(1))
        ])

        expect(firstBadge).toEqual(Icon.BADGE_BAD_ASS);
        expect(secondBadge).not.toEqual(Icon.BADGE_BAD_ASS);
    }, timeout);

    it(`get no Icon`, async function () {
        const badges = await Promise.all([
            getUsersBadge(getUserMock(-100)),
            getUsersBadge(getUserMock(-1)),
        ]);

        badges.forEach(badge => expect(badge).toEqual(null))
    }, timeout);
});

describe("calculateUsersStatistics", () => {
    const testUsers = [
        getUserMock(1),
        getUserMock(34),
        getUserMock(45),
        getUserMock(199),
        getUserMock(205),
        getUserMock(500),
        getUserMock(2000),
        getUserMock(2500),
    ];

    const store = jest.requireActual("./user-store");
    jest.spyOn(store, "getAllUser").mockResolvedValue(testUsers);

    const timeout = 12_000; // 12 Seconds

    it("returns the correct user count", async () => {
        const {userCount} = await calculateUsersStatistics();
        expect(userCount).toEqual(8);
    }, timeout);

    it("calculates the correct average users per badge", async () => {
        const {averageUsersPerBadge} = await calculateUsersStatistics();
        expect(averageUsersPerBadge).toEqual(2);
    }, timeout);

    it("gets the most given badge", async () => {
        const {mostGivenBadge} = await calculateUsersStatistics();
        expect(mostGivenBadge).toEqual(Icon.BADGE_PLATINUM);
    }, timeout);

    it("determines the top five users", async () => {
        const {topFiveUsers} = await calculateUsersStatistics();

        expect(topFiveUsers.map(user => user.solutionCount)).toEqual([
            2500,
            2000,
            500,
            205,
            199
        ]);
    }, timeout);
})

function getUserMock(count: number): User {
    return {
        id: '___',
        username: '___',
        solutionCount: count
    };
}
