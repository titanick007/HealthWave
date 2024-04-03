const connection = require('../database.js');

function fetchDoctorsFromDatabase() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM doctors';
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching doctors:', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = fetchDoctorsFromDatabase;
