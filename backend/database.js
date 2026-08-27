const Database = require("better-sqlite3");

const db = new Database("thermoshield.db");

module.exports = db;