const sqlite3 = require('sqlite3').verbose();

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('cameraToggle');
    const saveButton = document.getElementById('saveSettings');

    // Fetch the current setting from the database and set the checkbox state
    const db = new sqlite3.Database('./settings.db');
    db.get("SELECT value FROM settings WHERE name = ?", ['use_camera'], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (row) {
            toggle.checked = row.value === 'true';
        }
    });

    // Show "Save" button when the toggle state changes
    toggle.addEventListener('change', () => {
        saveButton.style.display = 'block';
    });

    // Save the new setting when the "Save" button is clicked
    saveButton.addEventListener('click', () => {
        const newValue = toggle.checked ? 'true' : 'false';

        db.run(
            "UPDATE settings SET value = ? WHERE name = ?",
            [newValue, 'use_camera'],
            function (err) {
                if (err) {
                    console.error(err.message);
                    alert('Error saving settings');
                } else {
                    alert('Settings saved successfully');
                    saveButton.style.display = 'none'; // Hide the button after saving
                }
            }
        );
    });

    // Close the database connection when the page is unloaded
    window.addEventListener('beforeunload', () => {
        db.close();
    });
});
