"use strict";

const express = require("express");
const WatchedListing = require("../models/watchedListing");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/by-username/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const watchedListing = await WatchedListing.addWatchedListing(req.params.username, req.body.listing_id);
        return res.status(201).json({ watchedListing });
    } catch (err) {
        return next(err);
    }
});

router.get("/by-username/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const watchedListings = await WatchedListing.getWatchedListingsByUsername(req.params.username);
        return res.json({ watchedListings });
    } catch (err) {
        return next(err);
    }
});

router.delete("/by-username/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const removeWatchedListing = await WatchedListing.removeWatchedListing(req.params.username, req.body.listing_id);
        return res.json({ deleted: removeWatchedListing });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
