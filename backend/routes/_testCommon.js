"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Listing = require("../models/listing");
const { createToken } = require("../helpers/tokens");
const Category = require("../models/category.js");

const testListing = {
  created_by: "u1",
  title: "My Test Listing",
  description: "a nice couch",
  image: "couch.jpg",
  starting_bid: "500.00",
  category: "furniture",
  end_datetime: "2022-01-01T00:00:00.000Z"
}

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM bidders");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM watched_listings");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM listings");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");  
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM categories");
 
  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });

  await Category.addCategory("furniture");

  await Listing.addListing(testListing);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
  testListing,
};
