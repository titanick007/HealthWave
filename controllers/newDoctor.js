const bcrypt = require('bcrypt');
const connection = require('../database.js');
const session = require('express-session');


const doctor_register = (req, res) => {
    const { emailId, password, name, department, contact_number } = req.body;

    // Validate input data
    if (!emailId || !password || !name || !department || !contact_number) {
        return res.status(400).send('All fields are required');
    }

    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hashPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('An error occurred while hashing password');
        }

        // Insert the doctor's username, password, and role into the users table
        const insertUserQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        connection.query(insertUserQuery, [emailId, hashPassword, 'doctor'], (error, userResults) => {
            if (error) {
                console.error('Error inserting doctor user:', error);
                return res.status(500).send('An error occurred while inserting doctor user');
            }

            // Get the user ID of the newly registered doctor
            const userId = userResults.insertId;

            // Insert the doctor's details into the doctors table
            const insertDoctorQuery = 'INSERT INTO doctors (user_id, name, specialization, contact_number) VALUES (?, ?, ?, ?)';
            connection.query(insertDoctorQuery, [userId, name, department, contact_number], (error, doctorResults) => {
                if (error) {
                    console.error('Error inserting doctor:', error);
                    return res.status(500).send('An error occurred while inserting doctor');
                }

                // Doctor registered successfully
                res.redirect('/doctor-dashboard');
            });
        });
    });
};

module.exports = { doctor_register };
