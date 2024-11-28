"use strict";

const express = require("express");
const Bidder = require("../models/bidder");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/:username/:listing_id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const bid = await Bidder.addBid(req.params.username, req.params.listing_id, req.body.bid);
        return res.status(201).json({ bid });
    } catch (err) {
        return next(err);
    }
});

router.get("/by-username/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const bidders = await Bidder.getBidsByBidder(req.params.username);
        return res.json({ bidders });
    } catch (err) {
        return next(err);
    }
});

router.get("/by-listing-id/:listing_id", ensureLoggedIn,async function (req, res, next) {
    try {
        const bidders = await Bidder.getBidsByListingId(req.params.listing_id);
        return res.json({ bidders });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:username/:listing_id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const result = await Bidder.removeBid(req.params.username, req.params.listing_id);
        return res.json({ deleted_bid: result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
