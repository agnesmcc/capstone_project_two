"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const Listing = require("../models/listing");
const { ensureLoggedIn, ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const listing = await Listing.addListing(req.body);
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

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        await Listing.deleteListing(req.params.username, req.body.id);
        return res.json({ deleted: req.body.id });
    } catch (err) {
        return next(err);
    }
});

router.put("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const listing = await Listing.updateListing(req.params.username, req.body.id, req.body);
        return res.json({ listing });
    } catch (err) {
        return next(err);
    }
});

router.get("/created_by/:username", async function (req, res, next) {
    try {
        const listings = await Listing.getListingsByCreatedBy(req.params.username);
        return res.json({ listings });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;
