"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const Category = require("../models/category");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const category = await Category.addCategory(req.body.name);
        return res.status(201).json({ category });
    } catch (err) {
        return next(err);
    }
});

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const categories = await Category.getCategories();
        return res.json({ categories });
    } catch (err) {
        return next(err);
    }
});

router.delete("/", ensureAdmin, async function (req, res, next) {
    try {
        await Category.deleteCategory(req.body.name);
        return res.json({ deleted: req.body.name });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
