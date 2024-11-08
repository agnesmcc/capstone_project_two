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