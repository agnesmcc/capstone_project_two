"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, NotFoundError } = require("../expressError");

class Listing {
    static async getAllListings() {
        const result = await db.query(`SELECT * FROM listings`);
        return result.rows;
    }

    static async addListing(listing) {
        const result = await db.query(
            `INSERT INTO listings (
                created_by, title, description, image, starting_bid, category, end_datetime
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, created_by, title, description, image, starting_bid, category, end_datetime`,
            [listing.created_by, listing.title, listing.description, listing.image, listing.starting_bid, listing.category, listing.end_datetime]
        );
        return result.rows[0];
    }

    static async getListing(id) {
        const result = await db.query(
            `SELECT * FROM listings WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async deleteListing(id) {
        const result = await db.query(
            `DELETE FROM listings WHERE id = $1 RETURNING id`,
            [id]
        );
        if (result.rows.length === 0) {
            throw new NotFoundError(`No listing: ${id}`);
        }
    }
    
    static async updateListing(id, listing) {
        const result = await db.query(
            `UPDATE listings
             SET created_by = $2, title = $3, description = $4, image = $5, starting_bid = $6, category = $7, end_datetime = $8
             WHERE id = $1
             RETURNING id, created_by, title, description, image, starting_bid, category, end_datetime`,
            [id, listing.created_by, listing.title, listing.description, listing.image, listing.starting_bid, listing.category, listing.end_datetime]
        );
        if (result.rows.length === 0) {
            throw new NotFoundError(`No listing: ${id}`);
        }
        return result.rows[0];
    }

    static async getListingByCreatedBy(created_by) {
        const result = await db.query(
            `SELECT * FROM listings WHERE created_by = $1`,
            [created_by]
        )
        return result.rows[0];
    }
}

module.exports = Listing;
