"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");

const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        const users = await User.getAllUsers();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

router.post("/register", async function (req, res, next) {
    try {
        const user = await User.register(req.body);
        return res.status(201).json({ user });
    } catch (err) {
        return next(err);
    }
});

router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:username", async function (req, res, next) {
    try {
        await User.delete(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});

router.get("/:username", async function (req, res, next) {
    try {
        const user = await User.getUser(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;