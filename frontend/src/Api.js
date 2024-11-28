import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class Api {
  // the token for interacting with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${Api.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Login a user. */
  static async login(data) {
    let res = await this.request(`auth/login`, data, "post");
    return res.token;
  }

  /** Register a user. */
  static async register(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Create a new listing. */
  static async createListing(data) {
    let res = await this.request(`listings`, data, "post");
    return res.listing;
  }

  /** Get user by username. */
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get all listings. */
  static async getListings() {
    let res = await this.request(`listings`);
    return res;
  }

  /** Get a listing by id. */
  static async getListing(id) {
    let res = await this.request(`listings/${id}`);
    return res.listing;
  }

  /** Watch a listing. */
  static async watchListing(username, listing_id) {
    const data = { listing_id };
    let res = await this.request(`watched-listings/by-username/${username}`, data, "post");
    return res.listing;
  }

  /** Unwatch a listing. */
  static async unwatchListing(username, listing_id) {
    const data = { listing_id };
    let res = await this.request(`watched-listings/by-username/${username}`, data, "delete");
    return res.listing;
  }

  /** Get listings watched by username. */
  static async getWatchedListings(username) {
    let res = await this.request(`listings/watched_by/${username}`);
    return res.listings;
  }

  /** Check if user watches a listing */
  static async isWatching(username, listing_id) {
    let res = await this.request(`users/${username}/watches/${listing_id}`);
    return res;
  }

  /** Add bid on listing */
  static async addBid(username, listing_id, bid) {
    const data = { bid };
    let res = await this.request(`bidders/${username}/${listing_id}`, data, "post");
    return res.bid;
  }
}

export default Api;
