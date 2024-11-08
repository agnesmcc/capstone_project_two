"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Category {
    static async getCategories() {
        const result = await db.query(`SELECT * FROM categories`);
        return result.rows;
    }

    static async addCategory(title) {
        const result = await db.query(
            `INSERT INTO categories (title) VALUES ($1) RETURNING title`,
            [title]
        );
        return result.rows[0];
    }

    static async deleteCategory(title) {
        const result = await db.query(
            `DELETE FROM categories WHERE title = $1 RETURNING title`,
            [title]
        );
        if (result.rows.length === 0) {
            throw new NotFoundError(`No category: ${title}`);
        }
    }
}

module.exports = Category;
