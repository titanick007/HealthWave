const connection = require('../database');

const addNewMeds = (req, res) => {
    const { name, quantity, unitPrice, description } = req.body;

    // Query to insert a new medicine into the Pharmacy table
    const query = 'INSERT INTO Pharmacy (name, quantity_available, unit_price, description) VALUES (?, ?, ?, ?)';

    // Execute the query using the existing connection
    connection.query(query, [name, quantity, unitPrice, description], (error, results) => {
        if (error) {
            console.error('Error adding new medicine:', error);
            res.status(500).send('Error adding new medicine');
        } else {
            res.status(200).send('New medicine added successfully. <br> <a href="/admin/manage-pharmacy">Go to pharmacy page</a>');
        }
    });
};

module.exports = {addNewMeds};
