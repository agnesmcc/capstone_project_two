"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Listing = require("./listing.js");
const Category = require("./category.js");

const testListing = {
    created_by: "testUser",
    title: "My Test Listing",
    description: "a nice couch",
    image: "couch.jpg",
    starting_bid: "500.00",
    category: "furniture",
    end_datetime: new Date('2022-01-01T05:00:00.000Z')
};

beforeEach(async () => {
    await db.query("DELETE FROM listings");
    await db.query("DELETE FROM categories");
});

afterAll(async () => {
    await db.end();
});

describe("Listing", () => {
    test("works: no listings", async () => {
        const result = await Listing.getAllListings();
        expect(result).toEqual([]);
    });
    
    test("can add a listing", async () => {
        await Category.addCategory("furniture");
        let result = await Listing.addListing(testListing);
        result = await Listing.getAllListings();
        expect(result).toMatchObject([testListing]);
    });

    test("can get a listing", async () => {
        await Category.addCategory("furniture");
        const listing = await Listing.addListing(testListing);
        const result = await Listing.getListing(listing.id);
        expect(result).toMatchObject(testListing);
    });

    test("can delete a listing", async () => {
        await Category.addCategory("furniture");
        const listing = await Listing.addListing(testListing);
        await Listing.deleteListing(listing.id);
        const result = await Listing.getAllListings();
        expect(result).toEqual([]);
    });

    test("fails to delete a listing that doesn't exist", async () => {
        expect(async () => {
            await Listing.deleteListing(0);
        }).rejects.toThrow(NotFoundError);
    });

    test("can update a listing", async () => {
        await Category.addCategory("furniture");
        const listing = await Listing.addListing(testListing);
        const result = await Listing.updateListing(listing.id, {
            created_by: "testUser",
            title: "My Updated Test Listing",
            description: "a nice couch",
            image: "couch.jpg",
            starting_bid: "500.00",
            category: "furniture",
            end_datetime: "2022-01-01 00:00:00"
        });
        expect(result).toMatchObject({
            created_by: "testUser",
            title: "My Updated Test Listing",
            description: "a nice couch",
            image: "couch.jpg",
            starting_bid: "500.00",
            category: "furniture",
            end_datetime: new Date('2022-01-01T00:00:00.000Z')
        });
    });

    test("fails to update a listing that doesn't exist", async () => {
        expect(async () => {
            await Listing.updateListing(0, {
                created_by: "testUser",
                title: "My Updated Test Listing",
                description: "a nice couch",
                image: "couch.jpg",
                starting_bid: "500.00",
                category: "furniture",
                end_datetime: "2022-01-01 00:00:00"
            });
        }).rejects.toThrow(NotFoundError);
    });

    test("can get a listing by created_by", async () => {
        await Category.addCategory("furniture");
        const listing = await Listing.addListing(testListing);
        const result = await Listing.getListingsByCreatedBy(listing.created_by);
        expect(result).toMatchObject([testListing]);
    });
});