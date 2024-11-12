"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Bidder {
    static async getBidsByListingId(listing_id) {
        const result = await db.query(
            `SELECT *
             FROM bidders
             WHERE listing_id = $1`,
            [listing_id]
        );
        return result.rows;
    }

    static async getBidsByBidder(username) {
        const result = await db.query(
            `SELECT *
             FROM bidders
             WHERE bidder = $1`,
            [username]
        );
        return result.rows;
    }

    static async addBid(bidder, listing_id, bid) {
        const result = await db.query(
            `INSERT INTO bidders (bidder, listing_id, bid) VALUES ($1, $2, $3) 
            RETURNING id, bidder, listing_id, bid`,
            [bidder, listing_id, bid]
        );
        return result.rows[0];
    }

    static async removeBid(id) {
        const result = await db.query(
            `DELETE FROM bidders WHERE id = $1 RETURNING id, bidder, listing_id`,
            [id]
        );
        return result.rows[0];
    }
}

module.exports = Bidder;
