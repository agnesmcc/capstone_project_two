"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Category = require("../models/category");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('Category', () => {
    describe("POST /categories", () => {
        test("works with admin token", async () => {
            const res = await request(app).post("/categories")
                .send({name: "test"})
                .set({ Authorization: `Bearer ${adminToken}` });
            console.log(res.body);
            expect(res.body).toEqual({ category: { title: 'test' } });
        });

        test("unauthorized without admin token", async () => {
            const res = await request(app).post("/categories")
                .send({name: "test"});
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /categories", () => {
        test("works", async () => {
            const res = await request(app).get("/categories");
            console.log(res.body);
            expect(res.body).toEqual({ categories: [ { title: 'furniture' } ] });
        });
    });

    describe("DELETE /categories", () => {
        test("works with admin token", async () => {
            await Category.addCategory("test");
            const res = await request(app).delete("/categories")
                .send({name: "test"})
                .set({ Authorization: `Bearer ${adminToken}` });
            console.log(res.body);
            expect(res.body).toEqual({ deleted: 'test' });
        });

        test("unauthorized without admin token", async () => {
            const res = await request(app).delete("/categories")
                .send({name: "test"});
            expect(res.statusCode).toEqual(401);
        });
    });
});