const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const mariadb = require('mariadb');
const dbconfig = require("../dbconfig");

// Database connection
const pool = mariadb.createPool(dbconfig);

class GenresModel {
  // Get all event types
  async getAllEventTypes() {
    try {
      const QUERY = `SELECT eventTypeId, eventTypeName FROM eventtypes`;
      const rows = await pool.query(QUERY);
      return rows;
    } catch (err) {
      console.error("Get EventTypes Error: ", err);
      throw err;
    }
  }

  // Get all genres, optionally filtered by eventTypeId
  async getAllGenres(eventTypeId = null) {
    try {
      let QUERY = `SELECT genreId, name, eventTypeId FROM genres`;
      const params = [];

      if (eventTypeId) {
        QUERY += ` WHERE eventTypeId = ?`;
        params.push(eventTypeId);
      }

      const rows = await pool.query(QUERY, params);
      return rows;
    } catch (err) {
      console.error("Get Genres Error: ", err);
      throw err;
    }
  }
}

module.exports = new GenresModel();
