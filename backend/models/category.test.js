"use strict";

const { text } = require("express");
const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Category = require("./category.js");

beforeEach(async () => {
    await db.query("DELETE FROM categories");
});

afterAll(async () => {
    await db.end();
});

describe("Category", () => {
    test("works: no categories", async () => {
        const result = await Category.getCategories();
        expect(result).toEqual([]);
    });

    test("works: one category", async () => {
        await Category.addCategory("test");
        const result = await Category.getCategories();
        expect(result).toEqual([{
            title: "test"
        }]);
    })

    test("can add a category", async () => {
        const result = await Category.addCategory("test");
        expect(result.title).toEqual("test");
    });

    test("can delete a category", async () => {
        await Category.addCategory("test");
        await Category.deleteCategory("test");
        const result = await Category.getCategories();
        expect(result).toEqual([]); 
    });
});

