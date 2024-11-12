"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const Listing = require("../models/listing");

const router = express.Router();

router.post("/", async function (req, res, next) {
    try {
        console.log(req.body);
        const listing = await Listing.addListing(req.body);
        console.log(listing.end_datetime);
        return res.status(201).json({ listing });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async function (req, res, next) {
    try {
        const listings = await Listing.getAllListings();
        return res.json({ listings });
    } catch (err) {
        return next(err);
    }
});

router.delete("/", async function (req, res, next) {
    try {
        await Listing.deleteListing(req.body.id);
        return res.json({ deleted: req.body.id });
    } catch (err) {
        return next(err);
    }
});

router.put("/", async function (req, res, next) {
    try {
        const listing = await Listing.updateListing(req.body.id, req.body);
        return res.json({ listing });
    } catch (err) {
        return next(err);
    }
});

router.get("/created_by/:created_by", async function (req, res, next) {
    try {
        const listings = await Listing.getListingsByCreatedBy(req.params.created_by);
        return res.json({ listings });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;
