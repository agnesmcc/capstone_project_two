"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Category = require("../models/category");

describe('Category', () => {
    beforeEach(async () => {
        await db.query("DELETE FROM categories");
    });

    afterAll(async () => {
        await db.end();
    });

    describe("POST /categories", () => {
        test("works", async () => {
            const res = await request(app).post("/categories").send({
                name: "test"
            });
            console.log(res.body);
            expect(res.body).toEqual({ category: { title: 'test' } });
        });
    });

    describe("GET /categories", () => {
        test("works", async () => {
            await Category.addCategory("test");
            const res = await request(app).get("/categories");
            console.log(res.body);
            expect(res.body).toEqual({ categories: [ { title: 'test' } ] });
        });
    });

    describe("DELETE /categories", () => {
        test("works", async () => {
            await Category.addCategory("test");
            const res = await request(app).delete("/categories").send({
                name: "test"
            });
            console.log(res.body);
            expect(res.body).toEqual({ deleted: 'test' });
        });
    });
});