"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { LISTING_DURATION_SECONDS, JOB_QUEUE, PG_BOSS_ENABLED } = require("../config");
const { boss } = require('../pgBoss');
console.log(boss);

class Listing {
    static async getAllListings() {
        const result = await db.query(`SELECT * FROM listings`);
        return result.rows;
    }

    static async addListing(listing, listingDuration=LISTING_DURATION_SECONDS) {
        const endDatetime = new Date();
        endDatetime.setTime(endDatetime.getTime() + listingDuration * 1000);

        const result = await db.query(
            `INSERT INTO listings (
                created_by, title, description, image, starting_bid, category, end_datetime
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, created_by, title, description, image, starting_bid, category, created_at, end_datetime`,
            [listing.created_by, listing.title, listing.description, listing.image, listing.starting_bid, listing.category, endDatetime]
        );

        console.log(process.env.PG_BOSS_ENABLED);
        if (PG_BOSS_ENABLED === true && result.rows.length > 0) {
            console.log(result.rows[0]);
            const jobId = await boss.sendAfter('listingsToEnd', {listingId: result.rows[0].id}, {}, listingDuration * 1000);
            console.log(`created job ${jobId} in queue ${JOB_QUEUE}`)
        }

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
             SET created_by = $3, title = $4, description = $5, image = $6, starting_bid = $7, category = $8
             WHERE created_by = $1 AND id = $2
             RETURNING id, created_by, title, description, image, starting_bid, category, end_datetime`,
            [username, id, listing.created_by, listing.title, listing.description, listing.image, listing.starting_bid, listing.category]
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

    static async getWatchedListingsByUsername(username) {
        const result = await db.query(
            `SELECT l.*
             FROM watched_listings wl
             JOIN listings l ON wl.listing_id = l.id
             WHERE wl.username = $1`,
            [username]
        )
        return result.rows;
    }

    static async determineWinner(listingId) {
        const bidder = await db.query(
            `SELECT bidder
             FROM bidders
             WHERE listing_id = $1
             ORDER BY bid DESC, created_at ASC
             LIMIT 1`,
            [listingId]
        )
        let result;
        if (bidder.rows.length > 0) {
            result = await db.query(
                `UPDATE listings
                 SET winner = $2, ended = true
                 WHERE id = $1
                 RETURNING id, created_by, title, description, image, starting_bid, category, end_datetime, winner, ended`,
                [listingId, bidder.rows[0].bidder]
            )
        } else {
            result = await db.query(
                `UPDATE listings
                 SET ended = true
                 WHERE id = $1
                 RETURNING id, created_by, title, description, image, starting_bid, category, end_datetime, winner, ended`,
                [listingId]
            )
        }
        return result.rows[0];
    }
}

module.exports = Listing;
