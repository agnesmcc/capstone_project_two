"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const users = await User.getAllUsers();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const user = await User.register(req.body);
        return res.status(201).json({ user });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        await User.delete(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const user = await User.getUser(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

router.get("/:username/watches/:listing_id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const result = await User.isWatching(req.params.username, req.params.listing_id);
        return res.json({ isWatching: result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
