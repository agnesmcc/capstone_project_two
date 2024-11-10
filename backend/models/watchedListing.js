"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class WatchedListing {
    static async getWatchedListingsByUsername(username) {
        const result = await db.query(
            `SELECT username, listing_id
             FROM watched_listings
             WHERE username = $1`,
            [username]
        );
        return result.rows;
    }

    static async getWatchedListingsByListingId(listing_id) {
        const result = await db.query(
            `SELECT username, listing_id
             FROM watched_listings
             WHERE listing_id = $1`,
            [listing_id]
        );
        return result.rows;
    }

    static async addWatchedListing(username, listing_id) {
        const result = await db.query(
            `INSERT INTO watched_listings (username, listing_id) VALUES ($1, $2) 
            RETURNING username, listing_id`,
            [username, listing_id]
        );
        return result.rows[0];
    }

    static async removeWatchedListing(username, listing_id) {
        const result = await db.query(
            `DELETE FROM watched_listings WHERE username = $1 AND listing_id = $2 RETURNING username, listing_id`,
            [username, listing_id]
        );
        return result.rows[0];
    }
}

module.exports = WatchedListing;
