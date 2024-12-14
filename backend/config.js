"use strict";

require("dotenv").config();

require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
// const LISTING_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days
const LISTING_DURATION_SECONDS = 5 * 60;
const JOB_QUEUE = "listingsToEnd";
const FAKE_DATA_QUEUE = "generateFakeData";
const PG_BOSS_ENABLED = process.env.PG_BOSS_ENABLED || true;
const FAKE_USERS = ["johnDoe", "janeDoe", "bobSmith"];

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  const databaseName = (process.env.NODE_ENV === "test")
      ? "ebid_test"
      : "ebid";

  return process.env.DATABASE_URL || `postgresql://localhost:5432/${databaseName}`;
}

console.log("eBid Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  LISTING_DURATION_SECONDS,
  JOB_QUEUE,
  FAKE_DATA_QUEUE,
  PG_BOSS_ENABLED,
  FAKE_USERS,
  PORT,
  getDatabaseUri,
};
