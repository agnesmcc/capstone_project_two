"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const { restart } = require("nodemon");

class User {
    static async getAllUsers() {
        const result = await db.query(`SELECT * FROM users`);
        return result.rows;
    }

    static async authenticate(username, password) {
        // try to find the user first
        const result = await db.query(
              `SELECT username,
                      first_name AS "firstName",
                      last_name AS "lastName",
                      password,
                      email,
                      is_admin AS "isAdmin"
               FROM users
               WHERE username = $1`,
            [username],
        );
    
        const user = result.rows[0];
    
        if (user) {
          // compare hashed password to a new hash from password
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid === true) {
            delete user.password;
            return user;
          }
        }
    
        throw new UnauthorizedError("Invalid username/password");
      }

    static async register({ username, firstName, lastName, password, email }) {
      if (!username || !firstName || !lastName || !password || !email) {
        throw new BadRequestError("Required fields missing");
      }

      const duplicateCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
          [username],
      );
  
      if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate username: ${username}`);
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const result = await db.query(
            `INSERT INTO users
             (username,
              first_name,
              last_name,
              password,
              email)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
          [
            username,
            firstName,
            lastName,
            hashedPassword,
            email
          ],
      );
  
      const user = result.rows[0];
  
      return user;
    }

    static async delete(username) {
        const result = await db.query(
            `DELETE FROM users WHERE username = $1 RETURNING username`,
            [username]
        );
        if (result.rows.length === 0) {
            throw new NotFoundError(`No user: ${username}`);
        }
    }
    
    static async getUser(username) {
        const result = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email
             FROM users
             WHERE username = $1`,
            [username]
        );
        if (result.rows.length === 0) {
          throw new NotFoundError(`No user: ${username}`);
        }
        return result.rows[0];
    }

    static async isWatching(username, listing_id) {
        const result = await db.query(
            `SELECT username, listing_id
             FROM watched_listings
             WHERE username = $1 AND listing_id = $2`,
            [username, listing_id]  
        )
        if (result.rows.length === 0) {
          return false
        } else {
          return true
        }
    }

    static async isBiddingOn(username) {
        const result = await db.query(
            `SELECT DISTINCT l.id, l.created_by, l.title, l.description, l.image, l.starting_bid, l.category, l.end_datetime
             FROM bidders b
             JOIN listings l ON b.listing_id = l.id
             WHERE b.bidder = $1`,
            [username]
        )
        return result.rows
    }
}

module.exports = User;
