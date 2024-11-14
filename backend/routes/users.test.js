"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

describe('User', () => {
    beforeEach(async () => {
        await db.query("DELETE FROM users");
    });

    afterAll(async () => {
        await db.end();
    });

    describe("GET /users", () => {
        test("works", async () => {
            await User.register({
                username: "testUser",
                firstName: "Test",
                lastName: "User",
                password: "testUser",
                email: "a@b.com"
            });
            const res = await request(app).get("/users");
            expect(res.body).toEqual({ users: expect.any(Array) });
        });
    });

    describe("DELETE /users/:username", () => {
        test("works", async () => {
            await User.register({
                username: "testUser",
                firstName: "Test",
                lastName: "User",
                password: "testUser",
                email: "a@b.com"
            });
            const res = await request(app).delete("/users/testUser");
            const users = await User.getAllUsers();
            expect(users).toEqual([]);
        });
    });

    describe("GET /users/:username", () => {
        test("works", async () => {
            await User.register({
                username: "testUser",
                firstName: "Test",
                lastName: "User",
                password: "testUser",
                email: "a@b.com"
            });
            const res = await request(app).get("/users/testUser");
            expect(res.body).toEqual({
                user: {
                    username: "testUser",
                    firstName: "Test",
                    lastName: "User",
                    email: "a@b.com"
                }
            });
        });
    });
});
