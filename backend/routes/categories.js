"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const Category = require("../models/category");

const router = express.Router();

router.post("/", async function (req, res, next) {
    try {
        const category = await Category.addCategory(req.body.name);
        return res.status(201).json({ category });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async function (req, res, next) {
    try {
        const categories = await Category.getCategories();
        return res.json({ categories });
    } catch (err) {
        return next(err);
    }
});

router.delete("/", async function (req, res, next) {
    try {
        await Category.deleteCategory(req.body.name);
        return res.json({ deleted: req.body.name });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
