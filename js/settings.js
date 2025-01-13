const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./settings.db');

// Fetch a setting
db.get("SELECT value FROM settings WHERE name = ?", ['use_camera'], (err, row) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(`Use Camera setting: ${row.value}`);
    }
});

// Close the database connection
db.close();
