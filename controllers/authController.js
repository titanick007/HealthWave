const bcrypt = require('bcrypt');
const session = require('express-session');
const connection = require('../database');
const express  = require('express');

const login= async(req, res)=>{
    const { username, password } = req.body;
    if(!username || !password) return res.send('Username and password are required');
  
    // Verify the credentials and retrieve the user's role and hashed password
    const sql_query = 'SELECT * FROM users WHERE username = ?';
    connection.query(sql_query, [username], (error, results) => {
        if (error) {
            console.error('Error verifying username:', error);
            return res.status(500).send('An error occurred while verifying username');
        }
  
        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }
        const user = results[0];
        const hashedPasswordFromDB = user.password;
  
        // Compare the hashed password from the database with the provided password
        bcrypt.compare(password, hashedPasswordFromDB, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('An error occurred while comparing passwords');
            }
  
            if (!result) {
                return res.status(401).send('Invalid username or password');
            }

            // Store user_id in session
            req.session.user_id = user.user_id;
            console.log(req.session.user_id);
  
            // Redirect based on the user's role
            switch (user.role) {
                case 'patient':
                    res.redirect('/patient-dashboard');
                    break;
                case 'doctor':
                    res.redirect('/doctor-dashboard');
                    break;
                case 'employee':
                    res.redirect('/employee-dashboard');
                    break;
                case 'administrator':
                    res.redirect('/admin-dashboard');
                    break;
                default:
                    res.status(500).send('Invalid role');
            }
        });
    });
};
  
module.exports = {login};