"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const Bidder = require("../models/bidder");

const router = express.Router();

router.post("/", async function (req, res, next) {
    try {
        const bid = await Bidder.addBid(req.body.username, req.body.listing_id, req.body.bid);
        return res.status(201).json({ bid });
    } catch (err) {
        return next(err);
    }
});

router.get("/by-username/:username", async function (req, res, next) {
    try {
        const bidders = await Bidder.getBidsByBidder(req.params.username);
        return res.json({ bidders });
    } catch (err) {
        return next(err);
    }
});

router.get("/by-listing-id/:listing_id", async function (req, res, next) {
    try {
        const bidders = await Bidder.getBidsByListingId(req.params.listing_id);
        return res.json({ bidders });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        const result = await Bidder.removeBid(req.params.id);
        return res.json({ deleted_bid: result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
