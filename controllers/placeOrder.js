const connection = require('../database');

const placeOrder = (req, res) => {
    const { medicine, quantity } = req.body;


    // Query to update the quantity of the chosen medicine
    const query = 'UPDATE Pharmacy SET quantity_available = quantity_available + ? WHERE name = ?';

    // Execute the query using the existing connection
    connection.query(query, [quantity, medicine], (error, results) => {
        if (error) {
            console.error('Error placing order:', error);
            res.status(500).send('Error placing order');
        } else {
            // Check if any rows were affected by the update
            if (results.affectedRows === 0) {
                res.status(404).send('Medicine not found');
            } else {
                res.status(200).send('Order placed successfully.<br> <a href="/admin/manage-pharmacy">Go to pharmacy page</a>');
            }
        }
    });
};

module.exports = {placeOrder};
