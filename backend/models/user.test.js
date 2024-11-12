"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const User = require("./user.js");

beforeEach(async () => {
    await db.query("DELETE FROM users");
});

afterAll(async () => {
    await db.end();
});

describe("User", () => {
    test("works: no users", async () => {
        const result = await User.getAllUsers();
        expect(result).toEqual([]);
    });

    test("can register a user", async () => {
        const result = await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        expect(result).toEqual({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            email: "test@test"
        });
    });

    test("can authenticate a user", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        const result = await User.authenticate("testUser", "p@ssword");
        expect(result).toEqual({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            email: "test@test"
        });
    });

    test("fails to authenticate a user with wrong password", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        expect(async () => {
            await User.authenticate("testUser", "wrongPassword");
        }).rejects.toThrow(BadRequestError);
    });

    test("fails to authenticate a user that doesn't exist", async () => {
        expect(async () => {
            await User.authenticate("testUser", "p@ssword");
        }).rejects.toThrow(NotFoundError);
    });

    test("can delete a user", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        await User.delete("testUser");
        const result = await User.getAllUsers();
        expect(result).toEqual([]);
    });

    test("fails to delete a user that doesn't exist", async () => {
        expect(async () => {
            await User.delete("testUser");
        }).rejects.toThrow(NotFoundError);
    });

    test("can get a user", async () => {
        await User.register({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            password: "p@ssword",
            email: "test@test"
        });
        const result = await User.getUser("testUser");
        expect(result).toEqual({
            username: "testUser",
            firstName: "first",
            lastName: "last",
            email: "test@test"
        });
    });
})