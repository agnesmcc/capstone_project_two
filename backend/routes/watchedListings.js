"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const WatchedListing = require("../models/watchedListing");

const router = express.Router();

router.post("/", async function (req, res, next) {
    try {
        const watchedListing = await WatchedListing.addWatchedListing(req.body.username, req.body.listing_id);
        return res.status(201).json({ watchedListing });
    } catch (err) {
        return next(err);
    }
});

router.get("/by-username/:username", async function (req, res, next) {
    try {
        const watchedListings = await WatchedListing.getWatchedListingsByUsername(req.params.username);
        return res.json({ watchedListings });
    } catch (err) {
        return next(err);
    }
});

router.get("/by-listing-id/:listing_id", async function (req, res, next) {
    try {
        const watchedListings = await WatchedListing.getWatchedListingsByListingId(req.params.listing_id);
        return res.json({ watchedListings });
    } catch (err) {
        return next(err);
    }
});

router.delete("/", async function (req, res, next) {
    try {
        await WatchedListing.removeWatchedListing(req.body.username, req.body.listing_id);
        return res.json({ deleted: req.body });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
