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
        await db.query("DELETE FROM users");
        await db.end();
    });

    describe("POST /auth/register", () => {
        test("works", async () => {
            const res = await request(app).post("/auth/register").send({
                username: "testUser",
                firstName: "Test",
                lastName: "User",
                password: "testUser",
                email: "a@b.com"
            });
            expect(res.body).toEqual({ token: expect.any(String) });
        });
    });

    describe("POST /auth/login", () => {
        test("works", async () => {
            await User.register({
                username: "testUser",
                firstName: "Test",
                lastName: "User",
                password: "testUser",
                email: "a@b.com"
            });
            const res = await request(app).post("/auth/login").send({
                username: "testUser",
                password: "testUser"
            });
            expect(res.body).toEqual({ token: expect.any(String) });
        });
    });
});
