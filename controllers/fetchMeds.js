const connection = require('../database');

function fetchAvailableMedicines(callback) {
    // Query to fetch available medicines from the Pharmacy table
    const query = 'SELECT * FROM Pharmacy WHERE quantity_available > 0';

    // Execute the query
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching available medicines:', error);
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}





module.exports = {fetchAvailableMedicines};