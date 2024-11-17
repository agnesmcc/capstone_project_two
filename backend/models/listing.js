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
             RETURNING id, created_by, title, description, image, starting_bid, category, created_at, end_datetime`,
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

    static async deleteListing(username, id) {
        const result = await db.query(
            `DELETE FROM listings WHERE created_by = $1 AND id = $2 RETURNING id`,
            [username, id]
        );
        if (result.rows.length === 0) {
            throw new NotFoundError(`No listing: ${id}`);
        }
    }
    
    static async updateListing(username, id, listing) {
        const result = await db.query(
            `UPDATE listings
             SET created_by = $3, title = $4, description = $5, image = $6, starting_bid = $7, category = $8, end_datetime = $9
             WHERE created_by = $1 AND id = $2
             RETURNING id, created_by, title, description, image, starting_bid, category, end_datetime`,
            [username, id, listing.created_by, listing.title, listing.description, listing.image, listing.starting_bid, listing.category, listing.end_datetime]
        );
        if (result.rows.length === 0) {
            throw new NotFoundError(`No listing: ${id}`);
        }
        return result.rows[0];
    }

    static async getListingsByCreatedBy(created_by) {
        const result = await db.query(
            `SELECT * FROM listings WHERE created_by = $1`,
            [created_by]
        )
        return result.rows;
    }
}

module.exports = Listing;
