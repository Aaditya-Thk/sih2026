const Database = require("better-sqlite3");

const db = new Database("thermoshield.db");

// Create wards table if it doesn't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS wards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward INTEGER UNIQUE NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        temperature REAL NOT NULL DEFAULT 0,
        humidity REAL NOT NULL DEFAULT 0,
        wind REAL NOT NULL DEFAULT 0,
        radiation REAL NOT NULL DEFAULT 0,
        wbgt REAL NOT NULL DEFAULT 0,
        utci REAL NOT NULL DEFAULT 0,
        population INTEGER NOT NULL DEFAULT 0,
        risk TEXT NOT NULL DEFAULT 'Unknown'
    )
`).run();

// Create forecasts table if it doesn't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS forecasts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT UNIQUE NOT NULL,
        date TEXT NOT NULL,
        temp REAL NOT NULL,
        feels REAL NOT NULL,
        humidity REAL NOT NULL,
        wind REAL NOT NULL,
        radiation REAL NOT NULL,
        wbgt REAL NOT NULL,
        utci REAL NOT NULL,
        risk TEXT NOT NULL
    )
`).run();

module.exports = db;