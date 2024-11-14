"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken} = require("../helpers/tokens");

const router = express.Router();

router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});

router.post("/register", async function (req, res, next) {
    try {
        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
