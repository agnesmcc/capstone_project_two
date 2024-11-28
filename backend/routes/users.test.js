"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");
const WatchedListing = require("../models/watchedListing");
const Listing = require("../models/listing");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token,
    adminToken,
} = require("./_testCommon");

let listingId;

beforeAll(async () => {
    await commonBeforeAll();
    const listings = await Listing.getListingsByCreatedBy("u1");
    listingId = listings[0].id;
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('User', () => {
    // GET /users
    describe("GET /users", () => {
        test("works with admin token", async () => {
            const res = await request(app)
                .get("/users")
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toEqual({ users: expect.any(Array) });
        });

        test("unauth with non-admin token", async () => {
            const res = await request(app)
                .get("/users")
                .set({ Authorization: `Bearer ${u2Token}` });
            expect(res.statusCode).toEqual(401);
        });
    });

    // POST /users
    describe("POST /users", () => {
        test("works with admin token", async () => {
            const res = await request(app)
                .post("/users")
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    username: "u4",
                    firstName: "u4F",
                    lastName: "u4L",
                    email: "user4@user.com",
                    password: "user4Password"
                });
            expect(res.body).toEqual({ user: expect.any(Object) });
            const users = await User.getAllUsers();
            expect(users.length).toEqual(4);
        });

        test("unauth with non-admin token", async () => {
            const res = await request(app)
                .post("/users")
                .set({ Authorization: `Bearer ${u2Token}` })
                .send({
                    username: "u4",
                    firstName: "u4F",
                    lastName: "u4L",
                    email: "user4@user.com",
                    password: "user4Password"
                });
            expect(res.statusCode).toEqual(401);
        });

        test("fails to register with duplicate username", async () => {
            const res = await request(app)
                .post("/users")
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    username: "u1",
                    firstName: "U1F",
                    lastName: "U1L",
                    email: "user1@user.com",
                    password: "user1Password"
                });
            expect(res.statusCode).toEqual(400);
        });

        test("fails to register with missing password", async () => {
            const res = await request(app)
                .post("/users")
                .set({ Authorization: `Bearer ${adminToken}` })
                .send({
                    username: "u4",
                    firstName: "u4F",
                    lastName: "u4L",
                    email: "user4@user.com"
                });
            expect(res.statusCode).toEqual(400);
        });
    });

    // DELETE /users/:username
    describe("DELETE /users/:username", () => {
        test("works with admin token", async () => {
            const res = await request(app)
                .delete("/users/u1")
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toEqual({ deleted: "u1" });
            const users = await User.getAllUsers();
            expect(users.length).toEqual(2);
        });

        test("fail to delete non-existing user", async () => {
            const res = await request(app)
                .delete("/users/u4")
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.statusCode).toEqual(404);
        });

        test("works with matching user token", async () => {
            const res = await request(app)
                .delete("/users/u1")
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toEqual({ deleted: "u1" });
            const users = await User.getAllUsers();
            expect(users.length).toEqual(2);
        });

        test("unauth with non-admin token", async () => {
            const res = await request(app)
                .delete("/users/u1")
                .set({ Authorization: `Bearer ${u2Token}` });
            expect(res.statusCode).toEqual(401);
        });

        test("unauth with no token", async () => {
            const res = await request(app).delete("/users/u1");
            expect(res.statusCode).toEqual(401);
        });
    });

    // GET /users/:username
    describe("GET /users/:username", () => {
        test("works with admin token", async () => {
            const res = await request(app)
                .get("/users/u1")
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toEqual({
                user: {
                    username: "u1",
                    firstName: "U1F",
                    lastName: "U1L",
                    email: "user1@user.com"
                }
            });
        });

        test("fail to get non-existing user", async () => {
            const res = await request(app)
                .get("/users/u4")
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.statusCode).toEqual(404);
        });

        test("works with matching user token", async () => {
            const res = await request(app)
                .get("/users/u1")
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toEqual({
                user: {
                    username: "u1",
                    firstName: "U1F",
                    lastName: "U1L",
                    email: "user1@user.com"
                }
            });
        });

        test("unauth with non-admin token", async () => {
            const res = await request(app)
                .get("/users/u1")
                .set({ Authorization: `Bearer ${u2Token}` });
            expect(res.statusCode).toEqual(401);
        });

        test("unauth with no token", async () => {
            const res = await request(app).get("/users/u1");
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /:username/watches/:listingId", () => {
        test("works with admin token", async () => {
            await WatchedListing.addWatchedListing("u1", listingId);
            const res = await request(app)
                .get(`/users/u1/watches/${listingId}`)
                .set({ Authorization: `Bearer ${adminToken}` });
            expect(res.body).toEqual({ isWatching: true });
        });

        test("works with matching user", async () => {
            await WatchedListing.addWatchedListing("u1", listingId);
            const res = await request(app)
                .get(`/users/u1/watches/${listingId}`)
                .set({ Authorization: `Bearer ${u1Token}` });
            expect(res.body).toEqual({ isWatching: true });
        })

        test("unauth with not matching token", async () => {
            await WatchedListing.addWatchedListing("u1", listingId);
            const res = await request(app)
                .get(`/users/u1/watches/${listingId}`)
                .set({ Authorization: `Bearer ${u2Token}` });
            expect(res.statusCode).toEqual(401);
        })
    });
});
