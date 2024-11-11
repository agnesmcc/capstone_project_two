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

    describe("POST /users/register", () => {
        test("works", async () => {
            const res = await request(app).post("/users/register").send({
                username: "testUser",
                firstName: "Test",
                lastName: "User",
                password: "testUser",
                email: "a@b.com"
            });
            expect(res.statusCode).toEqual(201);
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

    describe("POST /users/login", () => {
        test("works", async () => {
            await User.register({
                username: "testUser",
                firstName: "Test",
                lastName: "User",
                password: "testUser",
                email: "a@b.com"
            });
            const res = await request(app).post("/users/login").send({
                username: "testUser",
                password: "testUser"
            });
            expect(res.statusCode).toEqual(200);
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
