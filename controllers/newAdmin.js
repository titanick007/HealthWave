const bcrypt= require('bcrypt');
const session = require('express-session');
const connection=require('../database');

const admin_register= async(req, res) => {
    const { emailId, password } = req.body;
  
    // Validate emailId
    if (!emailId) {
      return res.status(400).send('EmailId cannot be empty');
    }
  
    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('An error occurred while hashing password');
      }
  
      // Insert the admin's information into the users table
      const insertQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      connection.query(insertQuery, [emailId, hash, 'administrator'], (error, results) => {
        if (error) {
          console.error('Error inserting admin:', error);
          return res.status(500).send('An error occurred while inserting admin');
        }
  
        // Admin registered successfully
        res.status(201).send('Admin registered successfully');
      });
    });
  }

  module.exports={admin_register};